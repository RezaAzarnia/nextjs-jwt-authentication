"use client";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Navigation from "./Navigation";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: user } = useSession() 
  console.log(user);

  return (
    <nav className="flex justify-between py-4 px-8 border-b border-gray-400 items-center">
      <Navigation />
      <div className="flex gap-2 items-center">
        {user ? (
          <>
            <span>{`Welcome ${user && user?.username}`}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href={"/login"}
              className="text-black border border-1 border-black px-8 py-2 capitalize rounded-md hover:text-white hover:bg-black transition-colors"
            >
              login
            </Link>
            <Link
              href={"/register"}
              className="text-white bg-black px-8 py-2 capitalize rounded-md hover:text-black hover:bg-transparent hover:border hover:border-black transition-colors"
            >
              sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
