"use client";

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { PostsIndexResponse } from "@/app/api/posts/route";
import Link from "next/link";
import useSWR from "swr";

const Page = () => {
  const { token } = useSupabaseSession();

  const fetcher = async ([url, token]: [
    string,
    string
  ]): Promise<PostsIndexResponse> => {
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

  const { data, error, isLoading } = useSWR<
    PostsIndexResponse,
    Error,
    [string, string] | null
  >(token ? ["/api/admin/posts", token] : null, fetcher);

  if (isLoading) {
    return <p>記事を読み込み中です。</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {data?.posts.map((post) => {
          return (
            <Link href={`/admin/posts/${post.id}`} key={post.id}>
              <div className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer">
                <div className="text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Page;
