import type { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { signInWithGoogle, signOut } from "../services/authService";
import "./AuthBar.css";

type AuthBarProps = {
  session: Session | null;
};

export default function AuthBar({ session }: AuthBarProps) {
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut();
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "로그아웃에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  const user = session?.user;
  const label =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email ??
    "로그인됨";

  return (
    <div className="auth-bar">
      {user ? (
        <>
          <span className="auth-bar__user" title={user.email ?? undefined}>
            {label}
          </span>
          <button
            type="button"
            className="auth-bar__btn auth-bar__btn--secondary"
            onClick={handleSignOut}
            disabled={busy}
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          type="button"
          className="auth-bar__btn auth-bar__btn--google"
          onClick={handleGoogle}
          disabled={busy}
        >
          {busy ? "연결 중…" : "Google로 로그인"}
        </button>
      )}
    </div>
  );
}
