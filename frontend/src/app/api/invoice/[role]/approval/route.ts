import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/utils/connect-mongo";
import { Invoice } from "@/models/db";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { program } from "@/anchor/setup";

export async function POST(req: NextRequest) {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const invoice = publicKey;

    console.log('Invoice approval function called!');

    // Connect to MongoDB
    await connectMongo();

    try {
        // Parse the request body
        const body = await req.json();
        console.log(body);
        const { smallBusiness, largeBusiness, amount, invoiceDate, dueDate } = body;

        // Create random data for Solana account creation
        const randomsmallBusiness = "Jujutsu Kaisen";
        const randomlargeBusiness= "Black Clover";
        const randomAmount = Math.floor(Math.random() * 10000); // Random amount between 0 and 10000
        const randomInvoiceDate = Date.now(); // Current timestamp
        const randomDueDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // Due date set to one week from now

        // Call createInvoice with the necessary parameters
        const transaction = await program.methods.createInvoice(
            randomsmallBusiness,
            randomlargeBusiness,
            randomAmount,
            randomInvoiceDate,
            randomDueDate
        ).accounts({
        }).rpc();

        console.log("Transaction signature:", transaction);

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

        // Return the updated invoice and transaction details
        return NextResponse.json({ success: "Invoice Approved", invoice, transaction });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}