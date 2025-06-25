import { User } from "@/models/user";
import { DimUser, toDimUser } from "./dim-user";

export interface PlainUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  blockedUsers: DimUser[];
  verifyCode: string;
  verifyCodeExpiry: string;
  createdAt: string;
  updatedAt: string;
};

export function toPlainUser(user: User): PlainUser {
  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    blockedUsers: user.blockedUsers.map(b => toDimUser(b)),
    verifyCode: user.verifyCode,
    verifyCodeExpiry: new Date(user.verifyCodeExpiry).toISOString(),
    createdAt: new Date(user.createdAt).toISOString(),
    updatedAt: new Date(user.updatedAt).toISOString(),
  };
}
