import React from "react";
import { signOut } from "next-auth/react";
export default function LogoutButton() {
  // const handleLogout =async () => {
  //  await  signOut({ redirectTo: "/login" });
  // };
  return (
    <button
      className="text-white bg-black px-8 py-2 capitalize rounded-md hover:text-black hover:bg-transparent hover:border hover:border-black transition-colors"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      log out
    </button>
  );
}
