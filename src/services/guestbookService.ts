import { supabase } from "../lib/supabase";
import type {
  GuestbookEntry,
  GuestbookInsertPayload,
} from "../types/guestbook";

export async function listGuestbookEntries(): Promise<GuestbookEntry[]> {
  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as GuestbookEntry[];
}

export async function insertGuestbookEntry(
  payload: GuestbookInsertPayload
): Promise<GuestbookEntry> {
  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name: payload.name, message: payload.message })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as GuestbookEntry;
}
