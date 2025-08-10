import Link from 'next/link';
import MainLayout from './components/MainLayout';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  const features = [
    {
      icon: DocumentTextIcon,
      title: 'Article Submission',
      description: 'Submit your healthcare articles with our streamlined multi-step form. Get expert review and feedback.',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      icon: UserGroupIcon,
      title: 'KoL Interviews',
      description: 'Book interviews with Key Opinion Leaders in the healthcare industry. Connect with experts.',
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      icon: CalendarIcon,
      title: 'Scheduling System',
      description: 'Easy-to-use scheduling system for managing interviews and appointments efficiently.',
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Track your submissions, interviews, and performance with our comprehensive analytics.',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    }
  ];

  const benefits = [
    'Expert review and feedback on your submissions',
    'Direct access to healthcare industry leaders',
    'Streamlined submission process',
    'Professional scheduling system',
    'Comprehensive analytics and reporting',
    'Secure payment processing'
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                MHealthTimes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto animate-slide-up">
              Your premier platform for healthcare content submission and Key Opinion Leader interviews. 
              Connect with industry experts and share your insights with the healthcare community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Link href="/submit-article" className="flex items-center btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-50">
                Submit Article
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/booking" className="flex items-center btn-secondary text-lg px-8 py-4 border-white text-primary hover:bg-white hover:text-primary-600">
                Book Interview
                <CalendarIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MHealthTimes?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive solutions for healthcare content creators and industry professionals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card group hover:scale-105 transition-transform duration-300">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for Success
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform provides all the tools and resources you need to succeed in the healthcare content space.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-success-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="card p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <StarIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Join Our Community</h3>
                    <p className="text-gray-600">Connect with healthcare professionals</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Become part of our growing community of healthcare content creators and industry experts. 
                  Share your knowledge, connect with peers, and grow your professional network.
                </p>
                <Link href="/submit-article" className="btn-primary w-full justify-center">
                  Get Started Today
                </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-200 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-success-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust MHealthTimes for their content and networking needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/submit-article" className="btn-primary text-lg px-8 py-4 bg-white text-primary-600 hover:bg-gray-50">
              Submit Your First Article
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/booking" className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600">
              Schedule an Interview
              <CalendarIcon className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
