import React, { useState } from "react";
import { ArrowUpRight, Check, Clock, Copy, Mail, MessageSquare, Send, X } from "lucide-react";
import { toast } from "sonner";

interface QuickContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  { id: "collab", label: "Full-Stack Project Collaboration", subject: "Collaboration Inquiry — Full-Stack Web Architecture" },
  { id: "security", label: "Security & Systems Consulting", subject: "Systems & Security Tooling Inquiry" },
  { id: "role", label: "Engineering Role / Opportunity", subject: "Engineering Opportunity for Tasfiya Tabassum" },
  { id: "chat", label: "Coffee Chat / Tech Discussion", subject: "Hello from a fellow engineer / collaborator" },
];

export function QuickContactModal({ isOpen, onClose }: QuickContactModalProps) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const email = "liquiderror600@gmail.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      toast.success("Email copied to clipboard", {
        description: email,
      });
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
      `Hello Tasfiya,\n\n${message || "I came across your portfolio and would love to connect."}\n\nBest regards,\n${senderName || "A collaborator"}`
    )}`;
    window.location.href = mailtoUrl;
    toast.success("Opening mail client...");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-xl bg-[#141413] border border-[#e8e1d5]/25 text-[#e8e1d5] p-6 sm:p-8 shadow-2xl shadow-black font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e8e1d5]/15 pb-4 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d8894b]">
            <Mail size={14} />
            <span>Transmit Signal / Direct Connect</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#a59e92] hover:text-[#d8894b] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Email Copy Card */}
        <div className="p-4 bg-[#191917] border border-[#e8e1d5]/15 flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8f887c] block">
              Direct Mailbox
            </span>
            <span className="text-sm font-bold text-[#e8e1d5] select-all">
              {email}
            </span>
          </div>
          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#d8894b] text-[#111110] font-bold hover:bg-[#e49b5d] transition-colors"
          >
            {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedEmail ? "Copied" : "Copy Email"}</span>
          </button>
        </div>

        {/* Quick Message Form */}
        <form onSubmit={handleSendMail} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#a59e92] uppercase tracking-wider text-[10px] mb-1.5">
              Select inquiry context
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOPICS.map((topic) => (
                <button
                  type="button"
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-2.5 text-left border transition-all text-[11px] leading-tight ${
                    selectedTopic.id === topic.id
                      ? "border-[#d8894b] bg-[#d8894b]/10 text-[#d8894b]"
                      : "border-[#e8e1d5]/15 text-[#a59e92] hover:border-[#e8e1d5]/30 hover:text-[#e8e1d5]"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#a59e92] uppercase tracking-wider text-[10px] mb-1.5">
              Your name / organization (optional)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Alex / Engineering Team"
              className="w-full px-3 py-2 bg-[#191917] border border-[#e8e1d5]/20 text-[#e8e1d5] placeholder-[#545048] outline-none focus:border-[#d8894b]"
            />
          </div>

          <div>
            <label className="block text-[#a59e92] uppercase tracking-wider text-[10px] mb-1.5">
              Brief note (optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What problem or opportunity are you exploring?"
              className="w-full px-3 py-2 bg-[#191917] border border-[#e8e1d5]/20 text-[#e8e1d5] placeholder-[#545048] outline-none focus:border-[#d8894b] resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-[10px] text-[#8f887c]">
              <Clock size={12} className="text-[#d8894b]" />
              <span>Response time: &lt; 24h (GMT+6)</span>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-[#d8894b] text-[#111110] font-bold hover:bg-[#e49b5d] transition-colors"
            >
              <span>Compose Email</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
