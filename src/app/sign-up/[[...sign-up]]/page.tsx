import { SignUp } from '@clerk/nextjs';


import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI - Sign up",
    description: "The interligent note taking app sign up page",
  };

const SignUpPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignUp appearance={{ variables: { colorPrimary: '#0F172A' }}} />
        </div>
    );
};

export default SignUpPage;