"use client";

import {
  Category,
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import { PostShowResponse } from "@/app/api/posts/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm from "../_components/PostForm";

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  //記事更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの動作をキャンセル。

    try {
      setIsSubmitting(true);

      const body: UpdatePostRequestBody = {
        title,
        content,
        thumbnailUrl,
        categories,
      };

      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      alert("記事を更新しました。");
    } catch (error) {
      console.log("記事の更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  //記事削除
  const handleDelete = async () => {
    if (!confirm("記事を削除しますか？")) {
      return;
    }
    try {
      setIsSubmitting(true);
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      alert("記事を削除しました。");
      router.push("/admin/posts"); // useRouterを使うことで、confirmがtrueになれば該当ページに戻る
    } catch (error) {
      console.error("記事の削除に失敗しました。");
      alert("記事の削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // useEffectの記述
  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/posts/${id}`);
      const { post }: PostShowResponse = await res.json();
      setTitle(post.title);
      setContent(post.content);
      setThumbnailUrl(post.thumbnailUrl);
      setCategories(post.postCategories.map((item) => item.category));
    };
    fetcher(); // ここで関数を呼ぶこと忘れずに
  }, [id]);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-xl font-bold">記事編集</h1>
      </div>
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={categories}
        setCategories={setCategories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        disabled={isSubmitting}
      />
    </>
  );
};

export default Page;
