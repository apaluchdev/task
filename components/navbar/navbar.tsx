"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  var image = session?.user?.image;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white transition-colors">
      <Link href="/" className="text-2xl font-bold  hover:text-slate-300">
        Task
      </Link>
      <div>
        {!session && (
          <Button onClick={() => signIn()} className="mr-4 p-0 text-xl hover:text-slate-300 hover:bg-transparent bg-transparent">
            Sign In
          </Button>
        )}

        {session && (
          <div className="flex gap-4 justify-center items-center">
            {/* <h2 className="text-sm">{session.user.id}</h2> */}
            <h2 className="text-white tracking-tight">{session.user?.name}</h2>
            {image && <Image src={image} alt="user image" width={40} height={40} className="rounded-full" />}
            <Button onClick={() => signOut()} className="mr-4 p-0 text-xl hover:text-slate-300 hover:bg-transparent bg-transparent">
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
//  session?.user?.image

export default NavBar;
