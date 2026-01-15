export interface CreateBranchParams {
  name: string;
  address: string;
  phone: string;
  email: string;
  type?: string;
}

export interface UpdateBranchParams {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  type?: string;
}
