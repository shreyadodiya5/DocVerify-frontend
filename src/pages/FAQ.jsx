import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: "How does DocVerify work?",
    a: "You create a request selecting which documents you need. The system sends your client an SMS and Email with a secure magic link. The client clicks the link, uploads the documents via their browser, and you get notified instantly."
  },
  {
    q: "Do my clients need to create an account to upload documents?",
    a: "No! That's the best part. Clients use secure, time-sensitive magic links to access a personalized upload portal without any registration friction."
  },
  {
    q: "How long is the upload link valid?",
    a: "For security purposes, upload links expire 7 days from the time they are generated. You can easily resend a notification to generate a fresh link if needed."
  },
  {
    q: "What file formats are accepted?",
    a: "We currently accept PDF, JPEG, and PNG formats, with a maximum file size of 10MB per document."
  },
  {
    q: "Is it secure?",
    a: "Absolutely. We use industry-standard encryption protocols and secure cloud storage infrastructure powered by Cloudinary."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-16">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden text-slate-800">
              <button 
                className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center focus:outline-none focus:bg-slate-50 hover:bg-slate-50"
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              >
                {faq.q}
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-5 text-slate-600 border-t border-slate-100 pt-3 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
