"use client";

import {
  CategoryShowResponse,
  UpdateCategoryRequestBody,
} from "@/app/api/admin/categories/[id]/route";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

const page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetcher = async ([url, token]: [
    string,
    string
  ]): Promise<CategoryShowResponse> => {
    const res = await fetch(url, {
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    if (!res.ok) {
      throw new Error("カテゴリーの取得に失敗しました。");
    }
    return res.json();
  };

  // 今回のページは更新・削除があるのでmutateが必要
  const { data, error, isLoading, mutate } = useSWR<
    CategoryShowResponse,
    Error,
    [string, string] | null
  >(token ? [`/api/admin/categories/${id}`, token] : null, fetcher);

  useEffect(() => {
    if (data) {
      setName(data.category.name);
    }
  }, [data]);

  // ----- カテゴリーの更新 -----
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!token) return;

    try {
      setIsSubmitting(true);
      const body: UpdateCategoryRequestBody = { name };

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
      mutate();
      alert("カテゴリーを更新しました。");
    } catch (error) {
      alert("カテゴリーの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----- カテゴリーの削除 -----
  const handleDelete = async () => {
    const result = confirm("カテゴリーを削除しますか？");
    if (!result) return;
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
      mutate();
      alert("カテゴリーを削除しました。");
      router.push("/admin/categories");
    } catch (error) {
      alert("カテゴリーの削除に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p>カテゴリーを読み込み中です。</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
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
