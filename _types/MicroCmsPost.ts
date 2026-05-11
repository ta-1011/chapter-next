export type MicroCmsPost = {
  id: string;
  title: string;
  thumbnail: { url: string; height: number; width: number };
  createdAt: string;
  categories: { id: string; name: string }[];
  content: string;
};
