import React, { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendTelegramBotMessage,
  TelegramSendResult,
} from "@/lib/telegramService";

interface TelegramContactFormProps {
  onSuccess?: () => void;
  className?: string;
  showMailboxHeader?: boolean;
}

const TOPICS = [
  { id: "collab", label: "Collaboration", subject: "Collaboration Inquiry" },
  { id: "security", label: "Security & Tooling", subject: "Systems Security Inquiry" },
  { id: "role", label: "Engineering Role", subject: "Engineering Opportunity" },
  { id: "chat", label: "Quick Signal", subject: "Hello from a collaborator" },
];

export function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

export function TelegramContactForm({
  onSuccess,
  className = "",
  showMailboxHeader = true,
}: TelegramContactFormProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<TelegramSendResult | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const email = "liquiderror600@gmail.com";
  const telegramHandle = "Quincunx33";
  const telegramUrl = "https://t.me/Quincunx33";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      toast.success("Email copied to clipboard", { description: email });
      setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      toast.error("Failed to copy email");
    }
  };

  const handleSendToTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!message.trim()) {
      toast.error("Please enter a message before sending");
      return;
    }

    setIsSending(true);
    try {
      const result = await sendTelegramBotMessage({
        name,
        contact,
        topic: selectedTopic.label,
        message,
      });

      setSendResult(result);
      setIsSending(false);
      toast.success("Message dispatched to Telegram bot!", {
        description: "Tasfiya will receive your ping directly.",
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setIsSending(false);
      const msg = err?.message || "Failed to deliver message";
      setErrorMessage(msg);
      toast.error("Telegram bot dispatch error", {
        description: msg,
      });
    }
  };

  const handleReset = () => {
    setMessage("");
    setSendResult(null);
    setErrorMessage(null);
  };

  return (
    <div
      className={`bg-[#141412] border border-[#2a2926] text-[#e8e1d5] font-mono shadow-[0_12px_40px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Console Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#242320] bg-[#1a1917]/80">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d8894b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d8894b]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#f0eade]">
            Telegram Bot Dispatch
          </span>
          <span className="text-[9px] text-[#22c55e] border border-[#22c55e]/30 bg-[#22c55e]/10 px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-mono">
            Active Relay
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#8e877c] hover:text-[#d8894b] transition-colors"
            title="Open Telegram chat directly"
          >
            <TelegramIcon className="w-3.5 h-3.5 text-[#229ed9]" />
            <span>@{telegramHandle}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Direct Mailbox / Copy Email Strip (Kept always visible) */}
      {showMailboxHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-[#171614] border-b border-[#242320]">
          <div className="min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#8e877c] block">
              Direct Mailbox
            </span>
            <span className="text-xs font-semibold text-[#f0eade] select-all block truncate">
              {email}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border border-[#3a3935] bg-[#201f1c] hover:border-[#d8894b] hover:text-[#d8894b] text-[#f0eade] active:scale-95 transition-all"
              title="Copy email address"
              aria-label="Copy email address"
            >
              {emailCopied ? (
                <>
                  <Check size={13} className="text-[#22c55e]" />
                  <span className="text-[#22c55e]">Email Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy Email</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                selectedTopic.subject
              )}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold border border-[#3a3935] bg-[#201f1c] hover:border-[#d8894b] hover:text-[#d8894b] text-[#f0eade] active:scale-95 transition-all"
              title="Open default email application"
            >
              <Mail size={13} />
              <span>Mailto</span>
            </a>
          </div>
        </div>
      )}

      {/* Form Content / Success View */}
      <div className="p-4 sm:p-5">
        {sendResult ? (
          <div className="space-y-4 py-2">
            <div className="p-4 border border-[#22c55e]/40 bg-[#22c55e]/10 text-[#f0eade]">
              <div className="flex items-center gap-2 text-[#22c55e] mb-1.5">
                <Check size={18} />
                <span className="font-semibold text-xs tracking-wider uppercase">
                  Signal Transmitted to Telegram Bot
                </span>
              </div>
              <p className="text-xs text-[#c9c2b5] leading-relaxed">
                Your transmission has been forwarded directly to Tasfiya’s
                Telegram bot. Tasfiya will receive an instant notification on
                Telegram and follow up via your contact info.
              </p>
              <div className="mt-3 pt-3 border-t border-[#22c55e]/20 flex flex-wrap items-center justify-between text-[10px] text-[#8e877c] gap-2">
                <span>Receipt Time: {sendResult.timestamp}</span>
                <span className="font-mono text-[#22c55e]">
                  Status: Delivered {sendResult.devMode ? "(Dev Mode)" : "(Live)"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs border border-[#3a3935] hover:border-[#d8894b] text-[#f0eade] bg-[#1a1917] active:scale-95 transition-all"
              >
                <RefreshCw size={13} />
                <span>Send Another Message</span>
              </button>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs bg-[#d8894b] text-[#111110] font-semibold hover:bg-[#e49b5d] active:scale-95 transition-all"
              >
                {emailCopied ? <Check size={13} /> : <Copy size={13} />}
                <span>{emailCopied ? "Email Copied!" : "Copy Email"}</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendToTelegram} className="space-y-4">
            {/* Topic Selectors */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#8e877c] mb-2 font-medium">
                Inquiry Context
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {TOPICS.map((topic) => {
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <button
                      type="button"
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-2.5 py-2 text-left text-[11px] border transition-all flex items-center gap-2 truncate ${
                        isSelected
                          ? "border-[#d8894b] bg-[#d8894b]/15 text-[#f0eade] font-semibold"
                          : "border-[#262522] bg-[#171614] text-[#8e877c] hover:border-[#3d3b36] hover:text-[#d8894b]"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          isSelected ? "bg-[#d8894b]" : "bg-[#45423b]"
                        }`}
                      />
                      <span className="truncate">{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two-Column Inputs: Name & Reply Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e877c] mb-1 font-medium">
                  Your Name / Alias <span className="text-[#555046]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex / Systems Dev"
                  className="w-full px-3 py-2 bg-[#191816] border border-[#2b2a27] text-xs text-[#f0eade] placeholder-[#555046] outline-none focus:border-[#d8894b] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#8e877c] mb-1 font-medium">
                  Your Reply Contact <span className="text-[#555046]">(Email or @Telegram)</span>
                </label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="e.g. @username or email"
                  className="w-full px-3 py-2 bg-[#191816] border border-[#2b2a27] text-xs text-[#f0eade] placeholder-[#555046] outline-none focus:border-[#d8894b] transition-colors"
                />
              </div>
            </div>

            {/* Message Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] uppercase tracking-wider text-[#8e877c] font-medium">
                  Message for Telegram Bot <span className="text-[#d8894b]">*</span>
                </label>
                <span className="text-[10px] text-[#555046]">
                  {message.length}/1000
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={1000}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here to beam directly to Tasfiya's Telegram bot..."
                className="w-full px-3 py-2 bg-[#191816] border border-[#2b2a27] text-xs text-[#f0eade] placeholder-[#555046] outline-none focus:border-[#d8894b] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Error banner if server rejected or unconfigured */}
            {errorMessage && (
              <div className="p-3 border border-red-500/40 bg-red-500/10 text-xs text-red-300">
                <p className="mb-2">⚠️ {errorMessage}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-[#229ed9] text-white hover:bg-[#1f8ec4]"
                  >
                    <TelegramIcon className="w-3 h-3" />
                    <span>Open Telegram App (@{telegramHandle})</span>
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

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#242320]">
              <div className="flex items-center gap-2 text-[10px] text-[#8e877c]">
                <Clock size={12} className="text-[#d8894b] shrink-0" />
                <span>Bot alert received &lt; 5s · Tasfiya replies &lt; 24h</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#d8894b] text-[#111110] hover:bg-[#e49b5d] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                  aria-label="Send message to Telegram bot"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send to Telegram Bot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
