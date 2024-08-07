"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export const SignOutButton: React.FC = () => {
  return (
    <Button onClick={() => signOut()} className="mr-4 p-0 text-xl hover:text-slate-300 hover:bg-transparent bg-transparent">
      Sign Out
    </Button>
  );
};
