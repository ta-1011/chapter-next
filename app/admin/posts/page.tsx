"use client";

import { PostsIndexResponse } from "@/app/api/posts/route";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [posts, setPosts] = useState<PostsIndexResponse["posts"]>([]);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/posts");
      const data: PostsIndexResponse = await res.json();
      setPosts(data.posts);
    };
    fetcher();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold">記事一覧</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
          <Link href="/admin/posts/new">新規作成</Link>
        </button>
      </div>

      <div className="">
        {posts.map((post) => {
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
