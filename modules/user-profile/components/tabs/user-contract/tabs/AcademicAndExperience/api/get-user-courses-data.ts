import { apiClient } from "@/config/axios-config";
import { Course } from "@/modules/user-profile/types/Course";

type ResponseT = {
  code: string;
  message: string;
  payload: Course[];
};

export default async function GetUserCoursesData(userId: string) {
  const res = await apiClient.get<ResponseT>(
    `/user_educational_courses/user/${userId}`
  );

  return res.data.payload;
}
