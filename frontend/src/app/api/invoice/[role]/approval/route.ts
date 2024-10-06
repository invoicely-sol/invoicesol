// Invoice Approval API here
// find invoice by the info and make status approved + make a account on Sol

import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/connect-mongo";
import { Invoice } from "@/models/db";

export async function POST(req: NextRequest) {
    console.log('Invoice approval function called!');

    // Connect to MongoDB
    await connectMongo();

    try {
        // Parse the request body
        const body = await req.json();
        console.log(body);
        const { smallBusiness, largeBusiness, amount, invoiceDate, dueDate } = body;

        // Find the invoice in the database
        const invoice = await Invoice.findOne({
            smallBusiness,
            largeBusiness,
            invoiceDate: new Date(invoiceDate),
            dueDate: new Date(dueDate),
        });

        // If no invoice is found, return an error response
        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Update the invoice status to approved
        invoice.status = "approved";
        await invoice.save();

        // Return the updated invoice
        return NextResponse.json({ success: "Invoice Approved", invoice });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}