import { Link } from 'react-router-dom';
import snehan from "../assets/snehan.png";
import svedana from "../assets/svedana.png";

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
  SparklesIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  AcademicCapIcon,
  // --- ICONS ADDED FOR YOUR CHANGES ---
  CloudIcon,
  FireIcon,
  GlobeAltIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  BeakerIcon,
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

  const panchakarmaBenefits = [
    {
      title: 'Eliminate Toxins',
      description: 'Remove toxins and toxic conditions from your body and mind',
      icon: '🌿',
    },
    {
      title: 'Restore Balance',
      description: 'Restore your constitutional balance improving health and wellness',
      icon: '⚖️',
    },
    {
      title: 'Strengthen Immunity',
      description: 'Strengthen your immune system and become more resistant to illness',
      icon: '🛡️',
    },
    {
      title: 'Reverse Aging',
      description: 'Reverse the negative effects of stress on your body and mind thereby slowing the aging process',
      icon: '✨',
    },
    {
      title: 'Deep Relaxation',
      description: 'Bring about deep relaxation and a sense of well-being',
      icon: '🧘‍♀️',
    },
  ];

  const therapyTypes = [
    {
      name: 'Vamana',
      description: 'Therapeutic vomiting for Kapha detoxification',
      benefits: ['Respiratory improvement', 'Digestive enhancement', 'Toxin removal'],
      dosha: 'Kapha',
      element: 'Earth & Water',
      icon: ArrowUpCircleIcon, // Icon added
    },
    {
      name: 'Virechana',
      description: 'Purgation therapy for Pitta balance',
      benefits: ['Liver function', 'Skin health', 'Pitta detoxification'],
      dosha: 'Pitta',
      element: 'Fire & Water',
      icon: ArrowDownCircleIcon, // Icon added
    },
    {
      name: 'Basti',
      description: 'Enema therapy for Vata disorders',
      benefits: ['Nervous system', 'Joint health', 'Vata balance'],
      dosha: 'Vata',
      element: 'Air & Ether',
      icon: BeakerIcon, // Icon added
    },
    {
      name: 'Nasya',
      description: 'Nasal therapy for head and neck conditions',
      benefits: ['Mental clarity', 'Sensory functions', 'Nasal health'],
      dosha: 'Kapha & Vata',
      element: 'Air',
      icon: CpuChipIcon, // Icon added
    },
  ];



const purvakarmaSteps = [
  {
    name: "Snehan",
    description:
      "Oil massage applied to the entire body with a particular type of massage that helps the toxins to move toward the gastrointestinal tract.",
    details:
      "Oil massage also makes the superficial and deep tissues soft and supple, thus helping to remove stress and nourish the nervous system. Snehan is given daily for three to seven days, as indicated.",
    image: snehan,
  },
  {
    name: "Swedana",
    description:
      "Sudation or sweating given every day immediately following the snehan. An herbal concoction may be added to the steam to further loosen the toxins from the individual.",
    details:
      "Swedana liquefies the toxins and increases the movement of toxins into the gastrointestinal tract.",
    image: svedana,
  },
];

  

  const doshaElements = [
    { dosha: 'Vata', elements: ['Ether', 'Air'], color: 'text-slate-600 dark:text-slate-300', icon: CloudIcon },
    { dosha: 'Pitta', elements: ['Fire', 'Water'], color: 'text-orange-600 dark:text-orange-400', icon: FireIcon },
    { dosha: 'Kapha', elements: ['Water', 'Earth'], color: 'text-emerald-600 dark:text-emerald-400', icon: GlobeAltIcon },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AyurSutra</span>
            </Link>
          </div>
          <div className="flex lg:flex-1 lg:justify-end">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggle}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5 text-amber-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-slate-600" />
                )}
              </button>
              <Link
                to={ROUTES.LOGIN}
                className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <div className="relative isolate px-6 pt-24 lg:px-8">
        {/* --- CHANGE 1: Reduced vertical padding here --- */}
        <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-8">
              <SparklesIcon className="w-4 h-4 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Ancient Wisdom, Modern Technology</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl leading-tight">
              Panchakarma Patient Management
              <span className="block text-emerald-600 mt-2">Made Simple</span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Streamline your Ayurvedic practice with our comprehensive therapy scheduling and patient management software. 
              Experience the perfect blend of traditional Panchakarma wisdom and cutting-edge technology.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                to={ROUTES.REGISTER}
                className="group rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-200"
              >
                Get started
                <ArrowRightIcon className="ml-2 h-5 w-5 inline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="text-base font-semibold leading-6 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Panchakarma Introduction */}
      {/* --- CHANGE 4: Reduced padding --- */}
      <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Introduction to Panchakarma
            </h2>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              Panchakarma (five actions) is a cleansing and rejuvenating program for the body, mind, and consciousness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {panchakarmaBenefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-lg group-hover:shadow-xl transition-shadow">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ayurvedic Tridosha */}
      {/* --- CHANGE 4: Reduced padding --- */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Ayurvedic Tridosha
            </h2>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              Understanding the three fundamental energies that govern our physiology and psychology
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:space-x-12">
            {doshaElements.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 mx-auto bg-white dark:bg-slate-800 shadow-lg">
                    {/* --- CHANGE 2: Replaced placeholder with actual icon --- */}
                    <item.icon className={`w-12 h-12 ${item.color}`} aria-hidden="true" />
                  </div>
                  <h3 className={`text-2xl font-bold ${item.color} mb-2`}>{item.dosha}</h3>
                  <div className="space-y-1">
                    {item.elements.map((element, idx) => (
                      <div key={idx} className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {element}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purvakarma Section */}
   
    <div className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-800/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Purvakarma: Pre-purification Measures
          </h2>
          <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
            Before the actual purification begins, there is a need to prepare the body with prescribed methods to encourage it to let go of the toxins.
          </p>
        </div>
        
        <div className="space-y-12">
          {purvakarmaSteps.map((step, index) => (
            <div key={index} className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/3">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  
                  <img 
                    src={step.image} 
                    alt={step.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <div className="w-full lg:w-2/3">
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{step.name}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">{step.description}</p>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">{step.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      {/* Features section */}
      {/* --- CHANGE 4: Reduced padding --- */}
      <div className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-wide">Everything you need</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Comprehensive Panchakarma Management
            </p>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              Our platform provides all the tools you need to manage your Ayurvedic practice efficiently and effectively.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              {features.map((feature) => (
                <div key={feature.name} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-slate-900 dark:text-white mb-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="text-base leading-7 text-slate-600 dark:text-slate-300">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Therapy types section */}
      {/* --- CHANGE 4: Reduced padding --- */}
      <div className="bg-slate-50 dark:bg-slate-800/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-emerald-600 uppercase tracking-wide">Therapy Types</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Traditional Panchakarma Therapies
            </p>
            <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
              Manage all traditional Panchakarma therapies with our comprehensive scheduling and tracking system.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {therapyTypes.map((therapy) => (
              <div key={therapy.name} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow">
                {/* --- CHANGE 3: Added icon and updated layout --- */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <therapy.icon className="h-6 w-6 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{therapy.name}</h3>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <div className="text-sm font-medium text-emerald-600">{therapy.dosha}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{therapy.element}</div>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{therapy.description}</p>
                <ul className="space-y-3">
                  {therapy.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                      <CheckIcon className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
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
      {/* --- CHANGE 4: Reduced padding --- */}
      <div className="bg-emerald-600">
        <div className="px-6 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to transform your practice?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-emerald-100">
              Join thousands of practitioners who trust AyurSutra to manage their Panchakarma therapy programs with precision and care.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                to={ROUTES.REGISTER}
                className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-emerald-600 shadow-lg hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
              >
                Get started today
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="text-base font-semibold leading-6 text-white hover:text-emerald-100 transition-colors"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="mx-auto max-w-7xl px-6 py-16 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-sm leading-5 text-slate-500 dark:text-slate-400">
              &copy; 2024 AyurSutra. All rights reserved. | Traditional Ayurvedic wisdom meets modern healthcare technology.
            </p>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">AyurSutra</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;