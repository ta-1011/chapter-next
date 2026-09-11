"use client";

import { PostIndexResponse } from "@/_types/post";
import Link from "next/link";
import useSWR from "swr";

const fetcher = async (url: string): Promise<PostIndexResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("記事の取得に失敗しました。");
  }
  return res.json();
};
const NewsIndex = () => {
  const { data, error, isLoading } = useSWR<PostIndexResponse, Error, string>(
    "/api/posts",
    fetcher
  );

  if (isLoading) {
    return <p>記事を読み込み中です。</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  // posts に記事がない場合は[]を使う（常に配列として使えるように）
  const posts = data?.posts ?? [];

  if (posts.length === 0) {
    return (
      <>
        <p>記事が見つかりませんでした。</p>
        <div>
          <Link href="/">トップへ戻る</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className=" py-10">
        <h1 className="max-w-200 mx-auto text-left text-4xl">記事一覧</h1>
        <ul className="mt-8 max-w-200 mx-auto">
          {posts.map((post) => {
            return (
              <li className="p-6 mb-8 border" key={post.id}>
                <Link href={`/posts/${post.id}`}>
                  <div className="flex justify-between">
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                    </time>
                    <div className="flex gap-2">
                      {post.postCategories.map((postCategory) => {
                        return (
                          <div key={postCategory.category.id}>
                            {postCategory.category.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <h2 className="text-left text-2xl">{post.title}</h2>
                  <p
                    className="pt-4 text-left"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NewsIndex;
