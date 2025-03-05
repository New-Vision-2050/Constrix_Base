export type LoginWaysSuccessResponse = {
  code: "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT";
  message: string | null;
  payload: {
    login_way: {
      id: string;
      name: string;
      step: {
        login_option: "password" | "otp";
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

interface IUser {
  name: string;
  createEmail: (email: string) => void;
}

const ss: IUser[] = [];
ss[0].createEmail("omar@gmail.com");
