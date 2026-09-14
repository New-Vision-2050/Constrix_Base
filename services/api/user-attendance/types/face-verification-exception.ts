export interface FaceVerificationExceptionPayload {
  user_id: string;
  user_name?: string;
  has_face_verification_exception: boolean;
}

export interface FaceVerificationExceptionResponse {
  code?: string;
  message?: string;
  payload: FaceVerificationExceptionPayload;
}

export interface UpdateFaceVerificationExceptionBody {
  has_exception: boolean;
}
