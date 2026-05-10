"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../constants";
import { Post } from "@/_types/post";
import Link from "next/link";

const NewsIndex = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts`);
        const data = await res.json();
        setPosts(data.posts); //ここのpostsはjsonデータのposts
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
      <div className="max-w-200 mx-auto py-10">
        <h1 className="text-left text-4xl">記事一覧</h1>
        <ul className="mt-4">
          {posts.map((post) => {
            return (
              <li className="p-6 mb-8 border" key={post.id}>
                <Link href={`/post/${post.id}`}>
                  <div className="flex justify-between">
                    <time>
                      {new Date(post.createdAt).toLocaleDateString("ja-JP")}
                    </time>
                    <div className="flex gap-2">
                      {post.categories.map((category: string) => {
                        return <span key={category}>{category}</span>;
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
