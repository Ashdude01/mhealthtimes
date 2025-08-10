'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import { CheckCircleIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  const sessionId = searchParams.get('session_id');
  
  const [submissionType, setSubmissionType] = useState<'article' | 'payment' | null>(null);

  useEffect(() => {
    if (sessionId) {
      setSubmissionType('payment');
    } else if (articleId) {
      setSubmissionType('article');
    }
  }, [articleId, sessionId]);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircleIcon className="mx-auto h-16 w-16 text-success-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Thank You!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {submissionType === 'article' 
            ? 'Your article has been submitted successfully.'
            : 'Your payment has been processed successfully.'
          }
        </p>
      </div>

      {submissionType === 'article' && (
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Article Submission Confirmed
          </h2>
          <p className="text-gray-600 mb-6">
            Your article has been received and is currently under review. 
            We will notify you via email once the review process is complete.
          </p>
          
          <div className="bg-primary-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-primary-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Our editorial team will review your article</li>
              <li>• You'll receive feedback within 3-5 business days</li>
              <li>• If approved, your article will be published</li>
              <li>• You can track the status in your dashboard</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/booking"
              className="btn-primary w-full"
            >
              Book a KoL Interview
            </Link>
            <Link
              href="/submit-article"
              className="btn-secondary w-full"
            >
              Submit Another Article
            </Link>
          </div>
        </div>
      )}

      {submissionType === 'payment' && (
        <div className="card">
          <div className="flex items-center justify-center mb-4">
            <UserGroupIcon className="h-8 w-8 text-success-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully and your article submission is complete. 
            You will receive a confirmation email with next steps shortly.
          </p>
          
          <div className="bg-success-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-success-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-success-800 space-y-1">
              <li>• You'll receive a confirmation email</li>
              <li>• Our editorial team will review your article</li>
              <li>• If you selected an interview package, we'll contact you to schedule</li>
              <li>• Your article will be published upon approval</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="btn-primary w-full"
            >
              Return to Home
            </Link>
            <Link
              href="/submit-article"
              className="btn-secondary w-full"
            >
              Submit Another Article
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <MainLayout>
      <Suspense fallback={
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </MainLayout>
  );
}
