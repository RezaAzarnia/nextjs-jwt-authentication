"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "./_Components/Button";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="w-full text-center h-full content-center space-y-6">
      <h1 className="text-6xl font-bold capitalize">404 page</h1>
      <Button variant="solid" onClick={() => router.push("/")}>
        return home
      </Button>
    </div>
  );
}
