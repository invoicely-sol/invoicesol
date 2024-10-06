// use anchor_lang::prelude::*;

// declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// #[program]
// pub mod invoice_program {
//     use super::*;

//     pub fn create_invoice(
//         ctx: Context<CreateInvoice>,
//         small_business: String,
//         large_business: String,
//         amount: u64,
//         invoice_number: String,
//         invoice_date: i64,
//         due_date: i64,
//         payment_terms: String,
//         small_business_address: String,
//         percentage_given: u8,
//         small_business_email: String,
//         lg_business_email: String,
//         status: String,
//     ) -> Result<()> {
//         let invoice = &mut ctx.accounts.invoice;
//         invoice.small_business = small_business;
//         invoice.large_business = large_business;
//         invoice.amount = amount;
//         invoice.invoice_number = invoice_number;
//         invoice.invoice_date = invoice_date;
//         invoice.due_date = due_date;
//         invoice.payment_terms = payment_terms;
//         invoice.small_business_address = small_business_address;
//         invoice.percentage_given = percentage_given;
//         invoice.small_business_email = small_business_email;
//         invoice.lg_business_email = lg_business_email;
//         invoice.status = status;
//         Ok(())
//     }

//     pub fn update_status(ctx: Context<UpdateStatus>, new_status: String) -> Result<()> {
//         let invoice = &mut ctx.accounts.invoice;
//         invoice.status = new_status;
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct CreateInvoice<'info> {
//     #[account(init, payer = user, space = 8 + 32 + 32 + 8 + 32 + 8 + 8 + 32 + 64 + 1 + 64 + 64 + 32)]
//     pub invoice: Account<'info, Invoice>,
//     #[account(mut)]
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct UpdateStatus<'info> {
//     #[account(mut)]
//     pub invoice: Account<'info, Invoice>,
//     pub user: Signer<'info>,
// }

// #[account]
// pub struct Invoice {
//     pub small_business: String,
//     pub large_business: String,
//     pub amount: u64,
//     pub invoice_number: String,
//     pub invoice_date: i64,
//     pub due_date: i64,
//     pub payment_terms: String,
//     pub small_business_address: String,
//     pub percentage_given: u8,
//     pub small_business_email: String,
//     pub lg_business_email: String,
//     pub status: String,
// }

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod invoice_program {
    use super::*;

    pub fn create_invoice(ctx: Context<CreateInvoice>) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.small_business = "ABC Small Business".to_string();
        invoice.large_business = "XYZ Large Corporation".to_string();
        invoice.amount = 1000000; // 1,000,000 (in the smallest unit, e.g., lamports)
        invoice.invoice_number = "INV-2024-001".to_string();
        invoice.invoice_date = 1696550400; // October 6, 2024, 00:00:00 UTC
        invoice.due_date = 1699228800; // November 6, 2024, 00:00:00 UTC
        invoice.payment_terms = "Net 30".to_string();
        invoice.small_business_address = "123 Small St, Smallville, SM 12345".to_string();
        invoice.percentage_given = 80; // 80%
        invoice.small_business_email = "contact@abcsmall.com".to_string();
        invoice.lg_business_email = "accounts@xyzlarge.com".to_string();
        invoice.status = "Pending".to_string();
        Ok(())
    }

    pub fn update_status(ctx: Context<UpdateStatus>, new_status: String) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.status = new_status;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateInvoice<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 8 + 32 + 8 + 8 + 32 + 64 + 1 + 64 + 64 + 32)]
    pub invoice: Account<'info, Invoice>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateStatus<'info> {
    #[account(mut)]
    pub invoice: Account<'info, Invoice>,
    pub user: Signer<'info>,
}

#[account]
pub struct Invoice {
    pub small_business: String,
    pub large_business: String,
    pub amount: u64,
    pub invoice_number: String,
    pub invoice_date: i64,
    pub due_date: i64,
    pub payment_terms: String,
    pub small_business_address: String,
    pub percentage_given: u8,
    pub small_business_email: String,
    pub lg_business_email: String,
    pub status: String,
}