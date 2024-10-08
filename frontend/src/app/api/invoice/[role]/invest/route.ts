import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/connect-mongo";
import { Invoice } from "@/models/db";

export async function PUT(req: NextRequest) {
  await connectMongo();

  try {
    const { invoiceNumber, investmentPercentage } = await req.json();

    // Validate input
    if (!invoiceNumber || typeof investmentPercentage !== 'number') {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Update the invoice with the new investment percentage
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { invoiceNumber },
      { $set: { percentageGiven: investmentPercentage } },
      { new: true } // Return the updated document
    );

    if (!updatedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    console.log('Invoice updated Guys !');
    return NextResponse.json({ data: updatedInvoice });
    
  } catch (e: any) {
    return NextResponse.json({ error: "Internal Server Error: " + e.message }, { status: 500 });
  }
}