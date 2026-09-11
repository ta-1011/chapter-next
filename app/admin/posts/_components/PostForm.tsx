"use client";

import { Category } from "@/app/api/admin/posts/[id]/route";
import React, { ChangeEvent, useEffect, useState } from "react";
import { CategoriesSelect } from "./CategoriesSelect";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import { supabase } from "@/app/_libs/supabase";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { PostFormValues } from "@/_types/post";

export type Props = {
  mode: "new" | "edit";
  register: UseFormRegister<PostFormValues>;
  setValue: UseFormSetValue<PostFormValues>;
  watch: UseFormWatch<PostFormValues>;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onDelete?: () => void; //新規ページでは削除は不要のため?は必要
  disabled: boolean;
};

const PostForm = ({
  mode,
  register,
  setValue,
  watch,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );

  // ----- 現在のフォーム値を取り出す -----
  const thumbnailImageKey = watch("thumbnailImageKey");
  const categories = watch("categories");

  useEffect(() => {
    if (!thumbnailImageKey) return;

    //アップロード時に取得した、thumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);
      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return;
    }

    const file = e.target.files[0]; // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; // ファイルパスを指定（private/がないと保存できないような設定になっています。）

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") // ()の中はバケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      return alert(error.message);
    }
    // data.pathに、画像固有のkeyが入っているので、フォームの値にセット
    setValue("thumbnailImageKey", data.path);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            タイトル
          </label>
          <input
            disabled={disabled}
            type="text"
            id="title"
            {...register("title")}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            内容
          </label>
          <textarea
            id="content"
            {...register("content")}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label
            htmlFor="thumbnailImageKey"
            className="block text-sm font-medium text-gray-700"
          >
            サムネイルURL
          </label>
          <input
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
            disabled={disabled}
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="categories">カテゴリー</label>
          <CategoriesSelect
            selectedCategories={categories}
            setSelectedCategories={(c: Category[]) => {
              setValue("categories", c);
            }}
            disabled={disabled}
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
        >
          {mode === "new" ? "作成" : "更新"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-2"
          >
            削除
          </button>
        )}
      </form>
    </>
  );
};

export default PostForm;
