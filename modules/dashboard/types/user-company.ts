// ! this declaration must be in company module not here I put it here because I don't found it in the company module

type UserRole = {
  role: string;
  status: string;
};

export type UserCompany = {
  id: string;
  name: string;
  roles: UserRole[];
};
