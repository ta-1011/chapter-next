// 管理者画面へのアクセス制限の実装（認可）
// 動作理解に重点を置くため、ベーシックなクライアントサイドで処理

import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    if (isLoading) return; // sessionの取得中は何もしない

    const fetcher = async () => {
      if (session === null) {
        router.replace("/sign_in");
      }
    };
    fetcher();
  }, [router, session, isLoading]);
};
