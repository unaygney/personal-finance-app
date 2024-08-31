import React from "react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className=" flex-1 flex items-center justify-center w-full h-full p-4">
      <div className="w-full max-w-[560px] flex flex-col gap-8 p-8 bg-white rounded-[12px]">
        <h1 className="text-preset-1 text-grey-900">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
