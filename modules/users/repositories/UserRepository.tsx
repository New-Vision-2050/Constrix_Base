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
    const timeZoneBody = user.takeTimeZone
      ? {
          country_id: user.country,
          time_zone_id: user.timeZone,
          currency_id: user.currency,
          language_id: user.lang,
        }
      : {};
    const body = {
      email: user.email,
      job_title_id: user.title,
      name: `${user.firstName} ${user.lastName}`,
      phone: `${user.countryCode} ${user.phone}`,
      company_id: user.companyId,
      ...timeZoneBody,
    };
    // ! The following line is a temporary override for testing purposes.
    // Remove it once the backend URL is stable and ready for production.
    const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
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

  static async confirmUserData(userId: string, company_id: string) {
    try {
      // ! The following line is a temporary override for testing purposes.
      // Remove it once the backend URL is stable and ready for production.
      const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE3LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4iLCJpYXQiOjE3NDE4MTE3MDMsImV4cCI6MTc0MTg5ODEwMywibmJmIjoxNzQxODExNzAzLCJqdGkiOiI0V2puUzJITVBxUGJtdzNPIiwic3ViIjoiYzcxMTkxYjUtZWJjZS00ZmQxLTlhNjgtYzIwOTljMmEzZjM5IiwicHJ2IjoiYmI2NWQ5YjhmYmYwZGE5ODI3YzhlZDIzMWQ5YzU0YzgxN2YwZmJiMiJ9.Dk1YdDd03FOWfrCfKeNNdNG7KlI0oy6ri4xCx3qznvU`;
      const url = `https://core-be-pr17.constrix-nv.com/api/v1/company-users/${userId}/assign-role`;

      const response = await axios
        .post(
          url,
          {
            company_id: company_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) => {
          const _err = err as AxiosError;
          throw _err;
        });

      if (!response.data) throw new Error("Failed to confirm user data");

      return response.data.data;
    } catch (err) {
      console.log("err", err);
    }
  }

  async findById(id: string) {}

  async findAll() {}

  async update(user: Partial<CreateUserI>) {}

  async delete(id: string) {}
}
