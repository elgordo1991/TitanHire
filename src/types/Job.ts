export interface JobInputs {
  plan: {
    jobTitle: string;
    department: string;
    location: string;
    level: string;
    notes: string;
  };
  attract: {
    transcript: string;
    jobTitle: string;
    location: string;
    team: string;
    managerNotes: string;
  };
  assess: {
    interviewStages: Array<{
      id: string;
      stageName: string;
      panelMember: string;
      assessmentCriteria: string;
      operatingPrinciple: string;
    }>;
  };
  hire: {
    offerDetails: string;
    interviewTranscripts: string;
    candidateExpectations: string;
    additionalNotes: string;
  };
}

export interface JobOutputs {
  plan?: any;
  attract?: any;
  assess?: any;
  hire?: any;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  status: 'draft' | 'planning' | 'active' | 'ready-to-hire';
  created: string;
  lastUpdated: string;
  inputs: JobInputs;
  outputs: JobOutputs;
  completedStages: string[];
}

export type Stage = 'plan' | 'attract' | 'assess' | 'hire';