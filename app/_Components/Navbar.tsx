import Link from "next/link";
import { getSession } from "@/app/app/_lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getSession();

  return (
    <nav className="flex justify-between py-4 px-8 border-b border-gray-400">
      <ul className="flex items-center text-gray-500 gap-5 ">
        <li className="cursor-pointer hover:text-black transition-colors text-black">
          <Link href={"/"}>Home</Link>
        </li>
        <li className="cursor-pointer hover:text-black transition-colors">
          <Link href={"/web"}>Web design</Link>
        </li>
        <li className="cursor-pointer hover:text-black transition-colors">
          <Link href={"/mobile"}>Mobile design</Link>
        </li>
        <li className="cursor-pointer hover:text-black transition-colors">
          <Link href={"/dashboard"}>dashboard</Link>
        </li>
      </ul>
      <div className="flex gap-4">
        {user ? (
          <LogoutButton />
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
