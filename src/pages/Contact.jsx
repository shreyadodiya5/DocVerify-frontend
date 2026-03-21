import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Your message has been sent. We will get back to you shortly!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Get in Touch</h1>
          <p className="text-slate-600 mb-8">Have questions? We'd love to hear from you.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Name</label>
              <input 
                type="text" 
                required 
                className="input" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input 
                type="email" 
                required 
                className="input" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea 
                required 
                rows="5" 
                className="input"
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-full py-3">
              Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
