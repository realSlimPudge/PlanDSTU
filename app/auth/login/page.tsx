"use client";

import { loginSchema } from "@/features/Auth/Schemas/schemas";
import { AuthType } from "@/features/Auth/Types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const host = process.env.NEXT_PUBLIC_HOST;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthType>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data: AuthType) => {
    try {
      const res = await fetch(`${host}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Попробуйте позже");
    } finally {
      console.log("Успех");
    }
  };

  return (
    <div className="mx-auto w-[80%] sm:w-[30%] h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-5 justify-center items-center py-4 px-3 w-full rounded-2xl border bg-element-bg border-divider-color text-text-color"
      >
        <div className="flex flex-col gap-y-2 w-[90%]">
          <label className="text-xl font-medium">Логин</label>
          <input
            type="text"
            placeholder="Введите логин"
            {...register("login")}
            className="p-2 rounded-2xl border border-divider-color outline-0 bg-element-bg-2"
          />
          {errors.login && (
            <p className="text-accent-color-red">{errors.login.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-y-2 w-[90%]">
          <label className="text-xl font-medium">Пароль</label>
          <input
            className="p-2 rounded-2xl border border-divider-color outline-0 bg-element-bg-2"
            type="password"
            placeholder="Введите пароль"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-accent-color-red">{errors.password.message}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="py-3 px-5 font-semibold rounded-2xl cursor-pointer bg-app-contrast-bg text-text-contrast-color"
          >
            Войти
          </button>
        </div>
      </form>
    </div>
  );
}
