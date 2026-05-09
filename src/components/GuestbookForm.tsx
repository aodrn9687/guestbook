import { useEffect, useState, type FormEvent } from "react";
import type { GuestbookInsertPayload } from "../types/guestbook";
import "./GuestbookForm.css";

type GuestbookFormProps = {
  onSubmit: (payload: GuestbookInsertPayload) => Promise<void>;
  suggestedName?: string;
};

export default function GuestbookForm({
  onSubmit,
  suggestedName = "",
}: GuestbookFormProps) {
  const [name, setName] = useState(() =>
    suggestedName.slice(0, 40)
  );

  useEffect(() => {
    setName(suggestedName.slice(0, 40));
  }, [suggestedName]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: trimmedName, message: trimmedMessage });
      setName("");
      setMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="guestbook-form" onSubmit={handleSubmit} noValidate>
      <div className="guestbook-form__field">
        <label className="guestbook-form__label" htmlFor="guestbook-name">
          이름
        </label>
        <input
          id="guestbook-name"
          className="guestbook-form__input"
          type="text"
          name="name"
          autoComplete="name"
          maxLength={40}
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <div className="guestbook-form__field">
        <label className="guestbook-form__label" htmlFor="guestbook-message">
          한마디
        </label>
        <textarea
          id="guestbook-message"
          className="guestbook-form__input guestbook-form__input--multiline"
          name="message"
          rows={3}
          maxLength={500}
          placeholder="남기고 싶은 말을 적어 주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={submitting}
        />
      </div>
      <button
        className="guestbook-form__submit"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "등록 중…" : "등록"}
      </button>
    </form>
  );
}
