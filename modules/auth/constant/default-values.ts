import { LoginType } from "../validator/login-schema";

export const formDefaultValues: LoginType = {
  identifier: "",
  password: "",
  forgetPasswordOtp: "",
  newPassword: "",
  confirmNewPassword: "",
  validateEmailOtp: "",
  animal: "",
  team: "",
  confirmNewEmail: "",
  newEmail: "",
  validatePhoneOtp: "",
};
