"use client";

import host from "@/shared/host";
import { registerSchema } from "@/features/Auth/Schemas/schemas";
import { RegisterType } from "@/features/Auth/Types/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterType>({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data: RegisterType) => {
    try {
      const res = await fetch(`${host}/register`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Попробуйте позже");
    } finally {
      router.push("/faculties");
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
        <div className="flex flex-col gap-y-2 w-[90%]">
          <label className="text-xl font-medium">Группа</label>
          <input
            type="text"
            placeholder="Введите группу"
            {...register("group")}
            className="p-2 rounded-2xl border border-divider-color outline-0 bg-element-bg-2"
          />
          {errors.login && (
            <p className="text-accent-color-red">{errors.login.message}</p>
          )}
        </div>
        <div>
          <button
            type="submit"
            className="py-3 px-3 font-semibold rounded-2xl cursor-pointer bg-app-contrast-bg text-text-contrast-color"
          >
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
}
