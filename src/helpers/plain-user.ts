import { User } from "@/models/user";

export type PlainUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  blockedUsers: string[];
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
    blockedUsers: user.blockedUsers.map(bu => bu._id.toString()),
    verifyCode: user.verifyCode,
    verifyCodeExpiry: user.verifyCodeExpiry.toISOString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
