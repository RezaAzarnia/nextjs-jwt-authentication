import React from "react";
import Image from "next/image";
import LoginForm from "../_Components/LoginForm";
import registerPicture from "@/app/public/register.png";

export default function page() {
  return (
    <div className="grid grid-cols-2">
      <div className="relative col-span-1">
        <Image
          src={registerPicture}
          fill={true}
          object-fit="cover"
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="regitser picture"
        />
      </div>
      <div className="col-span-1 p-10">
        <LoginForm />
      </div>
    </div>
  );
}
