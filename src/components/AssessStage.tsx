import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Users, MessageCircle, FileText } from 'lucide-react';
import { Job } from '../types/Job';
import CopyableOutput from './CopyableOutput';

interface AssessStageProps {
  job: Job;
  onComplete: (inputs: any, outputs: any) => void;
}

const operatingPrinciples = [
  'Customer Obsession',
  'Ownership',
  'Invent and Simplify',
  'Are Right, A Lot',
  'Learn and Be Curious',
  'Hire and Develop the Best',
  'Insist on the Highest Standards',
  'Think Big',
  'Bias for Action',
  'Frugality',
  'Earn Trust',
  'Dive Deep',
  'Have Backbone; Disagree and Commit',
  'Deliver Results'
];

const AssessStage: React.FC<AssessStageProps> = ({ job, onComplete }) => {
  const [inputs, setInputs] = useState(job.inputs?.assess || {
    interviewStages: [
      {
        id: '1',
        stageName: '',
        panelMember: '',
        assessmentCriteria: '',
        operatingPrinciple: ''
      }
    ]
  });
  
  const [outputs, setOutputs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing outputs if available
  React.useEffect(() => {
    if (job.outputs?.assess) {
      setOutputs(job.outputs.assess);
    }
  }, [job.outputs?.assess]);

  // Update inputs when job changes
  React.useEffect(() => {
    if (job.inputs?.assess) {
      setInputs(job.inputs.assess);
    }
  }, [job.inputs?.assess]);

  const addInterviewStage = () => {
    const newStage = {
      id: Date.now().toString(),
      stageName: '',
      panelMember: '',
      assessmentCriteria: '',
      operatingPrinciple: ''
    };
    
    setInputs(prev => ({
      ...prev,
      interviewStages: [...(prev.interviewStages || []), newStage]
    }));
  };

  const removeInterviewStage = (stageId: string) => {
    setInputs(prev => ({
      ...prev,
      interviewStages: (prev.interviewStages || []).filter(stage => stage.id !== stageId)
    }));
  };

  const updateInterviewStage = (stageId: string, field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      interviewStages: (prev.interviewStages || []).map(stage =>
        stage.id === stageId ? { ...stage, [field]: value } : stage
      )
    }));
    
    if (error) setError(null);
  };

  const validateInputs = () => {
    const stages = inputs.interviewStages || [];
    
    if (stages.length === 0) {
      setError('Please add at least one interview stage');
      return false;
    }

    const incompleteStages = stages.filter(stage => 
      !stage.stageName?.trim() || 
      !stage.panelMember?.trim() || 
      !stage.assessmentCriteria?.trim() || 
      !stage.operatingPrinciple?.trim()
    );

    if (incompleteStages.length > 0) {
      setError('Please complete all fields for each interview stage');
      return false;
    }
    
    return true;
  };

  const generateOutputs = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await assessAPI.generateInterviewProcess(inputs);
      const processingPromise = new Promise(resolve => setTimeout(resolve, 2000));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );
      
      await Promise.race([processingPromise, timeoutPromise]);

      const generatedOutputs = await generateAssessOutputs(inputs, job);
      
      if (!generatedOutputs || typeof generatedOutputs !== 'object') {
        throw new Error('Failed to generate valid outputs');
      }
      
      setOutputs(generatedOutputs);
      
      if (typeof onComplete === 'function') {
        try {
          onComplete(inputs, generatedOutputs);
        } catch (callbackError) {
          console.error('Error in onComplete callback:', callbackError);
          setError('Generated assets successfully, but failed to save progress. Please try again.');
        }
      }
      
    } catch (err) {
      console.error('Error generating outputs:', err);
      
      if (err instanceof Error) {
        if (err.message === 'Request timeout') {
          setError('Request timed out. Please check your connection and try again.');
        } else {
          setError(`Failed to generate outputs: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAssessOutputs = async (inputs: any, job: Job) => {
    // TODO: Replace with actual AI API call
    const stages = inputs.interviewStages || [];
    
    return {
      fullInterviewProcess: `**INTERVIEW PROCESS FOR ${job.title?.toUpperCase() || 'POSITION'}**

**Overview:**
This interview process consists of ${stages.length} structured stages, each designed to assess specific competencies and operating principles.

${stages.map((stage, index) => `
**Stage ${index + 1}: ${stage.stageName}**
• **Panel Member:** ${stage.panelMember}
• **Assessment Focus:** ${stage.assessmentCriteria}
• **Operating Principle:** ${stage.operatingPrinciple}
• **Duration:** 45-60 minutes
`).join('\n')}

**Process Flow:**
1. Pre-interview preparation and candidate briefing
2. Sequential interview stages with designated panel members
3. Individual scoring and feedback collection
4. Panel debrief and consensus building
5. Final recommendation and next steps`,

      interviewQuestions: `**INTERVIEW QUESTIONS FOR ${job.title?.toUpperCase() || 'POSITION'}**

${stages.map((stage, index) => `
**STAGE ${index + 1}: ${stage.stageName.toUpperCase()}**
**Panel Member:** ${stage.panelMember}
**Operating Principle:** ${stage.operatingPrinciple}

**Assessment Questions:**
• Tell me about your experience with ${stage.assessmentCriteria.toLowerCase()}
• Describe a situation where ${stage.operatingPrinciple.toLowerCase()} was important
• How do you approach ${stage.assessmentCriteria.toLowerCase()} challenges?

**Follow-up Questions:**
• What was the specific outcome?
• What would you do differently next time?
• How did you measure success?
`).join('\n')}`,

      scorecardTemplate: `**INTERVIEW SCORECARD**

**Candidate Information:**
Name: ________________________
Position: ${job.title || 'TBD'}
Date: ________________________

${stages.map((stage, index) => `
**STAGE ${index + 1}: ${stage.stageName.toUpperCase()}**
**Panel Member:** ${stage.panelMember}

**${stage.operatingPrinciple} Assessment** (1-5 scale)
Score: ___
Evidence/Examples:
_________________________________________________

**${stage.assessmentCriteria} Competency** (1-5 scale)
Score: ___
Evidence/Examples:
_________________________________________________

**Overall Assessment:**
☐ Strong Yes ☐ Yes ☐ Maybe ☐ No
`).join('\n')}

**FINAL RECOMMENDATION:**
☐ Proceed with offer
☐ Request additional assessment
☐ Decline with feedback

**Notes:**
_________________________________________________`
    };
  };

  const isFormValid = inputs.interviewStages && 
                     inputs.interviewStages.length > 0 && 
                     inputs.interviewStages.every(stage => 
                       stage.stageName?.trim() && 
                       stage.panelMember?.trim() && 
                       stage.assessmentCriteria?.trim() && 
                       stage.operatingPrinciple?.trim()
                     );

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <UserCheck className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Assess Stage</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Plan your complete interview process by defining each stage, panel members, assessment criteria, and operating principles. I'll generate a comprehensive interview process, questions, and scorecards.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Interview Stages</h3>
            <button
              onClick={addInterviewStage}
              disabled={isGenerating}
              className="flex items-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </button>
          </div>

          {(inputs.interviewStages || []).map((stage, index) => (
            <div key={stage.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Stage {index + 1}</h4>
                {inputs.interviewStages && inputs.interviewStages.length > 1 && (
                  <button
                    onClick={() => removeInterviewStage(stage.id)}
                    disabled={isGenerating}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Stage Name *
                  </label>
                  <input
                    type="text"
                    value={stage.stageName || ''}
                    onChange={(e) => updateInterviewStage(stage.id, 'stageName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Technical Screen, Panel Interview"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Panel Member *
                  </label>
                  <input
                    type="text"
                    value={stage.panelMember || ''}
                    onChange={(e) => updateInterviewStage(stage.id, 'panelMember', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Sarah Johnson, Tech Lead"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Criteria *
                  </label>
                  <input
                    type="text"
                    value={stage.assessmentCriteria || ''}
                    onChange={(e) => updateInterviewStage(stage.id, 'assessmentCriteria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Technical skills, Leadership potential"
                    disabled={isGenerating}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operating Principle *
                  </label>
                  <select
                    value={stage.operatingPrinciple || ''}
                    onChange={(e) => updateInterviewStage(stage.id, 'operatingPrinciple', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isGenerating}
                  >
                    <option value="">Select operating principle</option>
                    {operatingPrinciples.map((principle) => (
                      <option key={principle} value={principle}>
                        {principle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={generateOutputs}
            disabled={!isFormValid || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating Interview Process...' : 'Generate Interview Process'}
          </button>
        </div>
      </div>

      {outputs && (
        <div className="space-y-6">
          <CopyableOutput
            title="Full Interview Process"
            icon={Users}
            content={<div className="whitespace-pre-line">{outputs.fullInterviewProcess}</div>}
            rawContent={outputs.fullInterviewProcess}
          />

          <CopyableOutput
            title="Interview Questions & Guide"
            icon={MessageCircle}
            content={<div className="whitespace-pre-line">{outputs.interviewQuestions}</div>}
            rawContent={outputs.interviewQuestions}
          />

          <CopyableOutput
            title="Comprehensive Scorecard"
            icon={FileText}
            content={<div className="whitespace-pre-line font-mono text-sm">{outputs.scorecardTemplate}</div>}
            rawContent={outputs.scorecardTemplate}
          />

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Interview Process Complete</h3>
            <p className="text-blue-800">
              Your comprehensive interview process is ready with {inputs.interviewStages?.length || 0} stages, 
              structured questions for each operating principle, and detailed scorecards for consistent evaluation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessStage;