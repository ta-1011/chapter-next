"use client";

import { UpdateCategoryRequestBody } from "@/app/api/admin/categories/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";

const page = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const body: UpdateCategoryRequestBody = { name };

      // カテゴリーの更新
      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      alert("カテゴリーを更新しました。");
    } catch (error) {
      alert("カテゴリーの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // カテゴリーの削除
  const handleDelete = async () => {
    if (!confirm("カテゴリーを削除しますか？")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      alert("カテゴリーの削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();
      console.log(data);
      setName(data.category.name);
    };
    fetcher();
  }, [id]);

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
