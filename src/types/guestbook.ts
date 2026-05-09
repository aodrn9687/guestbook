export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

export interface GuestbookInsertPayload {
  name: string;
  message: string;
}
