import React from "react";
import Link from "next/link";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { supabase } from "../_libs/supabase";

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className="header-link">
        BLOG
      </Link>
      {/* ログイン状態のローディング中でなければ、以下を表示。 */}
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin">管理画面</Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className="header-link">
                お問い合わせ
              </Link>
              <Link href="/sign_in" className="header-link">
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
