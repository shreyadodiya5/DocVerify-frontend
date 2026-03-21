import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">About DocVerify</h1>
        <div className="prose prose-lg text-slate-600">
          <p>
            DocVerify was founded with a simple mission: to make the document collection process secure, painless, and blazing fast for both businesses and their clients.
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">The Problem We Solve</h2>
          <p>
            Traditional onboarding relies on messy email threads, insecure attachments, and endless follow-ups. We replace that chaos with a streamlined portal where clients are guided precisely on what to upload, and businesses can verify everything from a centralized dashboard.
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">Our Commitment</h2>
          <p>
            Security is our top priority. By utilizing enterprise-grade storage architectures and time-limited magic links, we ensure sensitive personal information never falls into the wrong hands.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
