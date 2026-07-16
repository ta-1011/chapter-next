"use client";
import React from "react";

export type Props = {
  mode: "new" | "edit";
  name: string;
  setName: (title: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onDelete?: () => void; // 新規ページに削除ボタンはいらないので、？が必要
  disabled: boolean;
};

export const CategoryForm = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  disabled,
}: Props) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="title">カテゴリー名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          />
        </div>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mode === "new" ? "作成" : "更新"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md  bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          >
            削除
          </button>
        )}
      </form>
    </>
  );
};
