import { Investor, LgUser, SbUser } from "@/models/db";
import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import connectMongo from "@/utils/connect-mongo";
import jwt, { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest, {params}: {params: {role: string}}) {
  const role = params.role;
  console.log(role);
  await connectMongo();
  const UserSchema = z.object({
    name: z.string(),
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
      name: body.name,
      email: body.email,
      password: body.password,
    });

    const user = await User?.findOne({
        email: body.email
    });

    if(user !== null){
      return NextResponse.json({ error: 'User already exists' }, { status: 403 })
    }
    const createdUser = await User?.create({
      name: body.name,
      email: body.email,
      password: body.password
    });

    let jwtToken = sign({
      email: body.email,
      id: createdUser._id
    }, process.env.JWT_SECRET as string)


    return NextResponse.json({token: jwtToken, role: role})
  } catch(e: any){
    return NextResponse.json({ error: 'Internal Server Error' + e.toString()}, { status: 500 })
  }
}
