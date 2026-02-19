from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.secret_key = "zenmed_secret_key_secure_production"

def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    conn.execute("PRAGMA foreign_keys = ON")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'patient', -- patient, doctor, caregiver
            language TEXT DEFAULT 'en', -- en, ta
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS glucose_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            fasting_level INTEGER,
            post_meal_level INTEGER,
            date TEXT,
            notes TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS diet_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            plan_json TEXT, -- Store generated plan as JSON
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS exercise_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            exercise_name TEXT,
            duration INTEGER, -- minutes
            date TEXT,
            posture_score INTEGER, -- AI Score
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS reminders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT,
            time TEXT,
            type TEXT, -- medicine, exercise, water
            active INTEGER DEFAULT 1,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER, -- The user who generated the alert
            type TEXT, -- HIGH_SUGAR, LOW_SUGAR, MISSED_EXERCISE
            message TEXT,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(patient_id) REFERENCES users(id)
        )
    """)
    try:
        conn.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'patient'")
    except sqlite3.OperationalError:
        pass
    
    try:
        conn.execute("ALTER TABLE users ADD COLUMN language TEXT DEFAULT 'en'")
    except sqlite3.OperationalError:
        pass

    conn.commit()
    conn.close()

def check_alerts(user_id, fasting, post_meal):
    alerts = []
    if fasting and (int(fasting) > 250 or int(fasting) < 70):
        alerts.append(f"Critical Fasting Glucose: {fasting} mg/dL")
    if post_meal and (int(post_meal) > 250 or int(post_meal) < 70):
        alerts.append(f"Critical Post-Meal Glucose: {post_meal} mg/dL")
    
    if alerts:
        conn = get_db_connection()
        for msg in alerts:
            conn.execute("INSERT INTO alerts (patient_id, type, message) VALUES (?, ?, ?)", 
                         (user_id, 'CRITICAL_GLUCOSE', msg))
        conn.commit()
        conn.close()

# --- Routes ---

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])
        role = request.form.get('role', 'patient')
        language = request.form.get('language', 'en')

        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (name, email, password, role, language) VALUES (?, ?, ?, ?, ?)",
                (name, email, password, role, language)
            )
            conn.commit()
            flash("Registration Successful! Please Login.")
        except sqlite3.IntegrityError:
            flash("Email already exists!")
            conn.close()
            return render_template('register.html', error="Email already exists!")
        
        conn.close()
        return redirect(url_for('login'))

    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['role'] = user['role']
            session['lang'] = user['language']
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error="Invalid Credentials")

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_id = session['user_id']
    conn = get_db_connection()

    glucose_data = conn.execute("SELECT * FROM glucose_logs WHERE user_id = ? ORDER BY date DESC LIMIT 7", (user_id,)).fetchall()
    exercise_data = conn.execute("SELECT * FROM exercise_logs WHERE user_id = ? ORDER BY date DESC LIMIT 5", (user_id,)).fetchall()
    reminders = conn.execute("SELECT * FROM reminders WHERE user_id = ? AND active = 1", (user_id,)).fetchall()

    avg_glucose = 0
    if glucose_data:
        vals = [g['fasting_level'] for g in glucose_data if g['fasting_level']]
        if vals: avg_glucose = sum(vals) / len(vals)

    conn.close()
    
    return render_template('dashboard.html', 
                           user=session, 
                           glucose=glucose_data, 
                           exercises=exercise_data, 
                           reminders=reminders,
                           avg_glucose=round(avg_glucose, 1))

@app.route('/glucose', methods=['GET', 'POST'])
def add_glucose():
    if 'user_id' not in session: return redirect(url_for('login'))
    
    if request.method == 'POST':
        fasting = request.form.get('fasting')
        post_meal = request.form.get('post_meal')
        date = request.form.get('date', datetime.now().strftime("%Y-%m-%d"))
        
        check_alerts(session['user_id'], fasting, post_meal)

        conn = get_db_connection()
        conn.execute("INSERT INTO glucose_logs (user_id, fasting_level, post_meal_level, date) VALUES (?, ?, ?, ?)",
                     (session['user_id'], fasting, post_meal, date))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
    
    return render_template('add_glucose.html', current_date=datetime.now().strftime("%Y-%m-%d"))

@app.route('/exercises', methods=['GET', 'POST'])
def add_exercise():
    if 'user_id' not in session: return redirect(url_for('login'))
    
    if request.method == 'POST':
        name = request.form.get('exercise_name')
        duration = request.form.get('duration')
        
        conn = get_db_connection()
        conn.execute("INSERT INTO exercise_logs (user_id, exercise_name, duration, date) VALUES (?, ?, ?, ?)",
                     (session['user_id'], name, duration, datetime.now().strftime("%Y-%m-%d")))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
        
    return render_template('add_exercise.html')

@app.route('/nutrition', methods=['GET', 'POST'])
def nutrition():
    if 'user_id' not in session: return redirect(url_for('login'))

    user_plan = None
    
    if request.method == 'POST':
        location = request.form.get('location')
        pref = request.form.get('preference')
        plan = {
            "breakfast": "Idli with Sambar (2 pcs) - Low GI",
            "lunch": "Brown Rice (1 cup) with Greens (Keerai) and Rasam",
            "dinner": "Chapati (2 pcs) with Dal",
            "snacks": "Roasted Chana or Fruit Salad"
        }
        
        if pref == 'Non-Veg':
            plan['breakfast'] = "Idly with Egg Curry (1 egg)"
            plan['lunch'] = "Brown Rice with Fish Curry (Small portion)"
            plan['dinner'] = "Chapati with Chicken gravy(Small portion)"
            plan['snacks'] = "Boiled egg or chicken soup (small bowl)"
        
        if location and "Madurai" in location:
             plan['breakfast'] = "Millet Pongal (Limited Ghee)"

        # Save to DB
        conn = get_db_connection()
        conn.execute("INSERT INTO diet_plans (user_id, plan_json) VALUES (?, ?)", 
                     (session['user_id'], json.dumps(plan)))
        conn.commit()
        conn.close()
        
        user_plan = plan
        flash("New Diet Plan Generated & Saved!", "success")
        
    else:
        # Load latest plan
        conn = get_db_connection()
        row = conn.execute("SELECT plan_json FROM diet_plans WHERE user_id = ? ORDER BY id DESC LIMIT 1", 
                           (session['user_id'],)).fetchone()
        conn.close()
        if row:
            user_plan = json.loads(row['plan_json'])
        
    return render_template('nutrition.html', plan=user_plan)

@app.route('/posture')
def posture_ai():
    if 'user_id' not in session: return redirect(url_for('login'))
    return render_template('posture.html')

@app.route('/save_posture_score', methods=['POST'])
def save_posture_score():
    if 'user_id' not in session: return jsonify({'status': 'error'})
    data = request.json
    score = data.get('score')
    exercise = data.get('exercise', 'General')
    duration = data.get('duration', 15)
    
    conn = get_db_connection()
    conn.execute("INSERT INTO exercise_logs (user_id, exercise_name, duration, date, posture_score) VALUES (?, ?, ?, ?, ?)",
                 (session['user_id'], exercise, duration, datetime.now().strftime("%Y-%m-%d"), score))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

@app.route('/reminders', methods=['GET', 'POST'])
def reminder_manager():
    if 'user_id' not in session: return redirect(url_for('login'))
    
    if request.method == 'POST':
        title = request.form['title']
        time = request.form['time']
        rtype = request.form['type']
        
        conn = get_db_connection()
        conn.execute("INSERT INTO reminders (user_id, title, time, type) VALUES (?, ?, ?, ?)",
                     (session['user_id'], title, time, rtype))
        conn.commit()
        conn.close()
        return redirect(url_for('dashboard'))
        
    return render_template('reminders.html')

@app.route('/doctor_portal')
def doctor_portal():
    if 'user_id' not in session or session.get('role') != 'doctor':
        return redirect(url_for('dashboard'))
        
    conn = get_db_connection()
    patients = conn.execute("SELECT * FROM users WHERE role = 'patient'").fetchall()
    alerts = conn.execute("""
        SELECT a.*, u.name 
        FROM alerts a 
        JOIN users u ON a.patient_id = u.id 
        WHERE a.is_read = 0
    """).fetchall()
    conn.close()
    
    return render_template('doctor_portal.html', patients=patients, alerts=alerts)

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
