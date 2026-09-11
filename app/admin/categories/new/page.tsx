"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const page = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { token } = useSupabaseSession();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const body: CreateCategoryRequestBody = { name };

    try {
      setIsSubmitting(true);
      // カテゴリーを作成します。
      const res = await fetch(`/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error("カテゴリーの作成に失敗しました");
      }

      // 作成したカテゴリーのIDを取得
      const data = await res.json();
      alert("カテゴリーを作成しました。");
      router.push(`/admin/categories/${data.id}`);
    } catch (error) {
      setError("カテゴリーの作成に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">カテゴリー作成</h1>
      </div>
      <CategoryForm
        mode="new"
        name={name}
        setName={setName}
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default page;
