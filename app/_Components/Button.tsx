"use client";
import Link from "next/link";
import React, { ReactNode } from "react";
type Button = {
  variant: "outline" | "solid";
  children: ReactNode;
  href?: string;
  onClick?: () => void;
};
export default function Button({ variant, href, children, onClick }: Button) {
  let className = "";

  if (variant === "solid") {
    className =
      "text-white bg-black px-8 py-3 capitalize rounded-md hover:text-black hover:bg-transparent hover:border hover:border-black transition-colors";
  } else {
    className =
      "text-black border border-1 border-black px-8 py-3 capitalize rounded-md hover:text-white hover:bg-black transition-colors";
  }
  return (
    <>
      {href ? (
        <Link href={href} className={className}>
          {children}
        </Link>
      ) : (
        <button className={className} onClick={onClick}>
          {children}
        </button>
      )}
    </>
  );
}
