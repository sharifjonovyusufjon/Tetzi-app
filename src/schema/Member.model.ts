import mongoose, { Schema } from "mongoose";
import {
  MemberCountry,
  MemberState,
  MemberStatus,
  MemberType,
} from "../libs/enums/member.enum";

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberFirstName: {
      type: String,
      required: true,
    },

    memberLastName: {
      type: String,
      required: true,
    },

    memberEmail: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      select: false,
      required: true,
    },

    memberImage: {
      type: String,
    },

    memberAddress: {
      type: [String],
      required: true,
    },

    memberCity: {
      type: String,
      required: true,
    },

    memberCountry: {
      type: String,
      enum: MemberCountry,
      default: MemberCountry.KOREA,
    },

    memberState: {
      type: String,
      enum: MemberState,
      default: MemberState.SEOUL,
    },

    memberPostCode: {
      type: Number,
      required: true,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);
