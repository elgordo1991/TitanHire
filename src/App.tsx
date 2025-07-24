import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { Job } from './types/Job';
import { authAPI } from './services/api';
import JobDashboard from './components/JobDashboard';
import JobWorkflow from './components/JobWorkflow';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'workflow'>('dashboard');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  // Load jobs from localStorage on mount
  useEffect(() => {
    if (!isLoggedIn) {
      setJobs([]);
      return;
    }

    const savedJobs = localStorage.getItem('titanhire-jobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        if (Array.isArray(parsedJobs)) {
          const validJobs = parsedJobs.filter(job => 
            job && typeof job === 'object' && job.id && job.title
          );
          setJobs(validJobs);
        }
      } catch (error) {
        console.error('Error parsing jobs from localStorage:', error);
      }
    } else {
      // No saved jobs found, start with empty array
      setJobs([]);
    }
  }, [isLoggedIn]);

  // Save jobs to localStorage whenever jobs change
  useEffect(() => {
    if (jobs.length > 0 && isLoggedIn) {
      try {
        localStorage.setItem('titanhire-jobs', JSON.stringify(jobs));
      } catch (error) {
        console.error('Error saving jobs to localStorage:', error);
      }
    }
  }, [jobs]);

  // Load user data when logged in
  useEffect(() => {
    if (isLoggedIn && !user) {
      loadUserData();
    }
  }, [isLoggedIn, user]);

  const loadUserData = async () => {
    setUserLoading(true);
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        // Handle missing metadata gracefully
        setUser({
          name: response.data.name || response.data.email.split('@')[0] || 'User',
          email: response.data.email,
          role: response.data.role || 'Team Member'
        });
      } else {
        // If we can't get user data, set basic info to prevent loading state
        setUser({
          name: 'User',
          email: 'user@example.com',
          role: 'Team Member'
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set fallback user data to prevent infinite loading
      setUser({
        name: 'User',
        email: 'user@example.com', 
        role: 'Team Member'
      });
    } finally {
      setUserLoading(false);
    }
  };

  const createNewJob = () => {
    const newJob: Job = {
      id: Date.now().toString(),
      title: '',
      department: '',
      status: 'draft',
      created: new Date().toLocaleDateString(),
      lastUpdated: new Date().toLocaleDateString(),
      inputs: {
        plan: { jobTitle: '', department: '', location: '', level: '', notes: '' },
        attract: { transcript: '', jobTitle: '', location: '', team: '', managerNotes: '' },
        assess: { interviewStages: [{ id: '1', stageName: '', panelMember: '', assessmentCriteria: '', operatingPrinciple: '' }] },
        hire: { offerDetails: '', interviewTranscripts: '', candidateExpectations: '', additionalNotes: '' }
      },
      outputs: {},
      completedStages: []
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob);
    setCurrentView('workflow');
  };

  const selectJob = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('workflow');
  };

  const updateJob = (updatedJob: Job) => {
    if (!updatedJob || !updatedJob.id) {
      console.error('Invalid job update:', updatedJob);
      return;
    }
    
    setJobs(prev => prev.map(job => job.id === updatedJob.id ? updatedJob : job));
    setSelectedJob(updatedJob);
  };

  const deleteJob = (jobId: string) => {
    if (!jobId) {
      console.error('Invalid job ID for deletion');
      return;
    }
    
    setJobs(prev => prev.filter(job => job.id !== jobId));
    
    // Clear selected job if it was deleted
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(null);
      setCurrentView('dashboard');
    }
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedJob(null);
  };

  const handleLogin = (email: string, password: string) => {
    setIsLoggedIn(true);
    setLoginModalOpen(false);
    // Set basic user info immediately to prevent loading issues
    setUser({
      name: email.split('@')[0],
      email: email,
      role: 'Team Member'
    });
    // Load full user data in background
    loadUserData();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserLoading(false);
    setProfileModalOpen(false);
    setJobs([]);
    setSelectedJob(null);
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show on dashboard */}
      {currentView === 'dashboard' && (
        <header className="bg-white shadow-sm border-b border-gray-200 relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900">TitanHire</h1>
                    <p className="text-sm text-gray-500">AI-powered hiring lifecycle assistant</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        {user?.name ? (
                          <span className="text-white text-sm font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <Users className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {userLoading ? 'Loading...' : (user?.name || 'User')}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      {!isLoggedIn ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to TitanHire
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Your AI-powered hiring lifecycle assistant. Sign in or sign up to get started.
            </p>
            <button
              onClick={() => setLoginModalOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      ) : currentView === 'dashboard' ? (
        <JobDashboard
          jobs={jobs}
          onCreateJob={createNewJob}
          onSelectJob={selectJob}
          onDeleteJob={deleteJob}
        />
      ) : selectedJob ? (
        <JobWorkflow
          job={selectedJob}
          onUpdateJob={updateJob}
          onBackToDashboard={backToDashboard}
        />
      ) : null}

      {/* Modals */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;