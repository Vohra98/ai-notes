import { SignIn } from '@clerk/nextjs';

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI - Sign in",
    description: "The interligent note taking app sign in page",
  };

const SignInPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <SignIn routing='path'  appearance={{ variables: { colorPrimary: '#0F172A' }}}/>
        </div>
    );
};

export default SignInPage;