import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, ShieldCheck, Zap, Bell, CheckCircle2, FileVideo, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCreateRequestClick = () => {
    if (isAuthenticated) {
      navigate('/requests/new');
    } else {
      navigate('/login?redirect=requests/new');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                  Streamline Your Document Collection Process
                </h1>
                <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                  Request, collect, and verify client documents securely with magic links. Stop chasing emails and automate your onboarding workflow today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup" className="btn btn-primary px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <a href="#how-it-works" className="btn btn-secondary px-8 py-3 text-lg">
                    Learn More
                  </a>
                </div>
              </div>
              <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl transform translate-x-10 translate-y-10"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileVideo className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Document Request</h4>
                      <p className="text-sm text-slate-500">Sent via Secure Magic Link</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">Aadhaar Card</span>
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium">Bank Statement</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-blue-700">
              <div className="py-2">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-200">Documents Verified</div>
              </div>
              <div className="py-2">
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-blue-200">Accuracy & Security</div>
              </div>
              <div className="py-2">
                <div className="text-4xl font-bold mb-2">2x</div>
                <div className="text-blue-200">Faster Processing</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
              <p className="text-lg text-slate-600">A seamless process for both you and your clients.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative text-center">
              <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-0.5 bg-slate-200 -z-10"></div>
              
              <div className="relative pt-6 md:pt-0">
                <div className="mx-auto w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">1</div>
                <h3 className="text-lg font-semibold mb-2">Create Request</h3>
                <p className="text-sm text-slate-500">Select required documents and enter client details.</p>
              </div>
              <div className="relative pt-6 md:pt-0">
                <div className="mx-auto w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">2</div>
                <h3 className="text-lg font-semibold mb-2">Send to Client</h3>
                <p className="text-sm text-slate-500">System automatically sends SMS and Email with a magic link.</p>
              </div>
              <div className="relative pt-6 md:pt-0">
                <div className="mx-auto w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">3</div>
                <h3 className="text-lg font-semibold mb-2">Client Uploads</h3>
                <p className="text-sm text-slate-500">Client uploads securely without needing an account.</p>
              </div>
              <div className="relative pt-6 md:pt-0">
                <div className="mx-auto w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center font-bold text-xl mb-4 border-4 border-white shadow-sm">4</div>
                <h3 className="text-lg font-semibold mb-2">Verify & Approve</h3>
                <p className="text-sm text-slate-500">Review documents, approve or request re-upload.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Grade Features</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Secure Storage", desc: "All files are encrypted and securely stored on Cloudinary." },
                { icon: Bell, title: "Email & SMS Alerts", desc: "Automated notifications keep the process moving." },
                { icon: Zap, title: "Real-time Tracking", desc: "Monitor the status of every request on your dashboard." },
                { icon: FileVideo, title: "Easy Re-upload", desc: "One-click rejection loops direct clients to fix specific files." },
                { icon: Users, title: "Role-Based Access", desc: "Built securely to protect client data from unauthorized access." },
                { icon: CheckCircle2, title: "Verified Archive", desc: "A clean audit log of when documents were uploaded and verified." }
              ].map((f, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-secondary rounded-lg flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-800">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Send a Document Request Now</h2>
            <p className="text-lg text-slate-600 mb-8 mx-auto max-w-2xl">
              Stop waiting on physical mail or insecure email attachments. Start collecting documents the modern way.
            </p>
            <button 
              onClick={handleCreateRequestClick}
              className="btn btn-primary px-8 py-4 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <Zap className="w-5 h-5 mr-2" />
              Create Request & Notify Client
            </button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
