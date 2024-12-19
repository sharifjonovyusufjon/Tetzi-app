import Errors, { Message } from "../libs/Errors";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import AuthService from "./Auth.service";

class MemberService {
  private readonly memberModel;
  private readonly authService;
  constructor() {
    this.memberModel = MemberModel;
    this.authService = new AuthService();
  }

  public async signup(input: MemberInput): Promise<Member> {
    try {
      input.memberPassword = await this.authService.hashPassword(
        input.memberPassword
      );

      const result = await this.memberModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      result.memberPassword = "";
      return result;
    } catch (err) {
      console.log("Error, signup:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async login(input: LoginInput): Promise<Member> {
    const search: T = { memberEmail: input.memberEmail };
    const member = await this.memberModel
      .findOne(search)
      .select({ memberPassword: 1 })
      .exec();
    if (!member) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const match = await this.authService.comparePassword(
      input.memberPassword,
      member.memberPassword
    );
    if (!match) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.BLOCKED_USER);
    }

    if (member.memberStatus === MemberStatus.DELETE) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    const result = await this.memberModel.findOne(search);
    return result;
  }

  /* ADMIN */

  public async processSignup(input: MemberInput): Promise<Member> {
    try {
      input.memberPassword = await this.authService.hashPassword(
        input.memberPassword
      );

      const search: T = { memberType: MemberType.ADMIN };
      const exist = await this.memberModel.findOne(search).exec();
      if (exist) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }

      const result: Member = await this.memberModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      result.memberPassword = "";
      return result;
    } catch (err) {
      console.log("Error, processSignup:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const search: T = { memberEmail: input.memberEmail };
    const target = await this.memberModel
      .findOne(search)
      .select({ memberPassword: 1 })
      .exec();
    if (!target) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const match = await this.authService.comparePassword(
      input.memberPassword,
      target.memberPassword
    );
    if (!match) throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);

    if (target.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.BLOCKED_USER);
    }

    if (target.memberStatus === MemberStatus.DELETE) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    const result = await this.memberModel.findOne(search);
    return result;
  }
}

export default MemberService;
