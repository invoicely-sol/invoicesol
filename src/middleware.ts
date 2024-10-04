import { decode, verify } from 'jsonwebtoken';
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let decodedToken;
  console.log("Reaching here");
  const headerData = headers();
  if(headerData.get("Authentication") === null){
    return NextResponse.json({"error": "Unauthorized"}, {status: 401})
  }
  const jwt = headers().get("Authentication")?.split(" ")[1];
  if(jwt !== undefined){
    const verifyToken = verify(jwt, process.env.JWT_SECRET as string)
    console.log("Verify: ", verifyToken);
    if(verifyToken){
      decodedToken = decode(jwt);
      console.log(decodedToken);
    }
    console.log(verifyToken)
  }
  console.log(jwt);
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/auth/business-sm/invoice-dashboard',
}