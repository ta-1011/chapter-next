import { Category } from "@/app/api/admin/posts/[id]/route";

// APIから返ってくるレスポンスの形（一覧ページ・詳細ページでデータを表示するとき用）
export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailImageKey: string;
  createdAt: Date;
  updatedAt: Date;
  postCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
};

export type PostShowResponse = {
  post: Post;
};

export type PostIndexResponse = {
  posts: Post[];
};

// PostFormが扱うフィールドの形だけを定義した形（フォーム用）
export type PostFormValues = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: Category[];
};
