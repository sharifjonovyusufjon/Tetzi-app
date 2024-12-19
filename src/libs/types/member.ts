import { ObjectId } from "mongoose";
import { Session } from "express-session";
import {
  MemberCountry,
  MemberState,
  MemberStatus,
  MemberType,
} from "../enums/member.enum";
import { Request } from "express";

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
  memberPassword?: string;
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

export interface UpdateMemberInput {
  _id: string;
  memberStatus?: MemberStatus;
  memberFirstName?: string;
  memberLastName?: string;
  memberEmail?: string;
  memberPhone?: string;
  memberAddress?: string[];
  memberCity?: string;
  memberCountry?: MemberCountry;
  memberState?: MemberState;
  memberPostCode?: number;
  memberPoints?: number;
}

export interface LoginInput {
  memberEmail: string;
  memberPassword: string;
}

export interface AdminRequest extends Request {
  member: Member;
  session: Session & { member: Member };
}

export interface ExtendedRequest extends Request {
  member: Member;
}
