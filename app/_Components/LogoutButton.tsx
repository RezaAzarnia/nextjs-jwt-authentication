"use client";
import React, { ReactNode } from "react";
import { removeSession } from "../_lib/auth";

export default function LogoutButton() {
  return (
    <button
      className="text-white bg-black px-8 py-2 capitalize rounded-md hover:text-black hover:bg-transparent hover:border hover:border-black transition-colors"
      onClick={() => removeSession()}
    >
      log out
    </button>
  );
}
