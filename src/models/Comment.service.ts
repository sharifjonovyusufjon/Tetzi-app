import CommentModel from "../schema/Comment.model";

class CommentService {
  private readonly commentModel;
  constructor() {
    this.commentModel = CommentModel;
  }
}

export default CommentService;
