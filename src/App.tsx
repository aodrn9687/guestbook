import type { Session } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import AuthBar from "./components/AuthBar";
import GuestbookForm from "./components/GuestbookForm";
import GuestbookList from "./components/GuestbookList";
import { supabase } from "./lib/supabase";
import {
  insertGuestbookEntry,
  listGuestbookEntries,
} from "./services/guestbookService";
import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "./types/guestbook";
import "./App.css";

export default function App() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setAuthReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (!session) {
      setEntries([]);
      setEntriesLoading(false);
      return;
    }
    let cancelled = false;
    setEntriesLoading(true);
    listGuestbookEntries()
      .then((data) => {
        if (!cancelled) setEntries(data);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setEntriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authReady, session]);

  const handleAdd = useCallback(
    async (payload: GuestbookInsertPayload) => {
      const entry = await insertGuestbookEntry(payload);
      setEntries((prev) => [entry, ...prev]);
    },
    []
  );

  const suggestedName =
    (session?.user.user_metadata?.full_name as string | undefined) ??
    session?.user.email?.split("@")[0] ??
    "";

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">방명록</h1>
        <p className="app__subtitle">이름과 한마디를 남겨 주세요.</p>
        {authReady ? <AuthBar session={session} /> : null}
      </header>

      <main className="app__main">
        {session ? (
          <>
            <GuestbookForm
              key={session.user.id}
              onSubmit={handleAdd}
              suggestedName={suggestedName}
            />
            <GuestbookList entries={entries} loading={entriesLoading} />
          </>
        ) : authReady ? (
          <p className="app__login-hint" role="status">
            방명록을 보거나 글을 남기려면 Google로 로그인해 주세요.
          </p>
        ) : null}
      </main>
    </div>
  );
}
