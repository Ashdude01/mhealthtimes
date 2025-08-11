'use client';

import { useState, useEffect } from 'react';
import ProtectedAdmin from '../components/ProtectedAdmin';
import { 
  EyeIcon, 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface Article {
  id: string;
  title: string;
  author_name: string;
  kol_name: string;
  therapeutic_area: string;
  status: 'pending_review' | 'approved' | 'rejected';
  payment_status: 'pending' | 'paid' | 'failed';
  interview_package: string;
  created_at: string;
}

interface Interview {
  id: string
  article_id: string
  scheduled_time: string
  duration: number
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
}

interface ArticleDetails {
  id: string;
  title: string;
  author_name: string;
  agency_contact: string;
  kol_name: string;
  kol_credentials: string;
  body: string;
  therapeutic_area: string;
  target_audience: string;
  article_type: string;
  image_url?: string;
  interview_package: string;
  payment_status: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedTab, setSelectedTab] = useState<'articles' | 'interviews'>('articles')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetails | null>(null)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject';
    articleId: string;
    articleTitle: string;
  } | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [articlesResponse, interviewsResponse] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/interviews')
      ])

      if (articlesResponse.ok) {
        const articlesData = await articlesResponse.json()
        setArticles(articlesData)
      }

      if (interviewsResponse.ok) {
        const interviewsData = await interviewsResponse.json()
        setInterviews(interviewsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateArticleStatus = async (articleId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Update local state
        setArticles(articles.map(article => 
          article.id === articleId ? { ...article, status } : article
        ))
        setShowConfirmDialog(false)
        setConfirmAction(null)
      }
    } catch (error) {
      console.error('Error updating article status:', error)
      alert('Failed to update article status')
    }
  }

  const handleStatusUpdate = (type: 'approve' | 'reject', articleId: string, articleTitle: string) => {
    setConfirmAction({ type, articleId, articleTitle })
    setShowConfirmDialog(true)
  }

  const confirmStatusUpdate = () => {
    if (confirmAction) {
      updateArticleStatus(confirmAction.articleId, confirmAction.type === 'approve' ? 'approved' : 'rejected')
    }
  }

  const viewArticleDetails = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`)
      if (response.ok) {
        const articleData = await response.json()
        setSelectedArticle(articleData)
        setShowArticleModal(true)
      }
    } catch (error) {
      console.error('Error fetching article details:', error)
      alert('Failed to fetch article details')
    }
  }

  const viewInterviewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
    setShowInterviewModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredArticles = selectedStatus === 'all' 
    ? articles 
    : articles.filter(article => article.status === selectedStatus)

  const getStats = () => {
    const totalArticles = articles.length
    const pendingArticles = articles.filter(a => a.status === 'pending_review').length
    const approvedArticles = articles.filter(a => a.status === 'approved').length
    const totalInterviews = interviews.length
    const paidInterviews = interviews.filter(i => i.payment_status === 'paid').length

    return {
      totalArticles,
      pendingArticles,
      approvedArticles,
      totalInterviews,
      paidInterviews
    }
  }

  const stats = getStats()

  if (isLoading) {
    return (
      <ProtectedAdmin>
        <div className="flex justify-center items-center min-h-64">
          <div className="spinner mx-auto"></div>
        </div>
      </ProtectedAdmin>
    );
  }

  return (
    <ProtectedAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingArticles}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <CheckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedArticles}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInterviews}</p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="flex items-center">
                <CheckIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Paid Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.paidInterviews}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('articles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'articles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Articles ({articles.length})
              </button>
              <button
                onClick={() => setSelectedTab('interviews')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'interviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Interviews ({interviews.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {selectedTab === 'articles' && (
          <div>
            {/* Filter */}
            <div className="mb-6">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-input w-48"
              >
                <option value="all">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Articles Table */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KoL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredArticles.map((article) => (
                      <tr key={article.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{article.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{article.author_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{article.kol_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{article.therapeutic_area}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.status)}`}>
                            {article.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(article.payment_status)}`}>
                            {article.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {article.interview_package?.replace('_', ' ') || 'Basic'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(article.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate('approve', article.id, article.title)}
                              disabled={article.status === 'approved'}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              title="Approve Article"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate('reject', article.id, article.title)}
                              disabled={article.status === 'rejected'}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="Reject Article"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => viewArticleDetails(article.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Article Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'interviews' && (
          <div>
            {/* Interviews Table */}
            <div className="card">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Article ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{interview.article_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(interview.scheduled_time).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{interview.duration} min</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(interview.payment_status)}`}>
                            {interview.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(interview.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => viewInterviewDetails(interview)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Interview Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && confirmAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Confirm Action
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to {confirmAction.type} the article "{confirmAction.articleTitle}"?
                  </p>
                </div>
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => {
                      setShowConfirmDialog(false)
                      setConfirmAction(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmStatusUpdate}
                    className={`btn-primary ${
                      confirmAction.type === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {confirmAction.type === 'approve' ? 'Approve' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article Details Modal */}
        {showArticleModal && selectedArticle && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Article Details</h3>
                <button
                  onClick={() => setShowArticleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Title:</span>
                        <p className="text-gray-700">{selectedArticle.title}</p>
                      </div>
                      <div>
                        <span className="font-medium">Author:</span>
                        <p className="text-gray-700">{selectedArticle.author_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">Agency Contact:</span>
                        <p className="text-gray-700">{selectedArticle.agency_contact}</p>
                      </div>
                      <div>
                        <span className="font-medium">KoL Name:</span>
                        <p className="text-gray-700">{selectedArticle.kol_name}</p>
                      </div>
                      <div>
                        <span className="font-medium">KoL Credentials:</span>
                        <p className="text-gray-700">{selectedArticle.kol_credentials}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Article Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Therapeutic Area:</span>
                        <p className="text-gray-700">{selectedArticle.therapeutic_area}</p>
                      </div>
                      <div>
                        <span className="font-medium">Target Audience:</span>
                        <p className="text-gray-700">{selectedArticle.target_audience}</p>
                      </div>
                      <div>
                        <span className="font-medium">Article Type:</span>
                        <p className="text-gray-700">{selectedArticle.article_type}</p>
                      </div>
                      <div>
                        <span className="font-medium">Package:</span>
                        <p className="text-gray-700 capitalize">{selectedArticle.interview_package?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedArticle.status)}`}>
                          {selectedArticle.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Payment Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedArticle.payment_status)}`}>
                          {selectedArticle.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Article Content</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedArticle.body}</p>
                  </div>
                </div>
                {selectedArticle.image_url && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Article Image</h4>
                    <img 
                      src={selectedArticle.image_url} 
                      alt="Article" 
                      className="w-48 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interview Details Modal */}
        {showInterviewModal && selectedInterview && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Interview Details</h3>
                <button
                  onClick={() => setShowInterviewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-900">Article ID:</span>
                  <p className="text-sm text-gray-700">{selectedInterview.article_id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Scheduled Time:</span>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedInterview.scheduled_time).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Duration:</span>
                  <p className="text-sm text-gray-700">{selectedInterview.duration} minutes</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Payment Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInterview.payment_status)}`}>
                    {selectedInterview.payment_status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Created:</span>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedInterview.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}
