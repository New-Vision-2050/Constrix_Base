import { UserRepository } from "../repositories/UserRepository";
import { CreateUserI } from "../types/User";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: Omit<CreateUserI, "id">): Promise<CreateUserI> {
    const newUser: CreateUserI = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      title: data.title,
      companyId: data.companyId,
      countryCode: data.countryCode,
    };
    return this.userRepository.create(newUser);
  }
}
