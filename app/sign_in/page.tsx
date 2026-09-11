"use client";

import { supabase } from "../_libs/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InputForm } from "@/_types/inputForm";
import ErrorMessage from "../_components/ui/ErrorMessage";

const Page = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputForm>();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: InputForm) => {
    setIsLoading(true);

    // パスワードが間違っていたりすると、errorが返ってくるので、alertで通知
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      alert("ログインに失敗しました。");
      // ログイン失敗時はresetを使ってパスワード欄は空に
      reset({ email: data.email, password: "" });
    } else {
      router.replace("/admin/posts");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center pt-60">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-100"
      >
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@company.com"
            {...register("email", {
              required: "メールアドレスを入力してください。",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "メールアドレスの形式が正しくありません",
              },
            })}
            disabled={isLoading}
          />
          <ErrorMessage message={errors.email?.message} />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            パスワード
          </label>
          <input
            type="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            disabled={isLoading}
            {...register("password", {
              required: "パスワードを入力してください。",
            })}
          />
          <ErrorMessage message={errors.password?.message} />
        </div>
        <div>
          <button
            type="submit"
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            ログイン
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
