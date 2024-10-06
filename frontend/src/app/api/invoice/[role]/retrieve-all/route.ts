import { NextResponse } from "next/server";
import connectMongo from "@/utils/connect-mongo";
import { Invoice } from "@/models/db";

export async function GET() {
  await connectMongo();

  try {
    const foundInvoices = await Invoice.find(); // Fetch all invoices
    console.log("Found Invoices: ", foundInvoices);
    
    return NextResponse.json({
      success: true,
      message: "Invoices retrieved successfully.",
      data: foundInvoices,
    });
    
  } catch (e: any) {
    console.error("Error fetching invoices: ", e); // Log the error for debugging
    return NextResponse.json(
      { success: false, error: "Internal Server Error", details: e.message },
      { status: 500 },
    );
  }
}