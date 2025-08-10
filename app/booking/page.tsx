'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface Article {
  id: string;
  title: string;
  kol_name: string;
  kol_credentials: string;
}

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const interviewTypes = [
  {
    id: '15min',
    name: '15-Minute Highlight Interview',
    description: 'Quick overview and key insights',
    price: 150,
    duration: 15
  },
  {
    id: '30min',
    name: '30-Minute Deep Dive Interview',
    description: 'Comprehensive discussion and detailed insights',
    price: 250,
    duration: 30
  }
];

function BookingContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  
  const [article, setArticle] = useState<Article | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      alert('Please select all required fields');
      return;
    }

    setIsProcessing(true);
    try {
      // Create interview booking
      const interviewResponse = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          kolId: article?.kol_name, // Using kol_name as kolId for simplicity
          scheduledTime: `${selectedDate}T${selectedTime}`,
          duration: interviewTypes.find(t => t.id === selectedType)?.duration
        }),
      });

      if (!interviewResponse.ok) {
        throw new Error('Failed to create interview booking');
      }

      const interviewData = await interviewResponse.json();

      // Create payment session
      const paymentResponse = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewType: selectedType,
          interviewId: interviewData.id
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment session');
      }

      const paymentData = await paymentResponse.json();
      
      // Redirect to Stripe checkout
      window.location.href = paymentData.url;
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('An error occurred while processing your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const selectedInterviewType = interviewTypes.find(t => t.id === selectedType);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book KoL Interview</h1>
        <p className="text-lg text-gray-600">
          Schedule an interview with a Key Opinion Leader for your article
        </p>
      </div>

      {article && (
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="card-title">Article Details</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="form-label">Article Title</label>
              <p className="text-gray-900 font-medium">{article.title}</p>
            </div>
            <div>
              <label className="form-label">KoL Name</label>
              <p className="text-gray-900 font-medium">{article.kol_name}</p>
            </div>
            <div>
              <label className="form-label">KoL Credentials</label>
              <p className="text-gray-600">{article.kol_credentials}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Type Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Interview Type</h2>
          </div>
          <div className="space-y-4">
            {interviewTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{type.name}</h3>
                  <span className="text-lg font-bold text-primary-600">${type.price}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{type.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {type.duration} minutes
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Date & Time</h2>
          </div>
          <div className="space-y-6">
            <div>
              <label className="form-label">Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-select"
              >
                <option value="">Select a date</option>
                {getAvailableDates().map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Time</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`p-3 text-sm border rounded-lg transition-all duration-200 ${
                      selectedTime === time
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Booking */}
      {selectedType && selectedDate && selectedTime && (
        <div className="card mt-8">
          <div className="card-header">
            <h2 className="card-title">Booking Summary</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Interview Type:</span>
              <span className="font-medium">{selectedInterviewType?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-primary-600">
              <span>Total:</span>
              <span>${selectedInterviewType?.price}</span>
            </div>
          </div>
          
          <button
            onClick={handleBooking}
            disabled={isProcessing}
            className="btn-primary w-full mt-6"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Processing...
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking form...</p>
          </div>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </MainLayout>
  );
}
