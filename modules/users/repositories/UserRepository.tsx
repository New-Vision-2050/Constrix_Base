import axios, { AxiosError } from "axios";
import { CreateUserI } from "../types/User";
import { usersEndPoints } from "../constants/end-points";

export class UserRepository {
  private readonly apiUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    "/" +
    process.env.NEXT_PUBLIC_API_PATH +
    "/" +
    process.env.NEXT_PUBLIC_API_VERSION;

  async create(user: CreateUserI) {
    // const url = this.apiUrl + usersEndPoints.create;
    const body = {};
    console.log('UserRepository create',user)
    // ! The following line is a temporary override for testing purposes.
    // Remove it once the backend URL is stable and ready for production.
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE1NTk3ODcsImV4cCI6MTc0MTY0NjE4NywibmJmIjoxNzQxNTU5Nzg3LCJqdGkiOiJWaTBhU2dCNTBxeDJTSVlDIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.F1Z1iZ6rFPW6y6K-46nWvELVNlmUhm_p4qek6vzGe4Y`;
    const url = `https://core-be-pr17.constrix-nv.com/api/v1${usersEndPoints.create}`;

    const response = await axios
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        const _err = err as AxiosError;
        throw _err;
      });

    if (!response.data) throw new Error("Failed to create company");

    return response.data.data;
  }

  async findById(id: string) {}

  async findAll() {}

  async update(user: Partial<CreateUserI>) {}

  async delete(id: string) {}
}
