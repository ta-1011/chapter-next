"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PostShowResponse } from "@/_types/post";
import { useParams } from "next/navigation";
import { supabase } from "@/app/_libs/supabase";

const Post = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = useParams();
  const [post, setPost] = useState<PostShowResponse["post"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  useEffect(() => {
    if (!post?.thumbnailImageKey) return;

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [post?.thumbnailImageKey]);

  // APIでpostsを取得する処理をuseEffectで実行
  useEffect(() => {
    const fetcher = async () => {
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
    fetcher();
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
        {thumbnailImageUrl && (
          <div className="mt-8">
            <Image
              src={thumbnailImageUrl}
              alt={post.title}
              width={600}
              height={200}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

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
