import React, { useState } from 'react';
import { Plus, Search, Calendar, Users, CheckCircle, Briefcase, Clock, ArrowRight, FileText } from 'lucide-react';
import { Job } from '../types/Job';

interface JobDashboardProps {
  jobs: Job[];
  onCreateJob: () => void;
  onSelectJob: (job: Job) => void;
  onDeleteJob: (jobId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'plan':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'attract':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'assess':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hire':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'complete':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:
      return 'bg-red-100 text-red-800 border-red-200'; // Highlight unknown status
  }
};

const getStatusLabel = (status: string) => {
  const statusLabels = {
    'draft': 'Draft',
    'plan': 'Plan',
    'attract': 'Attract', 
    'assess': 'Assess',
    'hire': 'Hire',
    'complete': 'Complete'
  };
  return statusLabels[status] || 'Unknown';
};

const getStageIcon = (stage: string) => {
  switch (stage) {
    case 'plan':
      return <Calendar className="h-4 w-4" />;
    case 'attract':
      return <Users className="h-4 w-4" />;
    case 'assess':
      return <CheckCircle className="h-4 w-4" />;
    case 'hire':
      return <Briefcase className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getStageProgress = (job: Job) => {
  const stages = ['plan', 'attract', 'assess', 'hire'];
  
  // Ensure completedStages is an array
  if (!Array.isArray(job.completedStages)) {
    return { current: 0, total: stages.length, percentage: 0 };
  }
  
  const completedCount = job.completedStages.length;
  return {
    current: completedCount,
    total: stages.length,
    percentage: (completedCount / stages.length) * 100
  };
};

const JobDashboard: React.FC<JobDashboardProps> = ({ jobs, onCreateJob, onSelectJob, onDeleteJob }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Ensure jobs is always an array
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  
  // Filter out jobs with invalid data
  const validJobs = safeJobs.filter(job => 
    job && typeof job === 'object' && job.id && job.title && job.department
  );

  const filteredJobs = validJobs.filter(job => {
    const title = job.title || '';
    const department = job.department || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const activeJobs = validJobs.filter(job => ['plan', 'attract', 'assess', 'hire'].includes(job.status || ''));
  const completeJobs = validJobs.filter(job => job.status === 'complete');

  const stages = [
    { name: 'plan' },
    { name: 'attract' },
    { name: 'assess' },
    { name: 'hire' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your active hiring roles and track progress</p>
          </div>
          <button
            onClick={onCreateJob}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Job
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Complete Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{completeJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="plan">Plan</option>
            <option value="attract">Attract</option>
            <option value="assess">Assess</option>
            <option value="hire">Hire</option>
            <option value="complete">Complete</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {validJobs.length === 0 ? 'No jobs yet' : 'No jobs match your search'}
          </h3>
          <p className="text-gray-500 mb-6">
            {validJobs.length === 0 
              ? 'Create your first job to start developing hiring assets'
              : 'Try adjusting your search terms or filters'
            }
          </p>
          {validJobs.length === 0 && (
            <button
              onClick={onCreateJob}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Create Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const progress = getStageProgress(job);
            return (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => onSelectJob(job)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                        {job.title || 'Untitled Job'}
                      </h3>
                      <p className="text-sm text-gray-500">{job.department || 'No Department'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status || 'draft')}`}>
                        {getStatusLabel(job.status || 'draft')}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{progress.current}/{progress.total} stages</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress.current} of ${progress.total} stages completed`}
                      ></div>
                    </div>
                  </div>

                  {/* Current Stage */}
                  <div className="text-xs text-gray-400 capitalize">
                    <div className="text-xs text-gray-400">
                      <div className="mb-1">
                        {progress.current === 4 ? 'Complete' : `Continue with ${stages[progress.current]?.name || 'next stage'}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobDashboard;