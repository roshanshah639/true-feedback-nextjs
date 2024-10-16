/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-indigo-100">
      <div className="container mx-auto flex flex-col md:flex-row  items-center justify-between">
        <Link className="text-xl mb-4 md:mb-0" href="/">
          True Feedback
        </Link>

        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button
              className="w-full md:w-auto bg-indigo-700 px-8 py-2 rounded-full shadow-md hover:bg-indigo-600"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-indigo-700 px-8 py-2 rounded-full shadow-md hover:bg-indigo-600">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
