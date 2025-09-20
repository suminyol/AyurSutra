import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { ROUTES } from '../constants';
import {
  HeartIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon,
  CheckIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { toggle, isDark } = useTheme();

  const features = [
    {
      name: 'Automated Therapy Scheduling',
      description: 'Intelligent scheduling system that automatically manages therapy sessions and optimizes practitioner availability.',
      icon: CalendarDaysIcon,
    },
    {
      name: 'Real-Time Progress Tracking',
      description: 'Visual progress tracking with charts and milestones to monitor patient recovery and therapy effectiveness.',
      icon: ChartBarIcon,
    },
    {
      name: 'Smart Notifications',
      description: 'Automated alerts for pre and post-procedure precautions, session reminders, and important updates.',
      icon: BellIcon,
    },
    {
      name: 'Patient Management',
      description: 'Comprehensive patient profiles with medical history, therapy records, and personalized care plans.',
      icon: UserGroupIcon,
    },
  ];

  const therapyTypes = [
    {
      name: 'Vamana',
      description: 'Therapeutic vomiting for Kapha detoxification',
      benefits: ['Respiratory improvement', 'Digestive enhancement', 'Toxin removal'],
    },
    {
      name: 'Virechana',
      description: 'Purgation therapy for Pitta balance',
      benefits: ['Liver function', 'Skin health', 'Pitta detoxification'],
    },
    {
      name: 'Basti',
      description: 'Enema therapy for Vata disorders',
      benefits: ['Nervous system', 'Joint health', 'Vata balance'],
    },
    {
      name: 'Nasya',
      description: 'Nasal therapy for head and neck conditions',
      benefits: ['Mental clarity', 'Sensory functions', 'Nasal health'],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AyurSutra</span>
            </Link>
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggle}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Panchakarma Patient Management
              <span className="text-primary-600"> Made Simple</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Streamline your Ayurvedic practice with our comprehensive therapy scheduling and patient management software. 
              Experience the perfect blend of traditional wisdom and modern technology.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={ROUTES.REGISTER}
                className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                Get started
                <ArrowRightIcon className="ml-2 h-4 w-4 inline" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Comprehensive Panchakarma Management
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our platform provides all the tools you need to manage your Ayurvedic practice efficiently and effectively.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Therapy types section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">Therapy Types</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Traditional Panchakarma Therapies
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Manage all five traditional Panchakarma therapies with our comprehensive scheduling and tracking system.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {therapyTypes.map((therapy) => (
              <div key={therapy.name} className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{therapy.name}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{therapy.description}</p>
                <ul className="mt-4 space-y-2">
                  {therapy.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckIcon className="h-4 w-4 text-primary-600 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your practice?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Join thousands of practitioners who trust AyurSutra to manage their Panchakarma therapy programs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to={ROUTES.REGISTER}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started today
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold leading-6 text-white hover:text-primary-100"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
              &copy; 2024 AyurSutra. All rights reserved.
            </p>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AyurSutra</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
