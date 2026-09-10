"use client";

import { useState } from "react";
import PostForm from "../_components/PostForm";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { CreatePostResponse } from "@/app/api/admin/posts/route";
import { PostFormValues } from "@/_types/post";
import { useForm } from "react-hook-form";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<PostFormValues>({
      defaultValues: {
        title: "",
        content: "",
        thumbnailImageKey: "",
        categories: [],
      },
    });

  const onSubmit = async (values: PostFormValues) => {
    if (!token) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        throw new Error("記事の作成に失敗しました。");
      }
      // NextResponseから作成した記事のIDを取得
      const data: CreatePostResponse = await res.json();
      alert("記事を作成しました。");
      // 作成が終えたらその記事idページに遷移します。
      router.push(`/admin/posts/${data.id}`);
    } catch (err) {
      alert("記事の作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">記事作成</h1>
      </div>
      <PostForm
        mode="new"
        register={register}
        setValue={setValue}
        watch={watch}
        onSubmit={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default page;
