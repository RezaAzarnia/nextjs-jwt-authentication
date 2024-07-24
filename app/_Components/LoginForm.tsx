"use client";
import Link from "next/link";
import React from "react";
import Input from "./Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/app/app/_lib/userSchema";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginUser } from "@/app/app/_lib/types";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
export default function LoginForm() {
  const router = useRouter();

  const methods = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleLogin = async (data: LoginUser) => {
    try {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      if (res?.error) {
        toast("email or password is wrong", {
          type: "error",
          theme: "colored",
          closeOnClick: true,
        });
      }
      if (!res?.error) {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast(error?.message, {
          type: "error",
          theme: "colored",
          closeOnClick: true,
        });
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className="flex h-full flex-col justify-center gap-10"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-black">Log in</h1>
          <p className="text-gray-600 text-sm">
            Log in for free to access to in any of our products
          </p>
        </div>
        <div className="space-y-5">
          <Input
            name="email"
            label="Email address"
            type="text"
            placeholder="please enter your email address"
          />

          <Input
            name="password"
            label="Password"
            type="password"
            placeholder="please enter your password"
          />
        </div>
        <div>
          <button
            className="bg-black px-8 py-4 text-white rounded-full w-full lg:w-1/3 text-center disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Log in
          </button>
          <div className="mt-3">
            <span>Don&apos;t have an account? </span>
            <Link
              href={"/sign up"}
              className="text-blue-700
        underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
