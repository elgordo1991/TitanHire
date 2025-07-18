// Validation utilities for form inputs and data

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateJobInputs = (inputs: any, stage: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  switch (stage) {
    case 'plan':
      if (!inputs.jobTitle?.trim()) errors.push('Job title is required');
      if (!inputs.department?.trim()) errors.push('Department is required');
      if (!inputs.location?.trim()) errors.push('Location is required');
      if (!inputs.level?.trim()) errors.push('Level is required');
      break;
      
    case 'attract':
      if (!inputs.transcript?.trim()) errors.push('Intake call transcript is required');
      if (!inputs.jobTitle?.trim()) errors.push('Job title is required');
      if (!inputs.location?.trim()) errors.push('Location is required');
      if (!inputs.team?.trim()) errors.push('Team is required');
      break;
      
    case 'assess':
      if (!inputs.interviewStages || inputs.interviewStages.length === 0) {
        errors.push('At least one interview stage is required');
      } else {
        inputs.interviewStages.forEach((stage: any, index: number) => {
          if (!stage.stageName?.trim()) errors.push(`Stage ${index + 1} name is required`);
          if (!stage.panelMember?.trim()) errors.push(`Stage ${index + 1} panel member is required`);
          if (!stage.assessmentCriteria?.trim()) errors.push(`Stage ${index + 1} assessment criteria is required`);
          if (!stage.operatingPrinciple?.trim()) errors.push(`Stage ${index + 1} operating principle is required`);
        });
      }
      break;
      
    case 'hire':
      if (!inputs.offerDetails?.trim()) errors.push('Offer details are required');
      if (!inputs.interviewTranscripts?.trim()) errors.push('Interview feedback is required');
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};