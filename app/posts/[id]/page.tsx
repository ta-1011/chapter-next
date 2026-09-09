"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PostShowResponse } from "@/_types/post";
import { useParams } from "next/navigation";
import { supabase } from "@/app/_libs/supabase";
import useSWR from "swr";

const Post = () => {
  const { id } = useParams();
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  const fetcher = async (url: string): Promise<PostShowResponse> => {
    const res = await fetch(url, {
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("記事の取得に失敗しました。");
    }
    return res.json();
  };
  const { data, error, isLoading } = useSWR<PostShowResponse, Error, string>(
    `/api/posts/${id}`,
    fetcher
  );

  useEffect(() => {
    if (!data?.post.thumbnailImageKey) return;

    // アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(data.post.thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };
    fetcher();
  }, [data?.post.thumbnailImageKey]);

  if (isLoading) {
    return <p>記事を読み込み中です。</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  if (!data?.post) {
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
              alt={data.post.title}
              width={600}
              height={200}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        )}

        <div className="flex justify-between pt-4">
          <time>
            {new Date(data.post.createdAt).toLocaleDateString("ja-JP")}
          </time>
          <div className="flex gap-2">
            {data.post.postCategories.map((postCategory) => {
              return (
                <span key={postCategory.category.id}>
                  {postCategory.category.name}
                </span>
              );
            })}
          </div>
        </div>
        <h1 className="text-4xl">{data.post.title}</h1>
        <p
          className="pt-4 text-left"
          dangerouslySetInnerHTML={{ __html: data.post.content }}
        />
      </div>
    </>
  );
};

export default Post;
