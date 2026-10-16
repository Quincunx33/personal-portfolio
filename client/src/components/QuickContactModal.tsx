import React, { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Loader2,
  RefreshCw,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendTelegramBotMessage,
  TelegramSendResult,
} from "@/lib/telegramService";

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [senderName, setSenderName] = useState("");
  const [replyContact, setReplyContact] = useState("");
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [telegramResult, setTelegramResult] = useState<TelegramSendResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const email = "liquiderror600@gmail.com";
  const telegramHandle = "Quincunx33";
  const telegramUrl = "https://t.me/Quincunx33";

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

  const handleSendTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!message.trim()) {
      toast.error("Please enter a message for the bot");
      return;
    }

    setIsSending(true);
    try {
      const result = await sendTelegramBotMessage({
        name: senderName,
        contact: replyContact,
        message,
      });

      setTelegramResult(result);
      setIsSending(false);
      toast.success("Message dispatched to Telegram bot!", {
        description: "Tasfiya will receive your ping directly.",
      });
    } catch (err: any) {
      setIsSending(false);
      const msg = err?.message || "Failed to deliver message to Telegram bot";
      setErrorMessage(msg);
      toast.error("Telegram bot error", { description: msg });
    }
  };

  const handleReset = () => {
    setMessage("");
    setTelegramResult(null);
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-[#151513] border border-[#2e2d29] text-[#e8e1d5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)] font-mono my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2926] mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d8894b] shrink-0" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs uppercase tracking-widest text-[#f0eade] font-semibold">
                Send Msg
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#8e877c] hover:text-[#f0eade] hover:bg-[#22211e] transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Direct Mailbox Strip */}
        <div className="bg-[#1b1a18] border border-[#2e2d29] p-3 sm:p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8e877c] block mb-0.5 font-medium">
              Direct Mailbox
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#f0eade] select-all block truncate">
              {email}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold bg-[#d8894b] text-[#111110] hover:bg-[#e49b5d] active:scale-[0.98] transition-all"
            >
              {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
            </button>

          </div>
        </div>

        {/* Telegram Bot Mode */}
        {telegramResult ? (
          <div className="space-y-4 py-2">
            <div className="p-4 border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#f0eade]">
              <div className="flex items-center gap-2 text-[#22c55e] mb-2">
                <Check size={18} />
                <span className="font-semibold text-xs tracking-wider uppercase">
                  Message Delivered to Telegram Bot
                </span>
              </div>
              <p className="text-xs text-[#c9c2b5] leading-relaxed">
                Your transmission was relayed to Tasfiya's Telegram bot in real
                time. Tasfiya will review your note and respond via your
                specified contact handle.
              </p>
              <div className="mt-3 pt-3 border-t border-[#22c55e]/20 flex flex-wrap items-center justify-between text-[10px] text-[#8e877c]">
                <span>Sent at: {telegramResult.timestamp}</span>
                <span className="text-[#22c55e]">Gateway: Verified</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs border border-[#3a3935] hover:border-[#d8894b] text-[#f0eade] bg-[#1a1917] active:scale-95 transition-all"
              >
                <RefreshCw size={13} />
                <span>Send Another Ping</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-[#d8894b] text-[#111110] font-bold active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendTelegram} className="space-y-3.5 text-xs">
            {/* Name & Contact Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1 font-medium">
                  YOUR NAME <span className="text-[#5a554c]">(Required)</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Tasfia"
                  className="w-full px-3 py-2 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors text-xs"
                />
              </div>
              <div>
                <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1 font-medium">
                  REPLY CONTACT <span className="text-[#5a554c]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={replyContact}
                  onChange={(e) => setReplyContact(e.target.value)}
                  placeholder="e.g. your email or @handle"
                  className="w-full px-3 py-2 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors text-xs"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#8e877c] uppercase tracking-wider text-[10px] font-medium">
                  TYPE YOUR MESSAGE <span className="text-[#d8894b]">*</span>
                </label>
                <span className="text-[10px] text-[#5a554c]">{message.length}/1000</span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-3 py-2 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors resize-none text-xs leading-relaxed"
              />
            </div>

            {/* Fallback error container */}
            {errorMessage && (
              <div className="p-3 border border-red-500/40 bg-red-500/10 text-xs text-red-300">
                <p className="mb-2">⚠️ {errorMessage}</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#229ed9] text-white hover:bg-[#1f8ec4]"
                  >
                    <TelegramIcon className="w-3 h-3" />
                    <span>Chat via Telegram App</span>
                    <ArrowUpRight size={12} />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] border border-red-400/50 hover:bg-white/10"
                  >
                    <Copy size={12} />
                    <span>Copy Email</span>
                  </button>
                </div>
              </div>
            )}

            {/* Footer Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#2a2926] gap-3">
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d8894b] text-[#111110] font-bold hover:bg-[#e49b5d] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-xs"
              >
                {isSending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
