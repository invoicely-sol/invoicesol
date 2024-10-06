import { Investor, LgUser, SbUser } from "@/models/db";
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import connectMongo from "@/utils/connect-mongo";
import { useSearchParams } from "next/navigation";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

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

    const setCookie = cookies().set({
      name: 'invoicely',
      value: jwtToken,
      httpOnly: true, // Make the cookie HTTP-only
      secure: true,   // Use secure flag in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });

    return NextResponse.json({token: jwtToken, role: role})
  } catch(e: any){
    return NextResponse.json({ error: 'Internal Server Error'}, {status: 500})
  }
  
}

