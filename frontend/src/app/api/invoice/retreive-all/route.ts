import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/connect-mongo";
import { Invoice } from "@/models/db";

export async function GET(req: NextRequest) {
  await connectMongo();

  try {
    // Fetch all invoices where smallBusinessEmail exists
    const foundInvoices = await Invoice.find({
      smallBusinessEmail: { $exists: true }
    });
    
    console.log("Found Invoices:", foundInvoices);
    
    return NextResponse.json({ data: foundInvoices });
    
  } catch (e: any) {
    return NextResponse.json({ error: "Internal Server Error: " + e.message }, { status: 500 });
  }
}