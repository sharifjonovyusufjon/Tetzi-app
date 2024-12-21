import mongoose, { Schema } from "mongoose";
import {
  ProductBrand,
  ProductCategory,
  ProductColor,
  ProductSize,
  ProductStatus,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productName: {
      type: String,
      required: true,
    },

    productBrand: {
      type: String,
      enum: ProductBrand,
      default: ProductBrand.UPPABABY,
    },

    productCategory: {
      type: String,
      enum: ProductCategory,
      default: ProductCategory.PAMPERS,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String],
      required: true,
    },

    productColor: {
      type: String,
      enum: ProductColor,
      default: ProductColor.PINK,
    },

    productCount: {
      type: Number,
      required: true,
    },

    productComments: {
      type: Number,
      default: 0,
    },

    productLikes: {
      type: Number,
      default: 0,
    },

    productViews: {
      type: Number,
      default: 0,
    },

    productRank: {
      type: Number,
      default: 0,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.M,
    },
  },
  { timestamps: true }
);

productSchema.index(
  { productName: 1, ProductSize: 1, ProductBrand: 1, ProductCategory: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
