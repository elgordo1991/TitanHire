import React, { useState } from 'react';
import { Briefcase, TrendingUp, Award, Calendar, FileText, Users, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { Job } from '../types/Job';
import CopyableOutput from './CopyableOutput';

interface HireStageProps {
  job: Job;
  onComplete: (inputs: any, outputs: any) => void;
}

const HireStage: React.FC<HireStageProps> = ({ job, onComplete }) => {
  const [inputs, setInputs] = useState(job.inputs.hire || {
    offerDetails: '',
    interviewTranscripts: '',
    candidateExpectations: '',
    additionalNotes: ''
  });
  
  const [outputs, setOutputs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load existing outputs if available
  React.useEffect(() => {
    if (job.outputs?.hire) {
      setOutputs(job.outputs.hire);
    }
  }, [job.outputs?.hire]);

  // Update inputs when job changes
  React.useEffect(() => {
    if (job.inputs?.hire) {
      setInputs(job.inputs.hire);
    }
  }, [job.inputs?.hire]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    if (typeof value !== 'string') {
      console.warn('Invalid input value type:', typeof value);
      return;
    }

    setInputs(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateInputs = () => {
    const requiredFields = ['offerDetails', 'interviewTranscripts'];
    const missingFields = requiredFields.filter(field => !inputs[field]?.trim());
    
    if (missingFields.length > 0) {
      const fieldLabels = {
        offerDetails: 'Offer Details',
        interviewTranscripts: 'Interview Feedback'
      };
      const missingLabels = missingFields.map(field => fieldLabels[field] || field);
      setError(`Please fill in the following required fields: ${missingLabels.join(', ')}`);
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
      // const response = await hireAPI.generateOfferAssets(inputs);
      const processingPromise = new Promise(resolve => setTimeout(resolve, 2000));
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 30000)
      );
      
      await Promise.race([processingPromise, timeoutPromise]);
      
      const generatedOutputs = await generateHireOutputs(inputs, job);
      
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

  const generateHireOutputs = async (inputs: any, job: Job) => {
    // TODO: Replace with actual AI API call
    return {
      personalizedOfferLetter: `**OFFER LETTER FOR ${job.title?.toUpperCase() || 'POSITION'}**

Dear [Candidate Name],

We are pleased to extend an offer for the position of ${job.title || '[Job Title]'} in our ${job.department || '[Department]'} team.

**Position Details:**
• Role: ${job.title || '[Job Title]'}
• Department: ${job.department || '[Department]'}
• Start Date: [To be determined]
• Reporting to: [Hiring Manager]

**Compensation Package:**
Details will be generated based on offer parameters and market data.

**Next Steps:**
This offer is subject to final approval and reference checks. We look forward to discussing the details with you.

Best regards,
[Hiring Manager Name]`,

      acceptanceProbability: `**OFFER ACCEPTANCE ANALYSIS FOR ${job.title || 'POSITION'}**

Acceptance probability analysis will be generated based on interview feedback and candidate expectations.

**Key Factors:**
• Interview performance and engagement
• Compensation alignment with expectations
• Cultural fit assessment
• Competing opportunities
• Role progression alignment`,

      offerStrengthening: `**OFFER OPTIMIZATION RECOMMENDATIONS**

Recommendations will be generated based on candidate profile and interview insights.

**Areas to Consider:**
• Compensation adjustments
• Benefits enhancement
• Role clarification
• Growth opportunities
• Start date flexibility`,

      redFlags: `**RISK ASSESSMENT FOR ${job.title || 'POSITION'}**

Risk factors and red flags will be identified based on interview feedback and candidate behavior.

**Monitoring Areas:**
• Response patterns
• Reference feedback
• Negotiation approach
• Commitment indicators`,

      onboardingPrep: `**ONBOARDING PREPARATION FOR ${job.title || 'POSITION'}**

**Pre-Start Checklist:**
☐ Welcome package preparation
☐ IT equipment setup
☐ System access provisioning
☐ First-day agenda planning
☐ Workspace preparation

**Week 1 Plan:**
☐ Welcome and orientation
☐ Team introductions
☐ Role-specific training
☐ Initial project assignment
☐ Regular check-ins setup

**30-Day Milestones:**
☐ Performance expectations review
☐ Goal setting session
☐ Team integration assessment
☐ Feedback collection
☐ Career development planning`
    };
  };

  const isFormValid = inputs.offerDetails?.trim() && inputs.interviewTranscripts?.trim();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Briefcase className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Hire Stage</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Generate personalized offer assets based on interview feedback and candidate expectations. I'll create a tailored offer letter, acceptance probability analysis, and recommendations to strengthen your offer.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Details *
            </label>
            <textarea
              value={inputs.offerDetails || ''}
              onChange={(e) => handleInputChange('offerDetails', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Include salary range, equity, benefits, start date flexibility, any budget constraints or approval requirements..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Feedback & Transcripts *
            </label>
            <textarea
              value={inputs.interviewTranscripts || ''}
              onChange={(e) => handleInputChange('interviewTranscripts', e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Paste interview notes, feedback from panel members, candidate responses, concerns raised, strengths identified..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Expectations & Salary Requirements
            </label>
            <textarea
              value={inputs.candidateExpectations || ''}
              onChange={(e) => handleInputChange('candidateExpectations', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Salary expectations, benefits priorities, working arrangements, career goals, other opportunities mentioned..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={inputs.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Timeline pressures, competing offers, personal circumstances, team dynamics considerations..."
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
            {isGenerating ? 'Generating Personalized Offer...' : 'Generate Personalized Offer Assets'}
          </button>
        </div>
      </div>

      {outputs && (
        <div className="space-y-6">
          <CopyableOutput
            title="Personalized Offer Letter"
            icon={FileText}
            content={<div className="whitespace-pre-line">{outputs.personalizedOfferLetter}</div>}
            rawContent={outputs.personalizedOfferLetter}
          />

          <CopyableOutput
            title="Acceptance Probability Analysis"
            icon={Target}
            content={<div className="whitespace-pre-line">{outputs.acceptanceProbability}</div>}
            rawContent={outputs.acceptanceProbability}
          />

          <CopyableOutput
            title="Offer Strengthening Recommendations"
            icon={TrendingUp}
            content={<div className="whitespace-pre-line">{outputs.offerStrengthening}</div>}
            rawContent={outputs.offerStrengthening}
          />

          <CopyableOutput
            title="Red Flags & Final Considerations"
            icon={AlertTriangle}
            content={<div className="whitespace-pre-line">{outputs.redFlags}</div>}
            rawContent={outputs.redFlags}
          />

          <CopyableOutput
            title="Onboarding Preparation"
            icon={Calendar}
            content={<div className="whitespace-pre-line">{outputs.onboardingPrep}</div>}
            rawContent={outputs.onboardingPrep}
          />

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Personalized Offer Package Ready</h3>
            <p className="text-green-800">
              Your tailored offer assets are complete with personalized recommendations, acceptance probability analysis, and strategic guidance for successful candidate closure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HireStage;