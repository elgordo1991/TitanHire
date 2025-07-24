// API service layer for backend integration
// TODO: Replace with actual API endpoints
import { supabase } from './supabaseClient';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  fullName: string;
  role: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Authentication API
export const authAPI = {
  async login(credentials: AuthCredentials): Promise<ApiResponse<User>> {
    const { email, password } = credentials;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      return { data: null as any, success: false, message: error?.message || 'Login failed' };
    }
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.fullName || data.user.user_metadata?.full_name || 'User',
      email: data.user.email!,
      role: data.user.user_metadata?.role || 'Team Member',
    };
    return { data: user, success: true };
  },

  async register(data: RegisterData): Promise<ApiResponse<User>> {
    const { email, password, fullName, role } = data;
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullName, role },
      }
    });
    if (error || !signUpData.user) {
      return { data: null as any, success: false, message: error?.message || 'Registration failed' };
    }
    const user: User = {
      id: signUpData.user.id,
      name: fullName,
      email: signUpData.user.email!,
      role: role || 'Team Member',
    };
    return { data: user, success: true };
  },

  async logout(): Promise<ApiResponse<void>> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { data: undefined as any, success: false, message: error.message };
    }
    return { data: undefined as any, success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return { data: null as any, success: false, message: error?.message || 'No user logged in' };
    }
    const user: User = {
      id: data.user.id,
      name: data.user.user_metadata?.fullName || data.user.user_metadata?.full_name || 'User',
      email: data.user.email!,
      role: data.user.user_metadata?.role || 'Team Member',
    };
    return { data: user, success: true };
  },

  async updateProfile(userData: { name: string; email: string; role: string }): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: userData.email,
        data: { 
          fullName: userData.name,
          full_name: userData.name, // Some systems use this format
          role: userData.role 
        }
      });
      
      if (error) {
        return { data: null as any, success: false, message: error.message };
      }
      
      const user: User = {
        id: data.user.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };
      
      return { data: user, success: true };
    } catch (error) {
      return { data: null as any, success: false, message: 'Failed to update profile' };
    }
  }
};

// Update user profile (name and role in user_metadata, email directly)
export async function updateUserProfile({
  name,
  role,
  email,
}: { name: string; role: string; email: string }) {
  // This updates the user's email and metadata (name and role)
  const { data, error } = await supabase.auth.updateUser({
    email, // can be the same or a new email
    data: { fullName: name, role },
  });
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, data: data.user };
}

// Job API
export const jobAPI = {
  async getJobs(): Promise<ApiResponse<any[]>> {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  async createJob(jobData: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  async updateJob(jobId: string, jobData: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  },

  async deleteJob(jobId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call
    throw new Error('API not implemented');
  }
};

// AI Generation APIs
export const planAPI = {
  async generateInsights(inputs: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual AI API call
    throw new Error('API not implemented');
  }
};

export const attractAPI = {
  async generateAssets(inputs: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual AI API call
    throw new Error('API not implemented');
  }
};

export const assessAPI = {
  async generateInterviewProcess(inputs: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual AI API call
    throw new Error('API not implemented');
  }
};

export const hireAPI = {
  async generateOfferAssets(inputs: any): Promise<ApiResponse<any>> {
    // TODO: Replace with actual AI API call
    throw new Error('API not implemented');
  }
};