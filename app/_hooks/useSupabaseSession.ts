import { supabase } from "../_libs/supabase";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export const useSupabaseSession = () => {
  // Session: ログインしている, null: ログインしていない,undefined: ロード中(getSession() の結果がまだ返ってきていない)
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetcher = async () => {
      //supabase.auth.getSession()で、現在ログイン中かどうかのチェック
      const result = await supabase.auth.getSession();
      const session = await result.data.session;
      setSession(session);
      setToken(session?.access_token || null); //未ログイン時 → 確実に null が渡る
    };

    fetcher();
  }, [pathname]);

  return { session, isLoading: session === undefined, token };
};
