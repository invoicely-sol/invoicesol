import CustomerSignin from "@/components/Auth/CustomerSignIn";
import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign In | Invoicely SaaS Starter Kit and Boilerplate for Next.js",
};

const InvestorSigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

      <CustomerSignin />
    </>
  );
};

export default InvestorSigninPage;
