import Image from "next/image";
import React from "react";
import registerPicture from "@/app/public/register.png";
import RegisterForm from "@/app/app/_Components/RegisterForm";
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
        <RegisterForm />
      </div>
    </div>
  );
}