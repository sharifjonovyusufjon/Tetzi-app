import mongoose, { Schema } from "mongoose";

const basketSchema = new Schema(
  {
    basketTotal: {
      type: Number,
      required: true,
    },

    basketQuantity: {
      type: Number,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },

    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Basket", basketSchema);
