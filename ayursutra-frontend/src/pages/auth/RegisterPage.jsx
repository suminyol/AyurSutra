import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser } from '../../store/slices/authSlice';
import { ROUTES } from '../../constants';
import { EyeIcon, EyeSlashIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import LeafIcon from '../../components/icons/LeafIcon';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      // Initialize all doctor fields, even though they are hidden
      doctorId: '',
      qualification: '',
      specialization: '',
      yearsOfExperience: 0,
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    console.log("--- FINAL DATA OBJECT ON FRONTEND ---", data);
    data.role = isDoctor ? 'doctor' : 'patient';
    if (data.yearsOfExperience) {
      data.yearsOfExperience = parseInt(data.yearsOfExperience, 10);
    }
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Registration successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.error(error || 'Registration failed');
    }
  };

  const handleToggle = (isDoc) => {
    setIsDoctor(isDoc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center items-center py-8 sm:px-6 lg:px-8">
      <div className="w-full sm:max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              AyurSutra
            </span>
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-4">
            <SparklesIcon className="w-4 h-4 text-emerald-600 mr-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Join AyurSutra
            </span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Start managing your Panchakarma practice with AyurSutra
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg shadow-sm bg-slate-100 dark:bg-slate-700 p-1" role="group">
            <button
              type="button"
              className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                !isDoctor 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => handleToggle(false)}
            >
              Patient
            </button>
            <button
              type="button"
              className={`py-2 px-6 text-sm font-semibold rounded-md transition-all duration-200 ${
                isDoctor 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => handleToggle(true)}
            >
              Doctor
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 py-8 px-12 shadow-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-700">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Common Fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full name
                </label>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Name must be no more than 50 characters',
                    },
                  })}
                  type="text"
                  autoComplete="name"
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
              </div>
            </div>

            {/* Doctor Specific Fields */}
            {isDoctor && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="doctorId" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Doctor ID (e.g., Reg. No.)
                    </label>
                    <input
                      {...register('doctorId', { required: 'Doctor ID is required' })}
                      type="text"
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                      placeholder="Enter your Doctor ID"
                    />
                    {errors.doctorId && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.doctorId.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="qualification" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Qualification
                    </label>
                    <input
                      {...register('qualification', { required: 'Qualification is required' })}
                      type="text"
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                      placeholder="e.g., BAMS, MD"
                    />
                    {errors.qualification && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.qualification.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Specialization
                    </label>
                    <select
                      {...register('specialization', { required: 'Specialization is required' })}
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                    >
                      <option value="">Select a specialization</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Panchakarma Specialist">Panchakarma Specialist</option>
                      <option value="Ayurvedic Medicine">Ayurvedic Medicine</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Women's Health">Women's Health</option>
                    </select>
                    {errors.specialization && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.specialization.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Years of Experience
                    </label>
                    <input
                      {...register('yearsOfExperience', {
                        required: 'Experience is required',
                        min: { value: 0, message: 'Experience cannot be negative' },
                      })}
                      type="number"
                      className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                      placeholder="e.g., 5"
                    />
                    {errors.yearsOfExperience && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.yearsOfExperience.message}</p>}
                  </div>
                </div>
              </>
            )}
            
            {/* Remaining Common Fields */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Phone number
                </label>
                <input
                  {...register('phone', {
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Please enter a valid phone number',
                    },
                  })}
                  type="tel"
                  autoComplete="tel"
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Date of birth
                </label>
                <input
                  {...register('dateOfBirth')}
                  type="date"
                  className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Gender
              </label>
              <select
                {...register('gender')}
                className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 transition-all duration-200"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div>
                <div className="relative">
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 pr-12 transition-all duration-200"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emerald-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm password
                </label>
                <div>
                <div className="relative">
                  <input
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    className="block w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 focus:ring-2 sm:text-sm px-4 py-2.5 pr-12 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emerald-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  Already have an account?
                </span>
              </div>
            </div>
            <div className="mt-3">
              <Link
                to={ROUTES.LOGIN}
                className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>

         {/* Bottom Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Traditional Ayurvedic wisdom meets modern healthcare technology
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;