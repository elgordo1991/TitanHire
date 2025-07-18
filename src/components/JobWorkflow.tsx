import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Users, UserCheck, Briefcase, Check } from 'lucide-react';
import { Job, Stage } from '../types/Job';
import PlanStage from './PlanStage';
import AttractStage from './AttractStage';
import AssessStage from './AssessStage';
import HireStage from './HireStage';

interface JobWorkflowProps {
  job: Job;
  onUpdateJob: (job: Job) => void;
  onBackToDashboard: () => void;
}

const stages = [
  { id: 'plan', name: 'Plan', icon: Target, description: 'Prepare for intake call' },
  { id: 'attract', name: 'Attract', icon: Users, description: 'Generate hiring assets' },
  { id: 'assess', name: 'Assess', icon: UserCheck, description: 'Create interview assets' },
  { id: 'hire', name: 'Hire', icon: Briefcase, description: 'Prepare offer & onboarding' }
];

const JobWorkflow: React.FC<JobWorkflowProps> = ({ job, onUpdateJob, onBackToDashboard }) => {
  const [activeStage, setActiveStage] = useState<Stage>('plan');
  const [localJob, setLocalJob] = useState<Job>(job);

  useEffect(() => {
    setLocalJob(job);
    // Default to plan stage, but user can navigate to any stage
  }, [job]);

  const handleStageComplete = (stage: Stage, inputs: any, outputs: any) => {
    if (!stage || !inputs || !outputs) {
      console.error('Invalid stage completion data:', { stage, inputs, outputs });
      return;
    }

    const updatedJob = {
      ...localJob,
      inputs: {
        ...localJob.inputs,
        [stage]: inputs
      },
      outputs: {
        ...localJob.outputs,
        [stage]: outputs
      },
      completedStages: Array.isArray(localJob.completedStages) 
        ? (localJob.completedStages.includes(stage) 
            ? localJob.completedStages 
            : [...localJob.completedStages, stage])
        : [stage],
      lastUpdated: new Date().toLocaleDateString()
    };

    const completedCount = Array.isArray(updatedJob.completedStages) ? updatedJob.completedStages.length : 0;
    if (completedCount === 4) {
      updatedJob.status = 'complete';
    } else if (completedCount === 3) {
      updatedJob.status = 'hire';
    } else if (completedCount === 2) {
      updatedJob.status = 'assess';
    } else if (completedCount === 1) {
      updatedJob.status = 'attract';
    } else {
      updatedJob.status = 'plan';
    }

    setLocalJob(updatedJob);
    
    try {
      onUpdateJob(updatedJob);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const renderStageContent = () => {
    const commonProps = {
      job: localJob,
      onComplete: (inputs: any, outputs: any) => handleStageComplete(activeStage, inputs, outputs)
    };

    switch (activeStage) {
      case 'plan':
        return <PlanStage {...commonProps} />;
      case 'attract':
        return <AttractStage {...commonProps} />;
      case 'assess':
        return <AssessStage {...commonProps} />;
      case 'hire':
        return <HireStage {...commonProps} />;
      default:
        return <PlanStage {...commonProps} />;
    }
  };

  const isStageCompleted = (stageId: string) => {
    return Array.isArray(localJob.completedStages) 
      ? localJob.completedStages.includes(stageId)
      : false;
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBackToDashboard}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{localJob.title || 'Untitled Job'}</h1>
                <p className="text-sm text-gray-500">{localJob.department || 'No Department'} • {localJob.status || 'draft'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {Array.isArray(localJob.completedStages) ? localJob.completedStages.length : 0}/4 stages completed
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((Array.isArray(localJob.completedStages) ? localJob.completedStages.length : 0) / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {stages.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              const isCompleted = isStageCompleted(stage.id);
              
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id as Stage)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'border-purple-500 text-purple-600'
                      : isCompleted
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5 mr-2" />
                    {isCompleted && (
                      <Check 
                        className="h-3 w-3 absolute -top-1 -right-1 text-green-600 bg-white rounded-full" 
                        aria-label="Completed"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{stage.name}</div>
                    <div className="text-xs text-gray-400">{stage.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {renderStageContent()}
      </main>
    </div>
  );
};

export default JobWorkflow;