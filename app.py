from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


app = Flask(__name__)
app.secret_key = "zenmed_secret_key"


# ---------------- DATABASE CONNECTION ----------------
def get_db_connection():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


# ---------------- DATABASE INITIALIZATION ----------------
def init_db():
    conn = get_db_connection()

    # Users table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    # Glucose logs
    conn.execute("""
        CREATE TABLE IF NOT EXISTS glucose_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            fasting_level INTEGER,
            post_meal_level INTEGER,
            date TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Diet logs
    conn.execute("""
        CREATE TABLE IF NOT EXISTS diet_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            meal_type TEXT,
            description TEXT,
            date TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    # Exercise logs
    conn.execute("""
        CREATE TABLE IF NOT EXISTS exercise_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            exercise_name TEXT,
            duration INTEGER,
            date TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()


# ---------------- HOME ----------------
@app.route('/')
def home():
    return redirect(url_for('login'))


# ---------------- REGISTER ----------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = generate_password_hash(request.form['password'])

        conn = get_db_connection()
        try:
            conn.execute(
                "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                (name, email, password)
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            return "Email already exists!"
        conn.close()

        return redirect(url_for('login'))

    return render_template('register.html')


# ---------------- LOGIN ----------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = get_db_connection()
        user = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            return redirect(url_for('dashboard'))
        else:
            return "Invalid Credentials ❌"

    return render_template('login.html')


# ---------------- DASHBOARD ----------------
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    return render_template('dashboard.html', name=session['user_name'])


# ---------------- ADD GLUCOSE ----------------
@app.route('/add_glucose', methods=['GET', 'POST'])
def add_glucose():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        fasting = request.form['fasting']
        post_meal = request.form['post_meal']
        date = datetime.now().strftime("%Y-%m-%d")

        conn = get_db_connection()
        conn.execute("""
            INSERT INTO glucose_logs (user_id, fasting_level, post_meal_level, date)
            VALUES (?, ?, ?, ?)
        """, (session['user_id'], fasting, post_meal, date))
        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template('add_glucose.html')


# ---------------- ADD DIET ----------------
@app.route('/add_diet', methods=['GET', 'POST'])
def add_diet():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        meal_type = request.form['meal_type']
        description = request.form['description']
        date = datetime.now().strftime("%Y-%m-%d")

        conn = get_db_connection()
        conn.execute("""
            INSERT INTO diet_logs (user_id, meal_type, description, date)
            VALUES (?, ?, ?, ?)
        """, (session['user_id'], meal_type, description, date))
        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template('add_diet.html')


# ---------------- ADD EXERCISE ----------------
@app.route('/add_exercise', methods=['GET', 'POST'])
def add_exercise():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        exercise_name = request.form['exercise_name']
        duration = request.form['duration']
        date = datetime.now().strftime("%Y-%m-%d")

        conn = get_db_connection()
        conn.execute("""
            INSERT INTO exercise_logs (user_id, exercise_name, duration, date)
            VALUES (?, ?, ?, ?)
        """, (session['user_id'], exercise_name, duration, date))
        conn.commit()
        conn.close()

        return redirect(url_for('dashboard'))

    return render_template('add_exercise.html')


# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))


# ---------------- RUN APP ----------------
if __name__ == "__main__":
    init_db()
    app.run(debug=True)
