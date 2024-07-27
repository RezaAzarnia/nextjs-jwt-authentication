"use client";
import React from "react";
import { signOut } from "next-auth/react";
import Button from "./Button";
export default function LogoutButton() {
  return (
    <Button variant="solid" onClick={() => signOut({ callbackUrl: "/login" })}>
      log out
    </Button>
  );
}
