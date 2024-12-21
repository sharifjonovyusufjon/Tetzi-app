import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {
  private readonly viewModel;
  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkView(input: ViewInput) {
    let newView = null;

    const { viewGroup, memberId, viewRefId } = input;
    const search: T = {
      viewGroup: viewGroup,
      memberId: memberId,
      viewRefId: viewRefId,
    };

    const result = await this.viewModel.findOne(search).exec();

    if (!result) {
      newView = await this.createView(input);
    }

    return newView;
  }

  private async createView(input: ViewInput): Promise<View> {
    try {
      return await this.viewModel.create(input);
    } catch (err) {
      console.log("Error, createView:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
