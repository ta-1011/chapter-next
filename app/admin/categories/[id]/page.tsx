"use client";

import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const page = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSubmitting(true);
      const body: UpdateCategoryRequestBody = { name };

      // カテゴリーの更新
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("カテゴリーの更新に失敗しました。");
      }
      alert("カテゴリーを更新しました。");
    } catch (error) {
      setError("カテゴリーの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // カテゴリーの削除
  const handleDelete = async () => {
    if (!confirm("カテゴリーを削除しますか？")) return;
    if (!token) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (!res.ok) {
        throw new Error("カテゴリーの削除に失敗しました。");
      }
      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      setError("カテゴリーの削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (!res.ok) {
          throw new Error("カテゴリーの取得に失敗しました。");
        }
        const data = await res.json();
        setName(data.category.name);
      } catch (error) {
        setError("カテゴリーの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, [id, token]);

  if (loading) {
    return <p>カテゴリーを読み込み中です。</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">カテゴリー編集</h1>
        </div>
        <CategoryForm
          mode="edit"
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};

export default page;
