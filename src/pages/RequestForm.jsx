import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DocumentSelect from './DocumentSelect';
import { requestService } from '../services/requestService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { isManagerUser } from '../utils/roles';
import { User, Mail, Phone, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const RequestForm = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    description: ''
  });
  
  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    if (user && !isManagerUser(user)) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const lookupClientByEmail = async () => {
    const email = formData.recipientEmail?.trim();
    if (!email || !email.includes('@')) return;
    try {
      const res = await userService.lookupClient(email);
      if (res.success && res.data) {
        setFormData((f) => ({
          ...f,
          recipientName: f.recipientName?.trim() ? f.recipientName : res.data.name || '',
          recipientPhone: f.recipientPhone?.trim() ? f.recipientPhone : res.data.phone || '',
        }));
        toast.success('Client found — details filled from their account');
      }
    } catch {
      /* optional: invalid client */
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async () => {
    if (selectedDocs.length === 0) {
      toast.error('Please select at least one document');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        requiredDocuments: selectedDocs
      };
      
      const res = await requestService.createRequest(payload);
      toast.success('Request sent successfully!');
      navigate(`/requests/${res.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-8 lg:pt-8 min-w-0">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Create New Request</h1>
            <p className="text-sm text-slate-500 mt-1">
              The recipient must already have a <strong className="font-semibold text-slate-700">Client</strong>{' '}
              account registered with the same email. They will receive email and SMS with a secure upload link.
            </p>
          </div>

          <div className="mb-8 relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-200">
              <div 
                style={{ width: `${(step / 2) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300"
              ></div>
            </div>
            <div className="flex justify-between text-xs font-semibold text-slate-500">
              <span className={step >= 1 ? 'text-primary' : ''}>Step 1: Client Details</span>
              <span className={step >= 2 ? 'text-primary' : ''}>Step 2: Select Documents</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 animate-fade-in">
            {step === 1 ? (
              <form onSubmit={handleNext} className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Recipient Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        className="input pl-10"
                        placeholder="John Doe"
                        value={formData.recipientName}
                        onChange={e => setFormData({...formData, recipientName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Recipient Phone</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        className="input pl-10"
                        placeholder="+91 9876543210"
                        value={formData.recipientPhone}
                        onChange={e => setFormData({...formData, recipientPhone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Recipient Email</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="input pl-10"
                      placeholder="john@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      onBlur={lookupClientByEmail}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Message / Instructions (Optional)</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      rows="3"
                      className="input pl-10 pt-3"
                      placeholder="Please note these documents are required for background verification."
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button type="submit" className="btn btn-primary px-8">
                    Next Step
                  </button>
                </div>
              </form>
            ) : (
              <DocumentSelect 
                selectedDocs={selectedDocs}
                setSelectedDocs={setSelectedDocs}
                onBack={() => setStep(1)}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestForm;
