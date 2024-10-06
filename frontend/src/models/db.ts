import { Document, model, models ,Schema } from "mongoose";

export interface IUser extends Document{
  name: String,
  email: String,
  password: String
}

export interface IInvoice{
  smallBusiness: string,
  largeBusiness: string,
  amount: number,
  invoiceNumber: string,
  invoiceDate: Date,
  dueDate: Date,
  paymentTerms: string,
  smallBusinessAddress: string,
  percentageGiven: number,
  smallBusinessEmail: string,
  lgBusinessEmail: string,
  status: string,
  // owner: [{'address': amount}]
}

const UserSchema =  new Schema<IUser>({
  name: String,
  email: String,
  password: String
})

const InvoiceSchema = new Schema<IInvoice>({
  smallBusiness: String,
  largeBusiness: String,
  amount: Number,
  invoiceNumber: String,
  invoiceDate: Date,
  dueDate: Date,
  paymentTerms: String,
  smallBusinessAddress: String,
  percentageGiven: Number,
  smallBusinessEmail: String,
  lgBusinessEmail: String,
  status: String
})

const SbUser = models.SbUser ||  model<IUser>('SbUser', UserSchema);
const LgUser = models.LgUser || model<IUser>('LgUser', UserSchema);
const Investor = models.Investor || model<IUser>('Investor', UserSchema);

const Invoice = models.Invoice || model<IInvoice>('Invoice', InvoiceSchema);

export {SbUser, LgUser, Investor, Invoice}