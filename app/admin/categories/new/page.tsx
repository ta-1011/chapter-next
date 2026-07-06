"use client";

import { CreateCategoryRequestBody } from "@/app/api/admin/categories/route";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";

const page = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: CreateCategoryRequestBody = { name };

    try {
      setIsSubmitting(true);
      // カテゴリーを作成します。
      const res = await fetch(`/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // 作成したカテゴリーのIDを取得
      const data = await res.json();
      router.push(`/admin/categories/${data.id}`);
    } catch (error) {
      console.error("カテゴリーの作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };
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
