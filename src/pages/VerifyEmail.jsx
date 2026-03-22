import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const hasCalled = React.useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;
      
      try {
        const res = await axios.get(`${API_BASE}/auth/verify/${token}`);
        if (res.data.success) {
          setStatus('success');
          setMessage(res.data.message);
        } else {
          setStatus('error');
          setMessage(res.data.message || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Invalid or expired verification link');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-100">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <h1 className="text-2xl font-bold text-slate-900">Verifying Email...</h1>
            <p className="text-slate-600">Please wait while we activate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Email Verified!</h1>
            <p className="text-slate-600">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
            >
              Sign In Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
            <p className="text-slate-600">{message}</p>
            <div className="mt-6 flex flex-col gap-3 w-full">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
