"use client";

import { API_BASE_URL } from "@/constants";
import { Post } from "@/types/posts";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const Post = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/posts/${id}`);
        const data = await res.json();
        setPost(data.post);
        console.log(data);
      } catch (error) {
        setError("記事の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, []);

  if (loading) {
    return <p>記事を読み込み中です。</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

  if (!post) {
    return (
      <>
        <p>該当する記事が見つかりませんでした。</p>
        <Link href="/" className="topButton">
          トップへ戻る
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="max-w-200 mx-auto py-10">
        <div className="mt-8">
          <Image src={post.thumbnailUrl} alt="" width={800} height={400} />
        </div>
        <div className="flex justify-between pt-4">
          <time>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</time>
          <div className="flex gap-2">
            {post.categories.map((category) => {
              return <span>{category}</span>;
            })}
          </div>
        </div>
        <h1 className="text-4xl">{post.title}</h1>
        <p
          className="pt-4 text-left"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </>
  );
};

export default Post;
