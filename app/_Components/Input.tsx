import React, { MouseEvent, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import OpenEye from "./OpenEye";
import CloseEye from "./CloseEye";
type InputType = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
};
export default function Input({ name, label, type, placeholder }: InputType) {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const handleShowPassword = useCallback(
    (e: MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      setIsShowPassword((prev) => !prev);
    },
    []
  );
  return (
    <div className="space-y-1 ">
      {type == "password" ? (
        <div className="flex justify-between items-center">
          <label className="text-gray-500 text-sm">{label}</label>
          <button
            className="text-sm space-x-1 cursor-pointer"
            onClick={handleShowPassword}
          >
            {isShowPassword ? <OpenEye /> : <CloseEye />}
            <span>{isShowPassword ? "hide" : "show"}</span>
          </button>
        </div>
      ) : (
        <label className="text-gray-500 text-sm">{label}</label>
      )}

      <input
        type={type === "password" && isShowPassword ? "text" : type}
        placeholder={placeholder}
        className="border border-gray-400 px-3 py-3 rounded-md 
        w-full outline-none focus:shadow-md transition-all 
        placeholder:text-sm placeholder:capitalize
        "
        {...register(name)}
      />
      {errors && (
        <span className="text-red-600 text-sm">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
}
