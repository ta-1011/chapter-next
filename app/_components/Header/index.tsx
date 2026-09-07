"use client";

import React from "react";
import Link from "next/link";
import styles from "./style.module.css";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/_libs/supabase";

export const Header: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };

  const { session, isLoading } = useSupabaseSession();

  return (
    <header className="bg-gray-800 text-white p-6 font-bold flex justify-between items-center">
      <Link href="/" className={styles.header_link}>
        BLOG
      </Link>
      {/* ログイン状態のローディング中でなければ、以下を表示。 */}
      {!isLoading && (
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/admin/posts" className={styles.header_link}>
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className={styles.header_link}>
                お問い合わせ
              </Link>
              <Link href="/sign_in" className={styles.header_link}>
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
