export type LoginStep = {
  login_option: string;
  drivers: string[];
  login_option_alternatives: string[];
};

export type LoginWay = {
  id: string;
  name: string;
  steps: LoginStep[];
};
