import { ISendMailResponse, sendMail } from "@/api";
import styles from "@/styles/components/contactForm.module.scss";
import { FormEvent, useState } from "react";
import { LoadingSpinner } from "./loadingSpinner";

export function ContactForm() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [honey, setHoney] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ISendMailResponse>();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!sender || !subject || !message) return;
    if (honey) return;

    setIsLoading(true);
    const res = await sendMail({
      sender,
      subject,
      message,
      properties: { honey },
    });
    setResult(res);
    setIsLoading(false);

    setSender("");
    setSubject("");
    setHoney("");
    setMessage("");
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label htmlFor="email">
        Email
        <input
          type="email"
          id="email"
          name="Email"
          placeholder="Email"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
      </label>

      <label htmlFor="subject">
        Subject
        <input
          type="text"
          id="subject"
          name="Subject"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <label className="hidden" aria-hidden="true" htmlFor="subject">
        Honey
        <input
          aria-hidden="true"
          type="text"
          id="honey"
          name="Honey"
          placeholder="Don't fill this field"
          value={subject}
          onChange={(e) => setHoney(e.target.value)}
        />
      </label>

      <label htmlFor="message">
        Message
        <textarea
          id="message"
          name="Message"
          placeholder="Message"
          rows={8}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <input
          type="submit"
          value="Send Message"
          disabled={!sender || !subject || !message}
        />
      )}
      {result?.message && result?.success && (
        <span className={styles.bannerSuccess}>{result.message}</span>
      )}
    </form>
  );
}
