import SbSignUp from "@/components/Auth/SbSignUp";
import SignUp from "@/components/Auth/SignUp";
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

      <SbSignUp />
    </>
  );
};

export default SbSignupPage;
