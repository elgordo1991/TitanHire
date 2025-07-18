import React, { useState } from 'react';
import { Users, FileText, MessageSquare, Search, Mail, Star } from 'lucide-react';
import { Job } from '../types/Job';
import CopyableOutput from './CopyableOutput';

interface AttractStageProps {
  job: Job;
  onComplete: (inputs: any, outputs: any) => void;
}

const AttractStage: React.FC<AttractStageProps> = ({ job, onComplete }) => {
  const [inputs, setInputs] = useState(job.inputs.attract);
  
  const [outputs, setOutputs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing outputs if available
  React.useEffect(() => {
    if (job.outputs.attract) {
      setOutputs(job.outputs.attract);
    }
  }, [job.outputs.attract]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const generateOutputs = async () => {
    if (!isFormValid) {
      setError('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await attractAPI.generateAssets(inputs);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedOutputs = await generateAttractOutputs(inputs);
      
      setOutputs(generatedOutputs);
      onComplete(inputs, generatedOutputs);
    } catch (err) {
      setError('Failed to generate outputs. Please try again.');
      console.error('Error generating outputs:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAttractOutputs = async (inputs: any) => {
    // TODO: Replace with actual AI API call
    return {
      jobDescription: `**${inputs.jobTitle}**
${inputs.team} | ${inputs.location}

Job description will be generated based on intake call transcript and role requirements.`,

      internalSpec: `**Internal Profile Specification for ${inputs.jobTitle}**

Profile specification will be generated based on role requirements and team needs.`,

      interviewPlan: `**Interview Process for ${inputs.jobTitle}**

Interview plan will be generated based on role requirements and assessment criteria.`,

      scorecards: `**Interview Scorecards for ${inputs.jobTitle}**

Scorecards will be generated based on role competencies and evaluation criteria.`,

      linkedInPost: `We're hiring a ${inputs.jobTitle} in ${inputs.location}!

LinkedIn post content will be generated based on role details and company messaging.`,

      booleanString: `Boolean search string will be generated based on role requirements and location.`,

      outreachTemplates: `**Outreach Templates for ${inputs.jobTitle}**

Personalized outreach templates will be generated based on role and target candidates.`,

      whyTitanbay: `**Why Join Our Company?**

Company value proposition will be generated based on role and team context.`,

      communities: `**Candidate Sourcing Strategy for ${inputs.jobTitle}**

Sourcing recommendations will be generated based on role requirements and target market.`,

      checklist: [
        `Review job description for ${inputs.jobTitle}`,
        'Set up interview panels and brief interviewers',
        'Create role-specific scorecards',
        'Post job on relevant platforms',
        'Prepare sourcing strategy',
        'Set up outreach templates',
        'Identify target companies',
        'Plan sourcing activities',
        'Create interview guide',
        'Set up tracking systems'
      ]
    };
  };

  const isFormValid = inputs.transcript.trim() && inputs.jobTitle.trim() && inputs.location.trim() && inputs.team.trim();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Attract Stage</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Generate comprehensive hiring assets after your intake call. I'll create job descriptions, interview plans, outreach templates, and sourcing strategies to help you attract top talent.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intake Call Transcript / Notes *
            </label>
            <textarea
              value={inputs.transcript}
              onChange={(e) => handleInputChange('transcript', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Paste your intake call transcript or detailed notes here..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Job Title *
            </label>
            <input
              type="text"
              value={inputs.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Senior Product Manager"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={inputs.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., London, Remote, Hybrid"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team *
            </label>
            <input
              type="text"
              value={inputs.team}
              onChange={(e) => handleInputChange('team', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Product, Engineering, Growth"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manager Notes
            </label>
            <textarea
              value={inputs.managerNotes}
              onChange={(e) => handleInputChange('managerNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Additional notes from the hiring manager..."
              disabled={isGenerating}
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={generateOutputs}
            disabled={!isFormValid || isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-md font-medium hover:from-purple-700 hover:to-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating Hiring Assets...' : 'Generate All Hiring Assets'}
          </button>
        </div>
      </div>

      {outputs && (
        <div className="space-y-6">
          <CopyableOutput
            title="Job Description"
            icon={FileText}
            content={<div className="whitespace-pre-line">{outputs.jobDescription}</div>}
            rawContent={outputs.jobDescription}
          />

          <CopyableOutput
            title="Internal Profile Specification"
            icon={Users}
            content={<div className="whitespace-pre-line">{outputs.internalSpec}</div>}
            rawContent={outputs.internalSpec}
          />

          <CopyableOutput
            title="Interview Plan"
            icon={MessageSquare}
            content={<div className="whitespace-pre-line">{outputs.interviewPlan}</div>}
            rawContent={outputs.interviewPlan}
          />

          <CopyableOutput
            title="Interview Scorecards"
            icon={Star}
            content={<div className="whitespace-pre-line">{outputs.scorecards}</div>}
            rawContent={outputs.scorecards}
          />

          <CopyableOutput
            title="LinkedIn Job Post"
            icon={Users}
            content={<div className="whitespace-pre-line">{outputs.linkedInPost}</div>}
            rawContent={outputs.linkedInPost}
          />

          <CopyableOutput
            title="Boolean Search String"
            icon={Search}
            content={<code className="bg-gray-100 p-2 rounded text-sm block">{outputs.booleanString}</code>}
            rawContent={outputs.booleanString}
          />

          <CopyableOutput
            title="Outreach Email Templates"
            icon={Mail}
            content={<div className="whitespace-pre-line">{outputs.outreachTemplates}</div>}
            rawContent={outputs.outreachTemplates}
          />

          <CopyableOutput
            title="Why Join Titanbay"
            icon={Star}
            content={<div className="whitespace-pre-line">{outputs.whyTitanbay}</div>}
            rawContent={outputs.whyTitanbay}
          />

          <CopyableOutput
            title="Candidate Communities & Events"
            icon={Users}
            content={<div className="whitespace-pre-line">{outputs.communities}</div>}
            rawContent={outputs.communities}
          />

          <CopyableOutput
            title="Stage Checklist"
            icon={MessageSquare}
            content={
              <ul className="space-y-2">
                {outputs.checklist.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <input type="checkbox" className="mr-2 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            }
            rawContent={outputs.checklist.join('\n')}
          />
        </div>
      )}
    </div>
  );
};

export default AttractStage;