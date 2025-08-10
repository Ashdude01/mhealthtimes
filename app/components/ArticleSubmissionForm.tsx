'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FormData {
  title: string;
  author_name: string;
  agency_contact: string;
  kol_name: string;
  kol_credentials: string;
  therapeutic_area: string;
  target_audience: string;
  article_type: string;
  body: string;
  image_url?: string;
  interview_package?: string;
}

const therapeuticAreas = [
  'Cardiology',
  'Oncology',
  'Neurology',
  'Endocrinology',
  'Gastroenterology',
  'Rheumatology',
  'Dermatology',
  'Psychiatry',
  'Pediatrics',
  'Geriatrics',
  'Other'
];

const targetAudiences = [
  'Healthcare Professionals',
  'Researchers',
  'Patients',
  'Policy Makers',
  'Industry Leaders',
  'General Public'
];

const articleTypes = [
  'Research Article',
  'Review Article',
  'Case Study',
  'Opinion Piece',
  'Clinical Trial Report',
  'Meta-analysis',
  'Editorial',
  'Letter to Editor'
];

const interviewPackages = [
  {
    id: 'basic',
    name: 'Basic Package',
    description: 'Article submission with standard review',
    price: 99,
    features: [
      'Article submission and review',
      'Basic editorial feedback',
      'Publication within 2 weeks',
      'Standard formatting'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Package',
    description: 'Article submission + 15-minute KoL interview',
    price: 249,
    features: [
      'Article submission and review',
      '15-minute KoL interview',
      'Priority publication within 1 week',
      'Enhanced formatting and graphics',
      'Interview recording and transcript'
    ]
  },
  {
    id: 'premium_plus',
    name: 'Premium Plus Package',
    description: 'Article submission + 30-minute KoL interview',
    price: 399,
    features: [
      'Article submission and review',
      '30-minute KoL interview',
      'Priority publication within 1 week',
      'Enhanced formatting and graphics',
      'Interview recording and transcript',
      'Social media promotion',
      'Analytics report'
    ]
  }
];

export default function ArticleSubmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue
  } = useForm<FormData>({
    mode: 'onChange'
  });

  const watchedValues = watch();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImage(data.imageUrl);
        setValue('image_url', data.imageUrl);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    }
  };

  const handlePayment = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // First, submit the article
      const articleResponse = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          interview_package: selectedPackage,
          payment_status: 'pending'
        }),
      });

      if (!articleResponse.ok) {
        throw new Error('Failed to submit article');
      }

      const articleData = await articleResponse.json();

      // If a package is selected, create payment session
      if (selectedPackage && selectedPackage !== 'basic') {
        const packageData = interviewPackages.find(p => p.id === selectedPackage);
        
        const paymentResponse = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            interviewType: selectedPackage,
            articleId: articleData.id,
            packageName: packageData?.name,
            amount: packageData?.price
          }),
        });

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          window.location.href = paymentData.url;
        } else {
          throw new Error('Failed to create payment session');
        }
      } else {
        // For basic package, redirect to thank you page
        router.push(`/thank-you?articleId=${articleData.id}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Article & KoL Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Article Title *</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="form-input"
            placeholder="Enter article title"
          />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div>
          <label className="form-label">Author Name *</label>
          <input
            type="text"
            {...register('author_name', { required: 'Author name is required' })}
            className="form-input"
            placeholder="Enter author name"
          />
          {errors.author_name && <p className="form-error">{errors.author_name.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Agency Contact *</label>
        <input
          type="email"
          {...register('agency_contact', { 
            required: 'Agency contact is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="form-input"
          placeholder="Enter agency contact email"
        />
        {errors.agency_contact && <p className="form-error">{errors.agency_contact.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">KoL Name *</label>
          <input
            type="text"
            {...register('kol_name', { required: 'KoL name is required' })}
            className="form-input"
            placeholder="Enter Key Opinion Leader name"
          />
          {errors.kol_name && <p className="form-error">{errors.kol_name.message}</p>}
        </div>

        <div>
          <label className="form-label">Therapeutic Area *</label>
          <select
            {...register('therapeutic_area', { required: 'Therapeutic area is required' })}
            className="form-select"
          >
            <option value="">Select therapeutic area</option>
            {therapeuticAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          {errors.therapeutic_area && <p className="form-error">{errors.therapeutic_area.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">KoL Credentials *</label>
        <textarea
          {...register('kol_credentials', { required: 'KoL credentials are required' })}
          className="form-textarea"
          rows={3}
          placeholder="Enter KoL credentials and affiliations"
        />
        {errors.kol_credentials && <p className="form-error">{errors.kol_credentials.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Target Audience *</label>
          <select
            {...register('target_audience', { required: 'Target audience is required' })}
            className="form-select"
          >
            <option value="">Select target audience</option>
            {targetAudiences.map((audience) => (
              <option key={audience} value={audience}>{audience}</option>
            ))}
          </select>
          {errors.target_audience && <p className="form-error">{errors.target_audience.message}</p>}
        </div>

        <div>
          <label className="form-label">Article Type *</label>
          <select
            {...register('article_type', { required: 'Article type is required' })}
            className="form-select"
          >
            <option value="">Select article type</option>
            {articleTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.article_type && <p className="form-error">{errors.article_type.message}</p>}
        </div>
      </div>

      <div>
        <label className="form-label">Article Body *</label>
        <textarea
          {...register('body', { 
            required: 'Article body is required',
            minLength: {
              value: 100,
              message: 'Article must be at least 100 characters long'
            }
          })}
          className="form-textarea"
          rows={12}
          placeholder="Write your article content here..."
        />
        {errors.body && <p className="form-error">{errors.body.message}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Upload Article Image</h3>
      
      <div className="text-center">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">Upload Image</p>
                <p className="text-gray-500">Click to select or drag and drop</p>
                <p className="text-sm text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </label>
        </div>
        
        {uploadedImage && (
          <div className="mt-6">
            <div className="relative inline-block">
              <img src={uploadedImage} alt="Uploaded" className="w-48 h-32 object-cover rounded-lg shadow-md" />
              <div className="absolute top-2 right-2 bg-success-500 text-white rounded-full p-1">
                <CheckIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-2 text-sm text-success-600">Image uploaded successfully!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Choose Interview Package</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interviewPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`card cursor-pointer transition-all duration-200 ${
              selectedPackage === pkg.id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-medium'
            }`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-primary-600 mb-2">${pkg.price}</div>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
            </div>
            
            <ul className="space-y-2">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckIcon className="w-4 h-4 text-success-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            {selectedPackage === pkg.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center text-success-600 font-medium">
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => {
    const selectedPackageData = interviewPackages.find(p => p.id === selectedPackage);
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Review & Proceed to Payment</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Details */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Article Details</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{watchedValues.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Author</label>
                <p className="text-gray-900">{watchedValues.author_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">KoL</label>
                <p className="text-gray-900">{watchedValues.kol_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Therapeutic Area</label>
                <p className="text-gray-900">{watchedValues.therapeutic_area}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target Audience</label>
                <p className="text-gray-900">{watchedValues.target_audience}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Article Type</label>
                <p className="text-gray-900">{watchedValues.article_type}</p>
              </div>
              {uploadedImage && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Image</label>
                  <img src={uploadedImage} alt="Article" className="w-24 h-16 object-cover rounded mt-1" />
                </div>
              )}
            </div>
          </div>

          {/* Package & Payment */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Selected Package</h4>
            </div>
            <div className="space-y-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <h5 className="font-semibold text-primary-900">{selectedPackageData?.name}</h5>
                <p className="text-primary-700 text-sm">{selectedPackageData?.description}</p>
                <div className="text-2xl font-bold text-primary-600 mt-2">${selectedPackageData?.price}</div>
              </div>
              
              <div className="space-y-2">
                <h5 className="font-medium text-gray-900">Package Includes:</h5>
                <ul className="space-y-1">
                  {selectedPackageData?.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <CheckIcon className="w-4 h-4 text-success-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const steps = [
    { name: 'Article & KoL Info', component: renderStep1 },
    { name: 'Upload Image', component: renderStep2 },
    { name: 'Choose Package', component: renderStep3 },
    { name: 'Review & Pay', component: renderStep4 },
  ];

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.title && watchedValues.author_name && watchedValues.agency_contact && 
               watchedValues.kol_name && watchedValues.kol_credentials && watchedValues.therapeutic_area && 
               watchedValues.target_audience && watchedValues.article_type && watchedValues.body;
      case 2:
        return true; // Image upload is optional
      case 3:
        return selectedPackage;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Submit Article</h1>
        
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                index + 1 <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-3 text-sm font-medium ${
                index + 1 <= currentStep ? 'text-primary-600' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${
                  index + 1 < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handlePayment)} className="card">
        {steps[currentStep - 1].component()}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceedToNext()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !canProceedToNext()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="spinner mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Proceed to Payment - $${selectedPackage ? interviewPackages.find(p => p.id === selectedPackage)?.price : 0}`
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
