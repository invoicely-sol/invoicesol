use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Token, Transfer};
// use anchor_spl::associated_token::get_associated_token_address;

    pub fn initialize_escrow(ctx: Context<InitializeEscrow>, invoice_id: u64, invoice_amount: u64) -> Result<Pubkey> {
        let escrow_account = &mut ctx.accounts.escrow_account;
        escrow_account.invoice_id = invoice_id;
        escrow_account.invoice_amount = invoice_amount;
        escrow_account.total_investment = 0;
        escrow_account.investor_count = 0;
        escrow_account.is_paid = false;
        escrow_account.investors_data = Vec::new();

        Ok(escrow_account.key())
    }

    pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;

        // Transfer tokens to the escrow account
        let cpi_accounts = Transfer {
            from: ctx.accounts.investor_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.investor.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        // Execute the token transfer
        token::transfer(cpi_ctx, amount)?;

        // Update the escrow account with the new investment
        escrow_account.total_investment += amount;
        escrow_account.investor_count += 1;

        // Get the investor's public key
        let investor_key = ctx.accounts.investor.key();

        // Check if the investor already exists
        if let Some(investor_data) = escrow_account.investors_data.iter_mut().find(|data| data.key == investor_key) {
            // Update existing investor contribution
            investor_data.contribution += amount;
        } else {
            // New investor, create entry
            escrow_account.investors_data.push(InvestorData {
                key: investor_key,
                contribution: amount,
            });
        }

        Ok(())
    }
    

    pub fn pay_invoice(ctx: Context<PayInvoice>, invoice_id: u64, payment_amount: u64) -> Result<()> {
        let escrow_account = &mut ctx.accounts.escrow_account;

        // Ensure the invoice ID matches and the invoice is unpaid
        if escrow_account.invoice_id != invoice_id || escrow_account.is_paid {
            return Err(ErrorCode::InvalidInvoice.into());
        }

        // Check if the payment amount matches the required invoice amount
        let invoice_amount = escrow_account.invoice_amount;
        if payment_amount < invoice_amount {
            // If payment is insufficient, return an error
            return Err(ErrorCode::InsufficientPayment.into());
        }

        let from_account = &ctx.accounts.business_account;

        let transfer_instruction =  anchor_lang::solana_program::system_instruction::transfer(
            from_account.key, &escrow_account.key(), payment_amount);
        anchor_lang::solana_program::program::invoke_signed(
            &transfer_instruction,
            &[
                from_account.to_account_info(),
                escrow_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[],
        )?;

        escrow_account.is_paid = true;

        Ok(())
    }

    // pub fn distribute_rewards(ctx: Context<DistributeRewards>, total_paid: u64) -> Result<()> {
    //     let escrow_account = &ctx.accounts.escrow_account;

    //     let total_investment = escrow_account.total_investment;

    //     if total_investment == 0 {
    //         return Err(ErrorCode::NoInvestments.into());
    //     }

    //     // Calculate the total SOL to distribute (50% of total_paid in SOL)
    //     let sol_for_investors = total_paid / 2;

    //     // Calculate rewards for each investor
    //     let mut total_rewarded = 0;

    //     for investor_data in &investors_account.investors {
    //         // Calculate the investor's reward based on their contribution in INVO
    //         let reward = (investor_data.contribution * sol_for_investors) / total_investment;

    //         total_rewarded += reward;

    //         let from_account = &ctx.accounts.from_platform_wallet;
    //         let to_account_key = investor_data.key;

    //         // Transfer the SOL reward to the investor
    //         let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
    //             from_account.key,
    //             &to_account_key,
    //             reward,
    //         );

    //         anchor_lang::solana_program::program::invoke_signed(
    //             &transfer_instruction,
    //             &[
    //                 from_account.to_account_info(),
    //                 ctx.accounts.system_program.to_account_info(),
    //             ],
    //             &[],
    //         )?;

    //         // Get the associated token address
    //         let mint = ctx.accounts.escrow_token_account.mint; // The mint of the token being distributed
    //         let investor_token_account = get_associated_token_address(
    //             &to_account_key, // The wallet address of the investor
    //             &mint,           // The mint of the token
    //         );
    //         let investor_token_account_info = Account::<TokenAccount>::try_from(&investor_token_account)
    //         .map_err(|_| ErrorCode::TokenAccountNotFound)?;
            

    //         // Transfer tokens to the investor
    //         let cpi_accounts = Transfer {
    //             from: ctx.accounts.escrow_token_account.to_account_info(),
    //             to: investor_token_account_info, // Ensure this variable is defined correctly
    //             authority: ctx.accounts.authority.to_account_info(),
    //         };

    //         let amount_to_investor = investor_data.contribution;

    //         let cpi_program = ctx.accounts.token_program.to_account_info();
    //         let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    //         // Execute the token transfer
    //         token::transfer(cpi_ctx, amount_to_investor)?;
    //     }

    //     // Ensure that we accounted for total rewards
    //     msg!("Total SOL rewarded: {}", total_rewarded);

    //     Ok(())
    // }
    

#[derive(Accounts)]
pub struct InitializeEscrow<'info> {
    #[account(init, payer = user, space = EscrowAccount::LEN)]
    pub escrow_account: Account<'info, EscrowAccount>,
    #[account(init_if_needed, payer = user, token::mint = invo_mint, token::authority = escrow_account)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub invo_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Invest<'info> {
    /// The investor making the investment
    pub investor: Signer<'info>,

    /// The investor's token account where the tokens are held
    #[account(mut)]
    pub investor_token_account: Account<'info, TokenAccount>,

    /// The escrow account where tokens will be transferred
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// Token program for token transfers
    pub token_program: Program<'info, Token>,

    /// The escrow account tracking the total investments
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,
}

#[derive(Accounts)]
pub struct PayInvoice<'info> {
    #[account(mut)]
    pub business_account: Signer<'info>,                     // The business making the payment  
    #[account(mut)]
    pub escrow_account: Account<'info, EscrowAccount>,     // The escrow account for the invoice
    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// pub struct DistributeRewards<'info> {
//     #[account(mut)]
//     pub escrow_account: Account<'info, EscrowAccount>,
//     #[account(mut)]
//     pub escrow_token_account: Account<'info, TokenAccount>,
//     pub authority: Signer<'info>,
//     pub system_program: Program<'info, System>,
//     pub token_program: Program<'info, Token>,
// }

#[account]
pub struct InvestorData {
    pub key: Pubkey,
    pub contribution: u64,   // Total contribution from the investor
}

#[account]
pub struct EscrowAccount {
    pub invoice_id: u64,
    pub invoice_amount: u64,
    pub total_investment: u64,
    pub investor_count: u64,
    pub is_paid: bool,
    pub investors_data: Vec<InvestorData>
}

impl EscrowAccount {
    pub const LEN: usize = 8 + 8 + 8 + 1 + 7;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid invoice ID or invoice has already been paid.")]
    InvalidInvoice,
    #[msg("Insufficient payment amount.")]
    InsufficientPayment,
    #[msg("No investments found in the escrow account.")]
    NoInvestments,
}

