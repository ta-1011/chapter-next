"use client";

import { Category } from "@/app/api/admin/posts/[id]/route";
import React from "react";
import { CategoriesSelect } from "./CategoriesSelect";

export type Props = {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onDelete?: () => void; //新規ページでは削除は不要のため?は必要
  disabled: boolean;
};

const PostForm = ({
  mode,
  title,
  content,
  thumbnailImageKey,
  categories,
  setTitle,
  setContent,
  setThumbnailImageKey,
  setCategories,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
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
            id={title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
            disabled={disabled}
            type="text"
            id={thumbnailUrl}
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <div>
          <label htmlFor="categories">カテゴリー</label>
          <CategoriesSelect
            selectedCategories={categories}
            setSelectedCategories={setCategories}
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
