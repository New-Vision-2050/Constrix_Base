import { LoginType } from "../validator/loginSchema";

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
