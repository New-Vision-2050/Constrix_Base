// Define the user profile data type
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  job_title?: string;
  address?: string;
  date_appointment?: string;
  stats?: {
    workingHours?: number;
    completedTasks?: number;
    pendingTasks?: number;
  };
  // Add any other fields that might be needed
}

// Define the API response type
export interface UserProfileResponse {
  data: UserProfileData;
  status: number;
  message: string;
}