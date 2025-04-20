"use client";

import { useState, useEffect } from "react";
import { UserProfileData } from "../types/user-profile-response";

// Mock data for development purposes
const mockUserData: UserProfileData = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/avatars/john-doe.jpg",
  role: "Developer",
  department: "Engineering",
  position: "Senior Developer",
  joinDate: "2022-01-15",
  job_title: "Senior Software Engineer",
  address: "Cairo, Egypt",
  date_appointment: "2022-01-15",
  stats: {
    workingHours: 231,
    completedTasks: 45,
    pendingTasks: 5,
  },
  image_url: "/avatars/john-doe.jpg", // Added the required image_url property
};

/**
 * Hook to fetch user profile data
 * In a real application, this would fetch data from an API
 */
export default function useUserProfileData() {
  const [data, setData] = useState<UserProfileData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        // const response = await apiClient.get('/api/user-profile');
        // setData(response.data);
        
        // For now, we'll use mock data with a timeout to simulate a network request
        setTimeout(() => {
          setData(mockUserData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}