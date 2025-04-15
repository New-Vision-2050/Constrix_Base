export type LoginOption = "sms" | "mail" | "password" | "social";

export type LoginWaysSuccessResponse = {
  code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";
  message: string | null;
  payload: {
    login_way: {
      id: string;
      name: string;
      step: {
        login_option: "password" | "otp";
        login_option_alternatives: LoginOption[] | null;
      };
      by: string;
      type: "sms" | "mail";
    };
    token: string;
    can_set_pass: 0 | 1;
  };
};

export type LoginStepsSuccessResponse = {
  code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";
  message: string | null;
  payload: {
    login_way: {
      id: string;
      name: string;
      step: {
        login_option: "password" | "otp";
        drivers: string[];
      } | null;
    };
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};
