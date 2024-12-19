import * as bcrypt from "bcryptjs";

class AuthService {
  constructor() {}

  public async hashPassword(input: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(input, salt);
  }

  public async comparePassword(
    inputPassword: string,
    memberPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, memberPassword);
  }
}

export default AuthService;
