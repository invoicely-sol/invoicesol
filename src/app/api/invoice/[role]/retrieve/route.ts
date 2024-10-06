import { NextRequest, NextResponse } from "next/server";
import {object, z} from "zod"
import connectMongo from "@/utils/connect-mongo";
import jwt, { decode, sign, verify } from 'jsonwebtoken';
import { cookies, headers } from "next/headers";
import { Invoice } from "@/models/db";

export async function GET(req: NextRequest, {params}: {params: {role: string}}) {
  let decodedToken;
  const role = params.role;
  console.log(role);
  await connectMongo();
  
  const InvoiceSchema = z.object({
    smallBusiness: z.string(),
    largeBusiness: z.string(),
    amount: z.number(),
    invoiceNumber: z.string(),
    invoiceDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date()
    ),
    dueDate: z.preprocess(
      (arg) => (typeof arg === 'string' ? new Date(arg) : arg),
      z.date()
    ),
    paymentTerms: z.string(),
    smallBusinessAddress: z.string(),
    percentageGiven: z.number(),
    status: z.string(),
  });

  if(role !== "business-sm"){
    return NextResponse.json({ error: 'Role Not Found' }, { status: 403 })
  }
  try{

    // if(headerData.get("Authentication") === null){
    //   return NextResponse.json({"error": "Unauthorized"}, {status: 401})
    // }
      
    // const jwt = headers().get("Authentication")?.split(" ")[1];
    const cookieStore = cookies();
    const jwt = cookieStore.get("invoicely")?.value;
    console.log("aaaaaaa");
    console.log("JWT: ", jwt)
    if(jwt !== undefined){
      const verifyToken = verify(jwt, process.env.JWT_SECRET as string)
      console.log("Verify: ", verifyToken);
      if(verifyToken !== null && typeof verifyToken === 'object' && 'email' in verifyToken){
        const foundInvoice = await Invoice.find({
          smallBusinessEmail: verifyToken?.email,
        });

        console.log("Found Invoice: ", foundInvoice)
        return NextResponse.json({"data": foundInvoice})
      }
  }} catch(e){
    return NextResponse.json({"error": "Internal Server Error " + e}, {status: 500})
  }
  }