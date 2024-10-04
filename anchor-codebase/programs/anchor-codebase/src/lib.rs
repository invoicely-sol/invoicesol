use anchor_lang::prelude::*;

declare_id!("FzCA3TV2MnsHna8LwhW8HwyknW3oTDiWqUPGhfxyQPid");

#[program]
pub mod anchor_codebase {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
