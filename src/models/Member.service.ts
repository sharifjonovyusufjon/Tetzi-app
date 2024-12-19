import MemberModel from "../schema/Member.model";

class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel;
  }
}

export default MemberService;
