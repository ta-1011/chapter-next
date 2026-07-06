"use client";

import React, { useState } from "react";
import PostForm from "../_components/PostForm";
import { Category } from "@/app/api/posts/[id]/route";
import { useRouter } from "next/navigation";
import {
  CreatePostRequestBody,
  CreatePostResponse,
} from "@/app/api/admin/posts/route";

const page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(
    "https://placehold.jp/800x400.png"
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const body: CreatePostRequestBody = {
        title,
        content,
        thumbnailUrl,
        categories,
      };

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // NextResponseから作成した記事のIDを取得
      const data: CreatePostResponse = await res.json();
      // 作成が終えたらその記事idページに遷移します。
      router.push(`admin/posts/" ${data.id}`);
      alert("記事を作成しました。");
    } catch (error) {
      console.error("記事の作成に失敗しました。");
      alert("記事の作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold">記事作成</h1>
      </div>
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </>
  );
};

export default page;
