import { ObjectId } from "mongoose";
import {
  MemberCountry,
  MemberState,
  MemberStatus,
  MemberType,
} from "../enums/member.enum";

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberFirstName: string;
  memberLastName: string;
  memberEmail: string;
  memberPhone: string;
  memberPassword: string;
  memberImage?: string;
  memberAddress: string[];
  memberCity: string;
  memberCountry: MemberCountry;
  memberState: MemberState;
  memberPostCode: number;
  memberPoints?: number;
}

export interface Member {
  _id: ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberFirstName: string;
  memberLastName: string;
  memberEmail: string;
  memberPhone: string;
  memberPassword: string;
  memberImage?: string;
  memberAddress: string[];
  memberCity: string;
  memberCountry: MemberCountry;
  memberState: MemberState;
  memberPostCode: number;
  memberPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
}
