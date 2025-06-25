import { Types } from "mongoose";

export interface DUser extends Document {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
}

export interface DimUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function toDimUser(user: DUser): DimUser {
  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }
}
