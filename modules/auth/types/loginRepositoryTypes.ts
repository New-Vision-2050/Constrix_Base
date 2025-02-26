export type LoginWaysSuccessResponse = {
  code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";
  message: string | null;
  payload: {
    login_way: {
      id: string;
      name: "password" | "otp";
      step: {
        login_option: string;
        drivers: string[];
      };
    };
    token: string;
  };
};

export type LoginStepsSuccessResponse = {
  code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";
  message: string | null;
  payload: {
    login_way: {
      id: string;
      name: string;
      step: "password" | "opt" | null;
    };
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};
