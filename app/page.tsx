"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants";
import Link from "next/link";
import { MicroCmsPost } from "@/_types/MicroCmsPost";

const NewsIndex = () => {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("https://h18qquhz1u.microcms.io/api/v1/posts", {
          headers: {
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_microCMS_API_KEY as string,
          },
        });
        const { contents } = await res.json(); //microCMSのリスト形式API(contents)を分割代入
        setPosts(contents);
      } catch (error) {
        setError("記事の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <p>記事を読み込み中です。</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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
                <Link href={`/post/${post.id}`}>
                  <div className="flex justify-between">
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                    </time>
                    <div className="flex gap-2">
                      {post.categories.map((category) => {
                        return <span key={category.id}>{category.name}</span>;
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
