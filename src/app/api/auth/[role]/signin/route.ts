import { Investor, LgUser, SbUser } from "@/models/users";
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import connectMongo from "@/utils/connect-mongo";
import { useSearchParams } from "next/navigation";
import { sign } from "jsonwebtoken";

export async function POST(req: NextRequest, {params}: {params: {role: string}}) {
  const role = params.role;
  console.log(role);
  const conn = await connectMongo();
  const UserSchema = z.object({
    email: z.string(),
    password: z.string()
  })
  const body = await req.json();
  let User;

  if(role === "business-sm"){
    User = SbUser;
  } else if(role === "business-lg"){
    User = LgUser;
  } else if(role === "investor"){
    User = Investor;
  } else {
    return NextResponse.json({ error: 'Role Not Found' }, { status: 403 })
  }

  try{
    const validate = UserSchema.safeParse({
      email: body.email,
      password: body.password,
    });

    const foundUser = await User?.findOne({
      email: validate.data?.email,
      password: validate.data?.password
    });

    if(foundUser === null){
      return NextResponse.json({ error: 'User does not exist' }, { status: 403 })
    }

    let jwtToken = sign({
      email: body.email,
      id: foundUser._id
    }, process.env.JWT_SECRET as string)

    return NextResponse.json({token: jwtToken, role: role})
  } catch(e: any){
    return NextResponse.json({ error: 'Internal Server Error'}, {status: 500})
  }
  
}

