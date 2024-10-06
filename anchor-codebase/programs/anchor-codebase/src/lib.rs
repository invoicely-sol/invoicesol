use anchor_lang::prelude::*;

declare_id!("5c2Lu6R3bVrvVpWhMnGWRxcbpVR1vui8gK8hiAGCSj5F");

#[program]
pub mod invoice_program {
    use super::*;

    pub fn create_invoice(
        ctx: Context<CreateInvoice>,
        small_business: String,
        large_business: String,
        amount: u64,
        invoice_date: i64,
        due_date: i64,
    ) -> Result<Pubkey> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.small_business = small_business;
        invoice.large_business = large_business;
        invoice.amount = amount;
        invoice.invoice_date = invoice_date;
        invoice.due_date = due_date;

        Ok(invoice.key())
    }

    pub fn update_status(ctx: Context<UpdateStatus>, new_status: String) -> Result<()> {
        let invoice = &mut ctx.accounts.invoice;
        invoice.status = new_status;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateInvoice<'info> {
    #[account(init, payer = user, space = Invoice::SPACE)]
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
    pub invoice_date: i64,
    pub due_date: i64,
    pub status: String,
}

impl Invoice {
    pub const SPACE: usize = 8 +  // discriminator
                             32 + // small_business (max size)
                             32 + // large_business (max size)
                             8 +  // amount
                             8 +  // invoice_date
                             8 +  // due_date
                             32;  // status (max size for String)
}