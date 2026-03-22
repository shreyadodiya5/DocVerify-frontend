import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FileCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [emailForResend, setEmailForResend] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const redirect = searchParams.get('redirect') || '/dashboard';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setNotVerified(false);
    setEmailForResend(data.email);
    try {
      await login(data.email, data.password);
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    } catch (error) {
      if (error.response?.data?.notVerified) {
        setNotVerified(true);
      }
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const { data } = await api.post('/auth/resend-verification', { email: emailForResend });
      toast.success(data.message || 'Verification email sent!');
      setNotVerified(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <FileCheck className="h-10 w-10 text-primary" />
          <span className="font-bold text-2xl text-slate-800 tracking-tight">DocVerify</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link to={`/signup?redirect=${redirect}`} className="font-medium text-primary hover:text-blue-800">
            start your free account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  className={`input pl-10 ${errors.email ? 'border-error focus:border-error focus:ring-error' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  className={`input pl-10 ${errors.password ? 'border-error focus:border-error focus:ring-error' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-blue-800 shrink-0">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            {notVerified && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800 mb-3">
                  Your email is not verified. Please check your inbox or click below to resend the link.
                </p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm font-semibold text-amber-900 border-b border-amber-900 hover:text-amber-700 disabled:opacity-50"
                >
                  {resending ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
