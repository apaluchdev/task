import React from "react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";
import { SignInButton } from "./sign-in-button";

const NavBar: React.FC = async () => {
  const session = await getServerSession(authOptions);
  var image = session?.user?.image;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white transition-colors">
      <Link href="/" className="text-2xl font-bold  hover:text-slate-300">
        Task
      </Link>
      <div>
        {!session && <SignInButton />}

        {session && (
          <div className="flex gap-4 justify-center items-center">
            {/* <h2 className="text-sm">{session.user.id}</h2> */}
            <h2 className="text-white tracking-tight">{session.user?.name}</h2>
            {image && <Image src={image} alt="user image" width={40} height={40} className="rounded-full" />}
            <SignOutButton />
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
