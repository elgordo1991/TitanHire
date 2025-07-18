import React, { useState } from 'react';
import { Target, CheckCircle, MapPin, Users, DollarSign, Clock } from 'lucide-react';
import { Job } from '../types/Job';
import CopyableOutput from './CopyableOutput';

interface PlanStageProps {
  job: Job;
  onComplete: (inputs: any, outputs: any) => void;
}

const PlanStage: React.FC<PlanStageProps> = ({ job, onComplete }) => {
  const [inputs, setInputs] = useState(job.inputs.plan);
  
  const [outputs, setOutputs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing outputs if available
  React.useEffect(() => {
    if (job.outputs.plan) {
      setOutputs(job.outputs.plan);
    }
  }, [job.outputs.plan]);

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
      // const response = await planAPI.generateInsights(inputs);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate dynamic content based on actual inputs
      const generatedOutputs = await generatePlanOutputs(inputs);
      
      setOutputs(generatedOutputs);
      onComplete(inputs, generatedOutputs);
    } catch (err) {
      setError('Failed to generate outputs. Please try again.');
      console.error('Error generating outputs:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePlanOutputs = async (inputs: any) => {
    // TODO: Replace with actual AI API call
    return {
      checklist: [
        `What are the key responsibilities for a ${inputs.jobTitle}?`,
        `What skills are essential vs nice-to-have for ${inputs.level} level?`,
        `What does success look like in the first 90 days?`,
        `What challenges is the ${inputs.department} team currently facing?`,
        `What growth opportunities exist in this role?`,
        `What is the team structure and reporting lines?`,
        `What tools and technologies will they be using?`,
        `What is the interview process and timeline?`
      ],
      marketOverview: `**Market Analysis for ${inputs.jobTitle} in ${inputs.location}:**

Based on current market data, ${inputs.level} ${inputs.jobTitle} roles in ${inputs.location} are in high demand. Key insights will be generated based on real-time market analysis.

**Target Companies:**
Analysis of competitor landscape and target companies will be provided based on role requirements and location.`,
      
      skills: [
        `Core competencies for ${inputs.jobTitle}`,
        `${inputs.level}-level experience requirements`,
        `Industry-specific knowledge`,
        `Leadership and collaboration skills`,
        `Technical and analytical capabilities`
      ],
      
      salary: `**${inputs.location} Market Rates for ${inputs.level} ${inputs.jobTitle}:**

Salary data will be generated based on current market analysis and role requirements.`,
      
      timeline: `**Hiring Timeline for ${inputs.level} ${inputs.jobTitle}:**

Timeline estimates will be provided based on role complexity and market conditions.`
    };
  };

  const isFormValid = inputs.jobTitle.trim() && inputs.department.trim() && inputs.location.trim() && inputs.level.trim();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Plan Stage</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Prepare for your intake call by providing basic role information. I'll generate targeted questions and market insights to help you have a strategic conversation with the hiring manager.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
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
              Department / Team *
            </label>
            <input
              type="text"
              value={inputs.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Product, Engineering, Marketing"
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
              Level *
            </label>
            <select
              value={inputs.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              disabled={isGenerating}
            >
              <option value="">Select level</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-level</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="principal">Principal</option>
              <option value="director">Director</option>
              <option value="vp">VP</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={inputs.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Any additional context, requirements, or notes..."
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
            {isGenerating ? 'Generating Insights...' : 'Generate Intake Preparation'}
          </button>
        </div>
      </div>

      {outputs && (
        <div className="space-y-6">
          <CopyableOutput
            title="Intake Call Checklist"
            icon={CheckCircle}
            content={
              <ul className="space-y-2">
                {outputs.checklist.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            }
            rawContent={outputs.checklist.join('\n')}
          />

          <CopyableOutput
            title="Market Overview"
            icon={MapPin}
            content={<div className="whitespace-pre-line">{outputs.marketOverview}</div>}
            rawContent={outputs.marketOverview}
          />

          <CopyableOutput
            title="Top 5 Skills & Traits"
            icon={Users}
            content={
              <ul className="space-y-2">
                {outputs.skills.map((skill: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            }
            rawContent={outputs.skills.join('\n')}
          />

          <CopyableOutput
            title="Salary Ranges"
            icon={DollarSign}
            content={<div className="whitespace-pre-line">{outputs.salary}</div>}
            rawContent={outputs.salary}
          />

          <CopyableOutput
            title="Timeline & Notice Periods"
            icon={Clock}
            content={<div className="whitespace-pre-line">{outputs.timeline}</div>}
            rawContent={outputs.timeline}
          />

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-2">Next Steps</h3>
            <p className="text-purple-800">
              Schedule your intake call with the hiring manager using these insights. Focus on the checklist questions and validate the market assumptions with their specific needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanStage;