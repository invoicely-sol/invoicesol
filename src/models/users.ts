import { Document, model, Schema } from "mongoose";

export interface IUser extends Document{
  name: String,
  email: String,
  password: String
}

const UserSchema =  new Schema<IUser>({
  name: String,
  email: String,
  password: String
})


const SbUser = model<IUser>('SbUser', UserSchema);
const LgUser = model<IUser>('LgUser', UserSchema);
const Investor = model<IUser>('Investor', UserSchema);

export {SbUser, LgUser, Investor}