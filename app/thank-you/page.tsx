'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '../components/MainLayout';
import { CheckCircleIcon, DocumentTextIcon, UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');
  const sessionId = searchParams.get('session_id');
  
  const [submissionType, setSubmissionType] = useState<'article' | 'payment' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed' | 'checking'>('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      setSubmissionType('payment');
      // Verify payment status
      verifyPaymentStatus(sessionId);
    } else if (articleId) {
      setSubmissionType('article');
      setLoading(false);
    }
  }, [articleId, sessionId]);

  const verifyPaymentStatus = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payment/verify?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentStatus(data.status);
      } else {
        setPaymentStatus('pending');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('pending');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-600">Verifying payment status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        {paymentStatus === 'failed' ? (
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-error-600" />
        ) : (
          <CheckCircleIcon className="mx-auto h-16 w-16 text-success-600" />
        )}
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {paymentStatus === 'failed' ? 'Payment Failed' : 'Thank You!'}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {paymentStatus === 'failed' 
            ? 'There was an issue processing your payment.'
            : submissionType === 'article' 
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
            {paymentStatus === 'failed' ? 'Payment Failed' : 'Payment Successful!'}
          </h2>
          <p className="text-gray-600 mb-6">
            {paymentStatus === 'failed' 
              ? 'There was an issue processing your payment. Please try again or contact support if the problem persists.'
              : 'Your payment has been processed successfully and your article submission is complete. You will receive a confirmation email with next steps shortly.'
            }
          </p>
          
          {paymentStatus === 'paid' && (
            <div className="bg-success-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-success-900 mb-2">What happens next?</h3>
              <ul className="text-sm text-success-800 space-y-1">
                <li>• You'll receive a confirmation email</li>
                <li>• Our editorial team will review your article</li>
                <li>• If you selected an interview package, we'll contact you to schedule</li>
                <li>• Your article will be published upon approval</li>
              </ul>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-error-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-error-900 mb-2">What you can do:</h3>
              <ul className="text-sm text-error-800 space-y-1">
                <li>• Check your payment method and try again</li>
                <li>• Contact your bank if there are any issues</li>
                <li>• Reach out to our support team for assistance</li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            {paymentStatus === 'failed' ? (
              <>
                <Link
                  href="/submit-article"
                  className="btn-primary w-full"
                >
                  Try Payment Again
                </Link>
                <Link
                  href="/"
                  className="btn-secondary w-full"
                >
                  Return to Home
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
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
