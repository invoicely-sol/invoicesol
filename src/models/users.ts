import { Document, model, models ,Schema } from "mongoose";

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


const SbUser = models.SbUser ||  model<IUser>('SbUser', UserSchema);
const LgUser = models.LgUser || model<IUser>('LgUser', UserSchema);
const Investor = models.Investor || model<IUser>('Investor', UserSchema);

export {SbUser, LgUser, Investor}