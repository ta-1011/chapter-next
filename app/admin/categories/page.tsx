"use client";

import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import Link from "next/link";
import { useEffect, useState } from "react";

const page = () => {
  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) {
          throw new Error("カテゴリーの取得に失敗しました。");
        }
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        setError("カテゴリーの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, []);

  if (loading) {
    return <p>カテゴリーを読み込み中です。</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className="">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">カテゴリー一覧</h1>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <Link href="/admin/categories/new">新規作成</Link>
          </button>
        </div>

        <div>
          {categories.map((category) => {
            return (
              <Link href={`/admin/categories/${category.id}`} key={category.id}>
                <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                  <div className="text-xl font-bold">{category.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default page;
