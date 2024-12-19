import { ObjectId } from "mongoose";
import {
  ProductBrand,
  ProductCategory,
  ProductColor,
  ProductSize,
  ProductStatus,
} from "../enums/product.enum";

export interface ProductInput {
  productStatus?: ProductStatus;
  productName: string;
  productBrand?: ProductBrand;
  productCategory?: ProductCategory;
  productPrice: number;
  productDesc: string;
  productImages: string[];
  productColor: ProductColor;
  productCount: number;
  productSize?: ProductSize;
}

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  productName: string;
  productBrand: ProductBrand;
  productCategory: ProductCategory;
  productPrice: number;
  productDesc: string;
  productImages: string[];
  productColor: ProductColor;
  productCount: number;
  productSize: ProductSize;
  productComments: number;
  productLikes: number;
  productViews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateProductInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  productName?: string;
  productBrand?: ProductBrand;
  productCategory?: ProductCategory;
  productPrice?: number;
  productDesc?: string;
  productImages?: string[];
  productColor?: ProductColor;
  productCount?: number;
  productSize?: ProductSize;
}
