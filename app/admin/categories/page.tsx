"use client";

import { CategoriesIndexResponse } from "@/app/api/admin/categories/route";
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

const page = () => {
  const { token } = useSupabaseSession();

  const fetcher = async ([url, token]: [
    string,
    string
  ]): Promise<CategoriesIndexResponse> => {
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

  const { data, error, isLoading } = useSWR<
    CategoriesIndexResponse, //① Data型
    Error, //② Error型
    [string, string] | null //③ Key型
  >(token ? ["/api/admin/categories", token] : null, fetcher);

  if (isLoading) {
    return <p>カテゴリーを読み込み中です。</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
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
          {/* dataがない場合もあるため */}
          {data?.categories.map((category) => {
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
