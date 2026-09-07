"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PostShowResponse } from "@/_types/post";
import { useParams } from "next/navigation";

const Post = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = useParams();
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 非同期処理なので、初回レンダリング時点ではまだ記事データが存在しないため、(null)のどちらも許可する必要
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const { post } = await res.json();
        setPost(post);
      } catch (error) {
        setError("記事の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [id]);

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
          <Image
            src={post.thumbnailImageKey.trim()}
            alt={post.title}
            width={600}
            height={200}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="flex justify-between pt-4">
          <time>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</time>
          <div className="flex gap-2">
            {post.postCategories.map((postCategory) => {
              return (
                <span key={postCategory.category.id}>
                  {postCategory.category.name}
                </span>
              );
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
