"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

export const SignInButton: React.FC = () => {
  return (
    <Button onClick={() => signIn()} className="mr-4 p-0 text-xl hover:text-slate-300 hover:bg-transparent bg-transparent">
      Sign In
    </Button>
  );
};
