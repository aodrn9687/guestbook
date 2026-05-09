import type { GuestbookEntry } from "../types/guestbook";
import "./GuestbookCard.css";

type GuestbookCardProps = {
  entry: GuestbookEntry;
};

export default function GuestbookCard({ entry }: GuestbookCardProps) {
  const timeLabel = new Date(entry.created_at).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="guestbook-card">
      <header className="guestbook-card__header">
        <h3 className="guestbook-card__name">{entry.name}</h3>
        <time
          className="guestbook-card__time"
          dateTime={new Date(entry.created_at).toISOString()}
        >
          {timeLabel}
        </time>
      </header>
      <p className="guestbook-card__message">{entry.message}</p>
    </article>
  );
}
