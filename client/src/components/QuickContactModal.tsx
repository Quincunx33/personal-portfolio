import React, { useEffect, useState } from "react";
import { ArrowUpRight, Check, Clock, Copy, Mail, X } from "lucide-react";
import { toast } from "sonner";

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  {
    id: "collab",
    label: "Systems & Web Project Collaboration",
    subject: "Collaboration Inquiry — Systems & Web Architecture",
  },
  {
    id: "security",
    label: "Security & Systems Consulting",
    subject: "Systems & Security Tooling Inquiry",
  },
  {
    id: "role",
    label: "Engineering Role / Opportunity",
    subject: "Engineering Opportunity for Tasfiya Tabassum",
  },
  {
    id: "chat",
    label: "Coffee Chat / Tech Discussion",
    subject: "Hello from a fellow engineer / collaborator",
  },
];

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

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

  const handleSendMail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      selectedTopic.subject
    )}&body=${encodeURIComponent(
      `Hello Tasfiya,\n\n${
        message.trim() || "I came across your portfolio and would love to connect."
      }\n\nBest regards,\n${senderName.trim() || "A collaborator"}`
    )}`;
    window.location.href = mailtoUrl;
    toast.success("Opening mail client...");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-[#151513] border border-[#2e2d29] text-[#e8e1d5] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)] font-mono my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2926] mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#d8894b] shrink-0" />
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-xs uppercase tracking-widest text-[#f0eade] font-semibold">
                Transmit Signal
              </span>
              <span className="text-[10px] text-[#8e877c] uppercase tracking-wider font-normal">
                / Direct Connect
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

        {/* Direct Mailbox Card */}
        <div className="bg-[#1b1a18] border border-[#2e2d29] p-3.5 sm:p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-[#8e877c] block mb-1 font-medium">
              Direct Mailbox
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#f0eade] select-all block truncate">
              {email}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold bg-[#d8894b] text-[#111110] hover:bg-[#e49b5d] active:scale-[0.98] transition-all"
          >
            {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSendMail} className="space-y-4 text-xs">
          {/* Inquiry Context */}
          <div>
            <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-2 font-medium">
              Select Inquiry Context
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPICS.map((topic) => {
                const isSelected = selectedTopic.id === topic.id;
                return (
                  <button
                    type="button"
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-2.5 sm:p-3 text-left border text-[11px] leading-snug transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "border-[#d8894b] bg-[#d8894b]/10 text-[#f0eade] font-medium"
                        : "border-[#2a2926] bg-[#1a1917] text-[#a59e92] hover:border-[#3d3b36] hover:text-[#e8e1d5]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 transition-colors ${
                        isSelected ? "bg-[#d8894b]" : "bg-[#45423b]"
                      }`}
                    />
                    <span className="flex-1">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Your Name / Organization <span className="text-[#5a554c]">(Optional)</span>
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Alex / Engineering Team"
              className="w-full px-3.5 py-2.5 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors text-xs"
            />
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-[#8e877c] uppercase tracking-wider text-[10px] mb-1.5 font-medium">
              Brief Note <span className="text-[#5a554c]">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What problem or opportunity are you exploring?"
              className="w-full px-3.5 py-2.5 bg-[#1b1a18] border border-[#2e2d29] text-[#f0eade] placeholder-[#5a554c] outline-none focus:border-[#d8894b] transition-colors resize-none text-xs leading-relaxed"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-[#2a2926] gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-[#8e877c]">
              <Clock size={12} className="text-[#d8894b] shrink-0" />
              <span>Response time: &lt; 24h (GMT+6)</span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#d8894b] text-[#111110] font-bold hover:bg-[#e49b5d] active:scale-[0.98] transition-all text-xs"
            >
              <span>Compose</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
