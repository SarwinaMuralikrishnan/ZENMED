import { Activity } from "lucide-react";

const Footer = () => (
  <footer className="bg-sidebar py-12">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold font-display text-sidebar-foreground">ZenMed</span>
        </div>
        <p className="text-sm text-sidebar-foreground/60">
          Built by Team ZenMed — Subetha T, Sruthi S, Sarwina M
        </p>
        <p className="text-sm text-sidebar-foreground/40">
          © {new Date().getFullYear()} ZenMed. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
