import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FileCheck, Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string()
    .matches(/^\+?[\d\s-]{10,14}$/, 'Must be a valid phone number (min 10 digits)')
    .required('Phone number is required'),
  accountType: yup
    .string()
    .oneOf(['manager', 'client'], 'Choose how you will use DocVerify')
    .required('Choose account type'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Signup = () => {
  const { register: registerAction } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { accountType: 'client' },
  });

  const accountType = watch('accountType');
  const redirect = searchParams.get('redirect') || '/dashboard';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerAction({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.accountType,
      });
      setIsSuccess(true);
      toast.success('Registration successful! Please check your email.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-2xl shadow-xl text-center border border-slate-100">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
          <p className="text-slate-600 mb-6">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <Link
            to="/login"
            className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6">
          <FileCheck className="h-10 w-10 text-primary" />
          <span className="font-bold text-2xl text-slate-800 tracking-tight">DocVerify</span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to={`/login?redirect=${redirect}`} className="font-medium text-primary hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className={`input pl-10 ${errors.name ? 'border-error focus:border-error focus:ring-error' : ''}`}
                    {...register('name')}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">Phone Number (+91)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    className={`input pl-10 ${errors.phone ? 'border-error focus:border-error focus:ring-error' : ''}`}
                    {...register('phone')}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone.message}</p>}
              </div>
            </div>

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
              <label className="label">I am signing up as</label>
              <p className="text-xs text-slate-500 mb-2">
                Managers send document requests to clients. Clients receive requests and upload files.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    accountType === 'manager'
                      ? 'border-primary bg-blue-50 ring-1 ring-primary'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input type="radio" value="manager" className="mt-1" {...register('accountType')} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">Manager / agent</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Request documents from clients, review, approve, or ask for changes.
                    </span>
                  </span>
                </label>
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    accountType === 'client'
                      ? 'border-primary bg-blue-50 ring-1 ring-primary'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input type="radio" value="client" className="mt-1" {...register('accountType')} />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">Client</span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Receive requests from managers, upload requested documents, and submit for review.
                    </span>
                  </span>
                </label>
              </div>
              {errors.accountType && (
                <p className="mt-1 text-sm text-error">{errors.accountType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div>
                <label className="label">Confirm Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    className={`input pl-10 ${errors.confirmPassword ? 'border-error focus:border-error focus:ring-error' : ''}`}
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
