import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7B0080] to-[#A020A0] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-heading text-white">Find Teacher</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Connecting students with the best tutors in South Africa. 
              Find, book, and learn from qualified teachers in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-5">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/auth/role-select" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/auth/student/login" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Student Login
                </Link>
              </li>
              <li>
                <Link to="/auth/teacher/login" className="text-slate-400 hover:text-white text-sm transition-colors duration-200">
                  Teacher Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 text-slate-500" />
                support@findteacher.co.za
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 text-slate-500" />
                +27 (0) 12 345 6789
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500" />
                Cape Town, South Africa
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Find Teacher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
