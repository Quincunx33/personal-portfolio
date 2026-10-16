import React, { useEffect, useState } from "react";
import { Check, Copy, Send, X } from "lucide-react";
import { toast } from "sonner";

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [senderName, setSenderName] = useState("");
  const [replyContact, setReplyContact] = useState("");
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = "liquiderror600@gmail.com";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard", { description: email });
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = senderName.trim();
    const trimmedMessage = message.trim();
    const trimmedContact = replyContact.trim();

    if (!trimmedName) {
      toast.error("Please enter your name");
      return;
    }
    if (!trimmedMessage) {
      toast.error("Please enter your message");
      return;
    }

    setIsSubmitting(true);

    const formattedHtml =
      `⚡ <b>DIRECT TELEGRAM RELAY MESSAGE</b>\n\n` +
      `👤 <b>Sender Name:</b> <code>${escapeHtml(trimmedName)}</code>\n` +
      `💬 <b>Reply Contact:</b> <code>${escapeHtml(trimmedContact || "Not provided")}</code>\n` +
      `🕒 <b>Time:</b> ${new Date().toLocaleTimeString()} (GMT+6)\n` +
      `🌐 <b>Origin:</b> taissu.pages.dev\n\n` +
      `📝 <b>Message:</b>\n` +
      `${escapeHtml(trimmedMessage)}`;

    try {
      const response = await fetch("/api/telegram-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: formattedHtml,
          name: trimmedName,
          replyContact: trimmedContact,
          message: trimmedMessage,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok !== false) {
        toast.success("Signal beamed to Telegram!", {
          description: "Your message has been relayed directly to Tasfiya's Telegram bot.",
        });
        setSenderName("");
        setReplyContact("");
        setMessage("");
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const errorDetail = data?.error || data?.description || `HTTP ${response.status}`;
        throw new Error(errorDetail);
      }
    } catch (err: any) {
      console.error("[Telegram Relay Error]:", err);
      toast.error("Failed to beam message to Telegram", {
        description: err?.message || "Please copy the email address above to reach out directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#141412] border border-[#2e2d29] text-[#e8e1d5] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] font-mono my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2926] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d8894b] shrink-0 shadow-[0_0_8px_rgba(216,137,75,0.6)]" />
            <span className="text-xs uppercase tracking-widest text-[#f0eade] font-bold">
              SEND MSG
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#8e877c] hover:text-[#f0eade] hover:bg-[#22211e] transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Direct Mailbox Card */}
        <div className="bg-[#1b1a18] border border-[#2e2d29] p-4 mb-5 flex flex-col gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8e877c] block mb-1 font-medium">
              DIRECT MAILBOX
            </span>
            <span className="text-sm font-semibold text-[#f0eade] select-all block truncate font-mono">
              {email}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 text-xs font-semibold bg-[#d8894b] text-[#111110] hover:bg-[#e49b5d] active:scale-[0.98] transition-all"
          >
            {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedEmail ? "Copied Email" : "Copy Email"}</span>
          </button>
        </div>

        {/* Telegram Direct Relay Form */}
        <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
          {/* Sender Name Field (Required) */}
          <div>
            <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              YOUR NAME (REQUIRED)
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Tasfia"
              className="w-full px-3.5 py-2.5 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors text-xs font-mono"
            />
          </div>

          {/* Reply Contact Field */}
          <div>
            <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              REPLY CONTACT
            </label>
            <input
              type="text"
              value={replyContact}
              onChange={(e) => setReplyContact(e.target.value)}
              placeholder="e.g. @your_handle or email"
              className="w-full px-3.5 py-2.5 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors text-xs font-mono"
            />
          </div>

          {/* Message Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[#8e877c] uppercase tracking-wider text-[10px] font-medium">
                TYPE YOUR MESSAGE *
              </label>
              <span className="text-[10px] text-[#8e877c] font-mono">
                {message.length}/1000
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message......."
              className="w-full px-3.5 py-2.5 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors resize-none text-xs leading-relaxed font-mono"
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !senderName.trim() || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#d8894b] text-[#111110] font-bold text-xs uppercase tracking-wider hover:bg-[#e49b5d] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} className={isSubmitting ? "animate-pulse" : ""} />
              <span>{isSubmitting ? "Sending..." : "Send Msg"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
