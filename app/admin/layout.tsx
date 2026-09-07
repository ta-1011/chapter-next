// 管理者ページの共通レイアウトコンポーネント
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteGuard } from "./_hooks/useRouteGuard";

type Props = {
  children: ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  useRouteGuard();

  const pathname = usePathname();
  const isSelected = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="flex flex-col md:block">
      {/* サイドバー */}
      <aside className="bg-gray-100 w-full md:fixed md:w-70 md:left-0 md:bottom-0 md:top-23">
        <Link
          href="/admin/posts"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/admin/posts") && "bg-blue-100"
          }`}
        >
          記事一覧
        </Link>
        <Link
          href="/admin/categories"
          className={`p-4 block hover:bg-blue-100 ${
            isSelected("/admin/categories") && "bg-blue-100"
          }`}
        >
          カテゴリー一覧
        </Link>
      </aside>

      {/* メインコンテンツ */}
      <div className="p-4 md:ml-70">{children}</div>
    </div>
  );
};

export default AdminLayout;
