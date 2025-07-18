// Local storage utilities with error handling

const STORAGE_KEYS = {
  JOBS: 'titanhire-jobs',
  USER: 'titanhire-user',
  AUTH_TOKEN: 'titanhire-auth-token'
} as const;

export const storage = {
  // Jobs
  getJobs: (): any[] => {
    try {
      const jobs = localStorage.getItem(STORAGE_KEYS.JOBS);
      if (!jobs) return [];
      
      const parsed = JSON.parse(jobs);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading jobs from storage:', error);
      return [];
    }
  },

  saveJobs: (jobs: any[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
      return true;
    } catch (error) {
      console.error('Error saving jobs to storage:', error);
      return false;
    }
  },

  // User
  getUser: (): any | null => {
    try {
      const user = localStorage.getItem(STORAGE_KEYS.USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      return null;
    }
  },

  saveUser: (user: any): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user to storage:', error);
      return false;
    }
  },

  // Auth token
  getAuthToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error loading auth token from storage:', error);
      return null;
    }
  },

  saveAuthToken: (token: string): boolean => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving auth token to storage:', error);
      return false;
    }
  },

  // Clear all data
  clearAll: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};