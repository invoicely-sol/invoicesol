import CustomerSignUp from "@/components/Auth/CustomerSignUp";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Sign Up | Invoicely SaaS Starter Kit and Boilerplate for Next.js",
};

const SbSignupPage = () => {
  return (
    <>
      <Breadcrumb pageName="Business - Sign Up Page" />

      <CustomerSignUp role="business-sm"/>
    </>
  );
};

export default SbSignupPage;
