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
