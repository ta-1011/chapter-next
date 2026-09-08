"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/constants";
import Input from "@/app/_components/ui/Input";
import ErrorMessage from "@/app/_components/ui/ErrorMessage";
import TextArea from "@/app/_components/ui/TextArea";
import { useForm } from "react-hook-form";
import { ContactForm } from "@/_types/contactForm";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  const [isSubmit, setIsSubmit] = useState(false);

  //送信の処理
  const onSubmit = async (data: ContactForm) => {
    setIsSubmit(true);

    try {
      const res = await fetch(`${API_BASE_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }
      alert("送信しました。");
      reset();
    } catch (error) {
      alert("送信に失敗しました");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <div className="max-w-200 mx-auto py-10">
        <h1 className="text-left text-4xl">お問い合わせ</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              お名前
            </label>
            <div className="w-full">
              <Input
                disabled={isSubmit}
                type="text"
                id="name"
                {...register("name", {
                  required: "お名前を入力してください。",
                })}
              />
              <ErrorMessage message={errors.name?.message} />
            </div>
          </div>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              メールアドレス
            </label>
            <div className="w-full">
              <Input
                disabled={isSubmit}
                type="email"
                id="email"
                {...register("email", {
                  required: "メールアドレスを入力してください。",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "メールアドレスの形式が正しくありません",
                  },
                })}
              />
              <ErrorMessage message={errors.email?.message} />
            </div>
          </div>
          <div className="mt-8 w-full flex justify-between">
            <label htmlFor="" className="w-60">
              お問い合わせ内容
            </label>
            <div className="w-full">
              <TextArea
                disabled={isSubmit}
                id="message"
                {...register("message", {
                  required: "お問い合わせ内容を入力してください。",
                })}
              />
              <ErrorMessage message={errors.message?.message} />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" className="mr-4" disabled={isSubmit}>
              送信
            </button>
            <button type="button" onClick={() => reset()} disabled={isSubmit}>
              クリア
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Contact;
