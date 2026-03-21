import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <FileCheck className="h-8 w-8 text-accent" />
              <span className="font-bold text-xl text-white tracking-tight">DocVerify</span>
            </Link>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Streamlining document collection and verification with secure, magical links and automated reminders.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#how-it-works" className="hover:text-accent transition-colors">How it Works</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link to="/pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/security" className="hover:text-accent transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>support@docverify.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>123 Tech Park, Bangalore, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} DocVerify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
