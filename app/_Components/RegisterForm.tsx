"use client";
import Link from "next/link";
import React from "react";
import Input from "./Input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/app/app/_lib/userSchema";
import { User } from "@/app/app/_lib/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const methods = useForm<User>({
    resolver: zodResolver(registerSchema),
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = methods;

  const handleRegister: SubmitHandler<User> = async (data: User) => {
    try {
      const res = await fetch("/api/user/register", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (res.ok) {
        reset();
        router.push("/");
      }
      if (response.status === 400) {
        Object.entries(response.error).forEach((err) => {
          console.log(err);
          setError(err[0] as keyof User, {
            type: "server",
            message: err[1] as string,
          });
        });
      } else if (res.status === 409) {
        toast(response?.error, {
          type: "error",
          theme: "colored",
          closeOnClick: true,
        });
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
        className="flex h-full flex-col justify-center gap-6"
        onSubmit={handleSubmit(handleRegister)}
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold text-black">Sign up</h1>
          <p className="text-gray-600 text-sm">
            Sign up for free to access to in any of our products{" "}
          </p>
        </div>
        <div className="space-y-3">
          <Input
            name="username"
            label="Username"
            type="text"
            placeholder="please enter your username"
          />
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
          <Input
            name="confirm"
            label="confirm Password"
            type="password"
            placeholder="please enter your password again"
          />
        </div>
        <div>
          <button
            className="bg-black px-8 py-4 text-white rounded-full w-full lg:w-1/3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className="spinner-mini"></div> : "Sign up"}
          </button>
          <div className="mt-3">
            <span>Already have an account?</span>
            <Link
              href={"/login"}
              className="text-blue-700
               underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
