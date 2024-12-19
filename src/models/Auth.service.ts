import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Member } from "../libs/types/member";
import { AUTH_TIMER, shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Errors";

class AuthService {
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

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

  public async createToken(payload: Member): Promise<string> {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;

      if (!this.secretToken) {
        console.error("Error: secretToken is not defined");
        reject(
          new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
        );
        return;
      }

      const simplifiedPayload: Member = {
        _id: payload._id,
        memberType: payload.memberType,
        memberStatus: payload.memberStatus,
        memberFirstName: payload.memberFirstName,
        memberLastName: payload.memberLastName,
        memberEmail: payload.memberEmail,
        memberPhone: payload.memberPhone,
        memberPassword: payload.memberPassword,
        memberImage: payload.memberImage,
        memberAddress: payload.memberAddress,
        memberCity: payload.memberCity,
        memberCountry: payload.memberCountry,
        memberState: payload.memberState,
        memberPostCode: payload.memberPostCode,
        memberPoints: payload.memberPoints,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
      };

      jwt.sign(
        simplifiedPayload,
        this.secretToken,
        { expiresIn: duration },
        (err, token) => {
          if (err) {
            console.error("Error token:", err);
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED)
            );
          } else {
            console.log("accessToken:", token);
            resolve(token as string);
          }
        }
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken
    )) as Member;
    console.log(`----- [AUTH] memberEmail: ${result.memberEmail} ----`);
    result._id = shapeIntoMongooseObjectId(result._id);
    return result;
  }
}

export default AuthService;
