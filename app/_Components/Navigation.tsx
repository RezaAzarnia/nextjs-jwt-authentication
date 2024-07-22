"use client";
import React, { useEffect, useState } from "react";
import Hamburger from "./Hamburger";
import Link from "next/link";

export default function Navigation() {
  const [isOpen, setIsopen] = useState(false);

  return (
    <div className="h-full">
      <button
        className="block w-10 md:hidden"
        onClick={() => setIsopen((prev) => !prev)}
      >
        <Hamburger />
      </button>
      <ul
        className={`absolute bg-white shadow-xl shadow-slate-700 
        min-w-[250px] transition-all p-8 h-full space-y-8
        ${isOpen ? "left-0" : "-left-full"}

        md:flex items-center text-gray-500 gap-5 md:static md:bg-transparent md:shadow-none md:space-y-0 md:p-4`}
      >
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
    </div>
  );
}
