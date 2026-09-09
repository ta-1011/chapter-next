"use client";

import {
  Category,
  UpdatePostRequestBody,
} from "@/app/api/admin/posts/[id]/route";
import { PostShowResponse } from "@/_types/post";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import PostForm from "../_components/PostForm";
import useSWR from "swr";

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const { token } = useSupabaseSession();

  const fetcher = async ([url, token]: [
    string,
    string
  ]): Promise<PostShowResponse> => {
    const res = await fetch(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    if (!res.ok) {
      throw new Error("記事の取得に失敗しました。");
    }
    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR<
    PostShowResponse,
    Error,
    [string, string] | null
  >(token ? [`/api/admin/posts/${id}`, token] : null, fetcher);

  useEffect(() => {
    if (data) {
      setTitle(data.post.title);
      setContent(data.post.content);
      setThumbnailImageKey(data.post.thumbnailImageKey);
      setCategories(data.post.postCategories.map((c) => c.category));
    }
  }, [data]);

  // ----- 記事の更新 -----
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォームのデフォルトの動作をキャンセル。
    if (!token) return;

    try {
      setIsSubmitting(true);
      const body: UpdatePostRequestBody = {
        title,
        content,
        thumbnailImageKey,
        categories,
      };
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("記事の更新に失敗しました。");
      }
      mutate();
      alert("記事を更新しました。");
    } catch (error) {
      alert("記事の更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----- 記事削除 -----
  const handleDelete = async () => {
    const result = confirm("記事を削除しますか？");
    if (!result) return;
    if (!token) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!res.ok) {
        throw new Error("記事の削除に失敗しました。");
      }
      mutate();
      alert("記事を削除しました。");
      router.push("/admin/posts");
    } catch (error) {
      alert("記事の削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>記事を読み込み中です。</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

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
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
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
