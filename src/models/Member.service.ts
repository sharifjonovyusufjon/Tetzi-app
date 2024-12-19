import Errors, { Message } from "../libs/Errors";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import { HttpCode } from "../libs/Errors";
import { T } from "../libs/types/common";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";

class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel;
  }

  public async processSignup(input: MemberInput): Promise<Member> {
    try {
      const search: T = { memberType: MemberType.ADMIN };
      const exist = await this.memberModel.findOne(search).exec();
      if (exist) {
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
      }

      const result: Member = await this.memberModel.create(input);
      if (!result)
        throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

      return result;
    } catch (err) {
      console.log("Error, processSignup:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const search: T = { memberEmail: input.memberEmail };
    const result = await this.memberModel.findOne(search).exec();
    if (!result) {
      throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    if (result.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.BLOCKED_USER);
    }

    if (result.memberStatus === MemberStatus.DELETE) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    return result;
  }
}

export default MemberService;
