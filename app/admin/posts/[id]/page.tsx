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

const Page = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null); //記事更新・削除用
  const [fetchError, setFetchError] = useState<string | null>(null); //記事取得用
  const { id } = useParams();
  const router = useRouter();

  const { token } = useSupabaseSession();

  //記事更新
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
      alert("記事を更新しました。");
    } catch (error) {
      setActionError("記事の更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  //記事削除
  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("記事を削除しますか？")) return;

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
      alert("記事を削除しました。");
      router.push("/admin/posts"); // useRouterを使うことで、confirmがtrueになれば該当ページに戻る
    } catch (error) {
      setActionError("記事の削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // useEffectの記述
  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!res.ok) {
          throw new Error("記事の取得に失敗しました。");
        }
        const { post }: PostShowResponse = await res.json();
        setTitle(post.title);
        setContent(post.content);
        setThumbnailImageKey(post.thumbnailImageKey);
        setCategories(post.postCategories.map((item) => item.category));
      } catch (error) {
        setFetchError("記事の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetcher(); // ここで関数を呼ぶこと忘れずに
  }, [id, token]);

  if (loading) {
    return <p>記事を読み込み中です。</p>;
  }

  if (actionError) {
    return <p>{actionError}</p>;
  }

  if (fetchError) {
    return <p>{fetchError}</p>;
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
