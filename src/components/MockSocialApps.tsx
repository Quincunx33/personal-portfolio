import profilePic from "../assets/IMG_5197.jpeg";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Search, Heart, MessageCircle, Share2, PlusSquare, Home, Globe, 
  Lock, Send, Inbox, Star, Trash, Github, User, Settings, Code, 
  Facebook, MoreHorizontal, ThumbsUp, MessageSquare, Instagram, Zap, ChevronDown 
} from "lucide-react";

interface MockSocialAppsProps {
  isOpen: boolean;
  onClose: () => void;
  activeApp: "fb" | "ig" | "github" | null;
}

export default function MockSocialApps({ isOpen, onClose, activeApp }: MockSocialAppsProps) {
  if (!isOpen || !activeApp) return null;

  const renderApp = () => {
    switch (activeApp) {
      case "fb":
        return <FacebookMock />;
      case "ig":
        return <InstagramMock />;
      case "github":
        return <GithubMock />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-zinc-100 rounded-3xl overflow-hidden w-full max-w-[400px] h-[720px] shadow-2xl relative border-8 border-zinc-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Notch/Status Bar */}
          <div className="h-10 bg-zinc-800 flex items-center justify-between px-6 pt-2">
            <div className="text-[10px] text-white font-bold">14:46</div>
            <div className="w-16 h-4 bg-zinc-900 rounded-full"></div>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[#1877f2]"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <div className="w-3 h-3 rounded-full bg-white/20"></div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-12 right-4 z-50 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* App Content */}
          <div className="h-full overflow-y-auto pb-16 bg-white">
            {renderApp()}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==========================================
// FACEBOOK MOCK (FULLY DETAILED INTERACTIVE)
// ==========================================
interface FBPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: string[];
  hasLiked: boolean;
  type: "code" | "zap" | "globe" | "text";
}

function FacebookMock() {
  const [activeProfile, setActiveProfile] = useState<"main" | "secondary">("main");
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  
  const profiles = {
    main: { id: "main", name: "Tasfiya Tabassum (Main)", initials: "TT", img: {profilePic}, link: "https://www.facebook.com/taissuuu?" },
    secondary: { id: "secondary", name: "Tasfiya Tabassum (Dev)", initials: "TT", img: {profilePic}, link: "https://www.facebook.com/taaissu?" }
  };

  const current = profiles[activeProfile];

  // State managed posts
  const [posts, setPosts] = useState<FBPost[]>([
    {
      id: "fb-1",
      author: "Tasfiya Tabassum (Certified)",
      avatar: {profilePic},
      time: "1h",
      content: "Just updated my signature profile! 🚀 Exploring the limits of systematic absurdity in NID logic. What do you think?",
      likes: 120,
      comments: ["Looking absolutely awesome!", "Congrats on the certified dumb developer title! 👑"],
      hasLiked: false,
      type: "code"
    },
    {
      id: "fb-2",
      author: "Tasfiya Tabassum (Certified)",
      avatar: {profilePic},
      time: "3h",
      content: "Thinking about why CSS is called cascading. It really does cascade into absolute chaos sometimes... 🎨 #WebDev #DumbLogic",
      likes: 242,
      comments: ["Exactly! It's cascade of nightmares.", "Tailwind CSS saves lives, but is it dumb? Yes absolutely."],
      hasLiked: false,
      type: "zap"
    },
    {
      id: "fb-3",
      author: "Tasfiya Tabassum (Certified)",
      avatar: {profilePic},
      time: "5h",
      content: "Coffee + Code = Productive Chaos. ☕️💻 Still debugging that off-by-one error on the security barcode.",
      likes: 365,
      comments: ["Off-by-one is the master bug of all developers!", "More coffee is the only logical answer."],
      hasLiked: false,
      type: "globe"
    }
  ]);

  // States for interactive features
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostType, setNewPostType] = useState<"code" | "zap" | "globe" | "text">("text");

  const [expandedCommentsPost, setExpandedCommentsPost] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  const [activeStory, setActiveStory] = useState<{ name: string; contentColor: string; img?: string } | null>(null);

  // Auto-close story after 4 seconds
  useEffect(() => {
    if (activeStory) {
      const timer = setTimeout(() => {
        setActiveStory(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeStory]);

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !p.hasLiked,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleAddPost = () => {
    if (!newPostText.trim()) return;
    const newPost: FBPost = {
      id: `fb-user-${Date.now()}`,
      author: current.name,
      avatar: current.img,
      time: "Just now",
      content: newPostText,
      likes: 0,
      comments: [],
      hasLiked: false,
      type: newPostType
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
    setIsCreatingPost(false);
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, commentInput]
        };
      }
      return p;
    }));
    setCommentInput("");
  };

  return (
    <div className="flex flex-col h-full font-sans bg-[#f0f2f5] relative">
      {/* FB Header */}
      <div className="bg-[#1877f2] p-4 flex justify-between items-center text-white sticky top-0 z-30 shadow-md">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tighter leading-none">facebook</h1>
          <button 
            onClick={() => setShowAccountSwitcher(true)}
            className="text-[9px] uppercase tracking-wider font-extrabold bg-white/10 px-2.5 py-1 rounded-full mt-1.5 flex items-center gap-1 hover:bg-white/20 transition-all active:scale-95 w-fit border border-white/5"
          >
            <User size={10} /> Profile: {activeProfile === "main" ? "Main" : "Dev"} <ChevronDown size={10} />
          </button>
        </div>
        <div className="flex gap-2">
          <a href={current.link} target="_blank" rel="noopener noreferrer" className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-white/30 transition-colors">
            <Globe size={12} /> Open Real
          </a>
        </div>
      </div>

      {/* Account Switcher Modal */}
      <AnimatePresence>
        {showAccountSwitcher && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowAccountSwitcher(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-3xl p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6"></div>
              <h3 className="text-lg font-black text-slate-900 mb-6 px-2">Choose Account</h3>
              <div className="space-y-3">
                {Object.values(profiles).map((p) => (
                  <button 
                    key={p.id}
                    onClick={() => { setActiveProfile(p.id as any); setShowAccountSwitcher(false); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${activeProfile === p.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center">
                        <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                      </div>
                      <div className="text-left">
                        <p className={`font-bold text-sm ${activeProfile === p.id ? 'text-blue-900' : 'text-slate-900'}`}>{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Logged in via Dumb Card</p>
                      </div>
                    </div>
                    {activeProfile === p.id && <div className="bg-blue-500 text-white p-1 rounded-full"><PlusSquare size={14} className="rotate-45" /></div>}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowAccountSwitcher(false)}
                className="w-full mt-6 py-4 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 space-y-4">
        {/* Create Post Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0">
              <img src={current.img} className="w-full h-full object-cover" alt={current.name} />
            </div>
            <div 
              onClick={() => setIsCreatingPost(true)}
              className="bg-[#f0f2f5] rounded-full flex-1 px-4 py-2 text-xs text-slate-400 font-medium cursor-pointer hover:bg-slate-200/70 transition-colors"
            >
              What's on your mind, {current.name.split(' ')[0]}?
            </div>
          </div>
        </div>

        {/* Story Viewer Playback Overlay */}
        <AnimatePresence>
          {activeStory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between p-6 text-white"
              onClick={() => setActiveStory(null)}
            >
              {/* Header Status Bar inside Story */}
              <div className="w-full flex flex-col gap-2">
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4, ease: "linear" }}
                    className="h-full bg-blue-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden border">
                      <img src={profilePic} className="w-full h-full object-cover" alt="Story owner" />
                    </div>
                    <span className="text-xs font-bold">{activeStory.name}</span>
                  </div>
                  <X size={18} className="cursor-pointer" />
                </div>
              </div>

              {/* Story Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {activeStory.img ? (
                  <div className="w-full max-h-[400px] rounded-2xl overflow-hidden shadow-2xl relative">
                    <img src={activeStory.img} className="w-full h-full object-cover" alt="Story visual" />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                ) : (
                  <div className={`w-full h-[320px] rounded-2xl ${activeStory.contentColor} flex items-center justify-center p-6 text-center shadow-2xl font-black italic`}>
                    "Coding with absolute systematic absurdity because normal layouts are boring. ✨"
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest pb-4">
                Click anywhere to dismiss
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stories Horizontal Tray */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide mb-3">Stories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {/* Create Story card */}
            <div 
              onClick={() => setActiveStory({ name: "Your Story", contentColor: "bg-indigo-600", img: {profilePic} })}
              className="w-24 h-40 bg-zinc-400 rounded-xl relative flex-shrink-0 overflow-hidden shadow-sm group cursor-pointer"
            >
              <img src={profilePic} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Self avatar" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <PlusSquare size={18} className="absolute top-2 left-2 text-blue-500 bg-white rounded-full p-0.5" />
              <span className="absolute bottom-2 left-2 text-white text-[9px] font-bold">Your Story</span>
            </div>
            
            <div 
              onClick={() => setActiveStory({ name: "Absurdity Engine", contentColor: "bg-gradient-to-tr from-rose-500 to-indigo-600" })}
              className="w-24 h-40 bg-indigo-600 rounded-xl relative flex-shrink-0 overflow-hidden shadow-sm cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 to-indigo-600/30 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden bg-white">
                <div className="w-full h-full bg-slate-400 flex items-center justify-center text-[10px] font-black">7</div>
              </div>
              <span className="absolute bottom-2 left-2 text-white text-[9px] font-bold leading-none">Sector 7</span>
            </div>

            <div 
              onClick={() => setActiveStory({ name: "Certified Dumb", contentColor: "bg-gradient-to-r from-teal-500 to-emerald-600" })}
              className="w-24 h-40 bg-emerald-600 rounded-xl relative flex-shrink-0 overflow-hidden shadow-sm cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-600/20 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-emerald-400 overflow-hidden bg-white">
                <div className="w-full h-full bg-slate-400 flex items-center justify-center text-[10px] font-black">OK</div>
              </div>
              <span className="absolute bottom-2 left-2 text-white text-[9px] font-bold leading-none">Dumb Rules</span>
            </div>
          </div>
        </div>

        {/* Create Post Dialog Box Sheet */}
        <AnimatePresence>
          {isCreatingPost && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsCreatingPost(false)}
            >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white w-full rounded-2xl p-5 shadow-2xl relative border border-slate-200"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-extrabold text-[#1c1e21] text-md border-b pb-3 mb-4">Create Post</h3>
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={`What's on your mind, ${current.name.split(' ')[0]}?`}
                  className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs text-slate-800 resize-none mb-3 font-medium placeholder-slate-400"
                />
                
                <div className="flex gap-2 mb-4 items-center">
                  <span className="text-[10px] uppercase text-slate-400 font-extrabold">Theme:</span>
                  {(["text", "code", "zap", "globe"] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNewPostType(type)}
                      className={`text-[9px] uppercase px-2 py-1 rounded-full font-bold border transition-colors ${newPostType === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsCreatingPost(false)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-all uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddPost}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    Post Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Facebook News Feed Area */}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all">
            {/* Header info */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-emerald-50 shrink-0">
                  <img src={post.avatar} className="w-full h-full object-cover" alt={post.author} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-xs text-slate-900 leading-tight">{post.author}</p>
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <PlusSquare size={6} className="text-white rotate-45" />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">{post.time} • <Globe size={9} /></p>
                </div>
              </div>
              <button className="p-1.5 hover:bg-slate-100 rounded-full"><MoreHorizontal size={14} className="text-slate-400" /></button>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-xs leading-relaxed text-slate-800 font-medium">{post.content}</p>
            </div>

            {/* Interactive Visual Canvas Box */}
            <div className={`h-40 flex items-center justify-center relative overflow-hidden ${post.type === 'code' ? 'bg-indigo-50' : post.type === 'zap' ? 'bg-rose-50' : post.type === 'globe' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-current"></div>
              <div className="relative z-10 flex flex-col items-center">
                {post.type === 'code' && <Code size={48} className="text-indigo-400 drop-shadow-md animate-pulse" />}
                {post.type === 'zap' && <Zap size={48} className="text-rose-400 drop-shadow-md animate-bounce" />}
                {post.type === 'globe' && <Globe size={48} className="text-emerald-400 drop-shadow-md" />}
                {post.type === 'text' && <MessageCircle size={48} className="text-slate-400 drop-shadow-md" />}
                <span className="font-mono text-[7px] tracking-[0.2em] text-slate-500 mt-2 uppercase">ATTESTED DATA POINT</span>
              </div>
            </div>

            {/* Post Status counters */}
            <div className="p-2 px-4 border-t flex justify-between items-center text-slate-500 text-[10px] bg-slate-50/50">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                   <div className="bg-blue-500 rounded-full p-0.5 border border-white"><ThumbsUp size={8} className="text-white" /></div>
                   <div className="bg-red-500 rounded-full p-0.5 border border-white"><Heart size={8} className="text-white" /></div>
                </div>
                <span className="font-bold">{post.likes} people reacted</span>
              </div>
              <button 
                onClick={() => setExpandedCommentsPost(expandedCommentsPost === post.id ? null : post.id)}
                className="hover:underline font-bold"
              >
                {post.comments.length} comments
              </button>
            </div>

            {/* Action buttons (Like, Comment) */}
            <div className="p-1 border-t flex justify-around bg-white">
              <motion.button 
                whileTap={{ scale: 0.95 }} 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1 text-[11px] font-bold flex-1 justify-center py-2 rounded-lg transition-colors ${post.hasLiked ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <ThumbsUp size={14} /> Like
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setExpandedCommentsPost(expandedCommentsPost === post.id ? null : post.id)}
                className="flex items-center gap-1 text-slate-600 text-[11px] font-bold hover:bg-slate-50 flex-1 justify-center py-2 rounded-lg transition-colors"
              >
                <MessageSquare size={14} /> Comment
              </motion.button>
            </div>

            {/* Real-time Comments section expansion */}
            <AnimatePresence>
              {expandedCommentsPost === post.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t bg-slate-50/50 p-3 overflow-hidden text-xs"
                >
                  <div className="space-y-2 mb-3">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="flex gap-2 items-start bg-white p-2 rounded-xl border border-slate-100 shadow-2xs">
                        <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden shrink-0 font-bold text-[8px] flex items-center justify-center">
                          U
                        </div>
                        <div>
                          <p className="font-bold text-[10px] text-slate-800 leading-none mb-1">Anonymous Tester</p>
                          <p className="text-slate-700 leading-normal">{comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs outline-none focus:border-blue-500 font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                    />
                    <button 
                      onClick={() => handleAddComment(post.id)}
                      className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center justify-center"
                    >
                      <Send size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// INSTAGRAM MOCK (FULLY DETAILED INTERACTIVE)
// ==========================================
interface IGPost {
  id: string;
  username: string;
  location: string;
  likes: number;
  caption: string;
  hasLiked: boolean;
  comments: string[];
  colorTheme: string;
  phaseId: string;
  imgUrl?: string;
}

function InstagramMock() {
  const [view, setView] = useState<"feed" | "profile">("feed");
  
  // Custom states for IG
  const [selectedPhotoPost, setSelectedPhotoPost] = useState<IGPost | null>(null);
  const [activeStory, setActiveStory] = useState<{ username: string; color: string; duration: number } | null>(null);
  
  const [posts, setPosts] = useState<IGPost[]>([
    {
      id: "ig-1",
      username: "taissuuu",
      location: "Dumbland Capital",
      likes: 1243,
      caption: "Golden hour in the terminal. Best place to be. ☕️⌨️ Exploring the nuances of systematic design.",
      hasLiked: false,
      comments: ["Indeed a masterpiece code. ✨", "Absolute aesthetic setup!"],
      colorTheme: "from-emerald-600 via-teal-800 to-emerald-950",
      phaseId: "PHASE_01.IDX"
    },
    {
      id: "ig-2",
      username: "taissuuu",
      location: "Stanford Lab",
      likes: 1512,
      caption: "Pixels over people. Just kidding... mostly. 🎨 Building biometric interfaces that bend.",
      hasLiked: false,
      comments: ["Hahaha true as a developer!", "The GlowHand card is magical."],
      colorTheme: "from-indigo-800 via-purple-900 to-slate-950",
      phaseId: "PHASE_02.IDX"
    },
    {
      id: "ig-3",
      username: "taissuuu",
      location: "Workspace Delta",
      likes: 984,
      caption: "Minimalism is a journey, not a destination. Less is truly more in the sector of chaos.",
      hasLiked: false,
      comments: ["Clean and gorgeous design hierarchy.", "Can we get an export tool?"],
      colorTheme: "from-amber-600 via-rose-800 to-zinc-950",
      phaseId: "PHASE_03.IDX"
    }
  ]);

  const [likeHeartPop, setLikeHeartPop] = useState<string | null>(null);

  const [igCommentInput, setIgCommentInput] = useState("");
  const [expandedCommentsPost, setExpandedCommentsPost] = useState<string | null>(null);

  const [followCount, setFollowCount] = useState(1242);
  const [isFollowing, setIsFollowing] = useState(false);

  // Story timeout auto-play
  useEffect(() => {
    if (activeStory) {
      const timer = setTimeout(() => {
        setActiveStory(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [activeStory]);

  const handleHeartClick = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !p.hasLiked,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const triggerDoubleTapLike = (postId: string) => {
    setLikeHeartPop(postId);
    setPosts(prev => prev.map(p => {
      if (p.id === postId && !p.hasLiked) {
        return {
          ...p,
          hasLiked: true,
          likes: p.likes + 1
        };
      }
      return p;
    }));
    setTimeout(() => setLikeHeartPop(null), 850);
  };

  const handleAddIGComment = (postId: string) => {
    if (!igCommentInput.trim()) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, igCommentInput]
        };
      }
      return p;
    }));
    setIgCommentInput("");
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowCount(f => f - 1);
    } else {
      setFollowCount(f => f + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const stories = [
    { username: "pixel_perfect", color: "bg-amber-500" },
    { username: "dev_logs", color: "bg-emerald-500" },
    { username: "tech_trends", color: "bg-purple-600" },
    { username: "ui_vault", color: "bg-rose-500" }
  ];

  return (
    <div className="flex flex-col h-full font-sans bg-white relative">
      {/* IG Header */}
      <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-30">
        <h1 className="text-2xl font-black italic tracking-tighter text-slate-900" style={{ fontFamily: 'serif' }}>Instagram</h1>
        <div className="flex gap-4 items-center">
          <a href="https://www.instagram.com/taissuuu" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md hover:opacity-90 transition-all shadow-md active:scale-95">
            Open Real
          </a>
        </div>
      </div>

      {activeStory && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-[#0c0d14] flex flex-col justify-between p-6 text-white"
          onClick={() => setActiveStory(null)}
        >
          <div className="w-full flex flex-col gap-2">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="h-full bg-gradient-to-r from-pink-500 to-yellow-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono">@{activeStory.username}</span>
              <X size={18} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`w-32 h-32 rounded-full ${activeStory.color} animate-pulse flex items-center justify-center blur-2xs`}></div>
            <div className="absolute font-black text-center max-w-[250px] italic leading-relaxed text-sm">
              "Continuous commits make the code perfect! 🚀 Loving this custom biometric AI card integration."
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-500 tracking-wider">CLICK TO DISMISS</div>
        </motion.div>
      )}

      {/* PHOTO GRID PROFILE VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedPhotoPost && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedPhotoPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl overflow-hidden w-full max-w-[340px] shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-3 border-b flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
                  {selectedPhotoPost.phaseId}
                </span>
                <button onClick={() => setSelectedPhotoPost(null)}><X size={16} /></button>
              </div>
              <div className={`h-64 flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${selectedPhotoPost.colorTheme}`}>
                <Instagram size={48} className="text-white/25" />
              </div>
              <div className="p-4 text-xs">
                <p className="font-bold mb-1">{selectedPhotoPost.likes} likes</p>
                <p className="text-slate-800 leading-relaxed italic">"{selectedPhotoPost.caption}"</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto">
        {view === "feed" ? (
          <>
            {/* Horizontal Story bubbles */}
            <div className="flex p-4 gap-4 overflow-x-auto border-b scrollbar-hide bg-slate-50/30">
              <div 
                onClick={() => setActiveStory({ username: "taissuuu", color: "bg-slate-400", duration: 4000 })}
                className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full p-[2px] border-2 border-dashed border-pink-500 relative">
                  <div className="w-full h-full rounded-full bg-slate-200 overflow-hidden">
                     <img src={profilePic} className="w-full h-full object-cover" alt="story owner" />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border border-white p-0.5">
                    <PlusSquare size={10} className="text-white" />
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 font-bold">Your story</span>
              </div>
              
              {stories.map((s, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveStory({ username: s.username, color: s.color, duration: 4000 })}
                  className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className={`w-full h-full rounded-full ${s.color} flex items-center justify-center text-white overflow-hidden shadow-inner font-extrabold text-[10px]`}>
                        {s.username[0].toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] truncate w-14 text-center text-slate-600 font-medium">{s.username}</span>
                </div>
              ))}
            </div>

            {/* Instagram Posts list */}
            {posts.map((post) => (
              <div key={post.id} className="mb-4 bg-white border-b pb-4">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden border p-0.5 border-pink-400/30">
                       <img src={profilePic} className="w-full h-full rounded-full object-cover" alt="author avatar" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[12px] text-slate-900 leading-none">{post.username}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 font-medium">{post.location}</span>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-slate-50 rounded-full"><MoreHorizontal size={16} className="text-slate-400" /></button>
                </div>

                {/* Main post grid image with support for Double-Tap-To-Like */}
                <div 
                  onDoubleClick={() => triggerDoubleTapLike(post.id)}
                  className="aspect-square bg-slate-950 flex items-center justify-center relative overflow-hidden group cursor-pointer border-y border-slate-100"
                >
                  <div className={`absolute inset-0 opacity-85 transition-transform duration-[12s] group-hover:scale-110 bg-gradient-to-tr ${post.colorTheme}`}></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-15"></div>
                  
                  {/* Floating heart pop-up on double tap */}
                  <AnimatePresence>
                    {likeHeartPop === post.id && (
                      <motion.div 
                        initial={{ scale: 0.2, opacity: 0 }}
                        animate={{ scale: [1, 1.4, 0.9], opacity: [0, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute z-30"
                      >
                        <Heart size={82} className="text-white fill-white drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 text-white flex flex-col items-center gap-4">
                     <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl">
                       <Instagram size={36} className="text-white/60" />
                     </div>
                     <div className="text-center select-none">
                       <p className="font-mono text-[8px] tracking-[0.3em] uppercase opacity-55 mb-1">Government Authorized Metadata</p>
                       <p className="font-black text-xl tracking-tighter text-indigo-100">{post.phaseId}</p>
                     </div>
                  </div>
                </div>

                {/* Post reactions area */}
                <div className="p-3 bg-white">
                   <div className="flex justify-between mb-3 px-1">
                     <div className="flex gap-4">
                       <button onClick={() => handleHeartClick(post.id)}>
                         <Heart 
                           size={22} 
                           className={`transition-colors hover:scale-115 active:scale-90 ${post.hasLiked ? 'text-red-500 fill-red-500' : 'text-slate-800'}`} 
                         />
                       </button>
                       <button onClick={() => setExpandedCommentsPost(expandedCommentsPost === post.id ? null : post.id)}>
                         <MessageCircle size={22} className="text-slate-800 hover:opacity-60" />
                       </button>
                     </div>
                     <span className="text-[10px] uppercase text-emerald-600 font-extrabold tracking-wide bg-emerald-50 px-2 py-0.5 rounded-full">attested</span>
                   </div>

                   <div className="px-1 text-slate-900 text-xs text-left">
                     <p className="font-black mb-1.5 flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center border"><User size={8} /></span>
                        Liked by <b>tester_dev</b> and <b>{post.likes}</b> others
                     </p>
                     <p className="text-slate-800 leading-relaxed font-semibold">
                       <span className="font-black mr-2 text-slate-950">@{post.username}</span> 
                       {post.caption}
                     </p>

                     {post.comments.length > 0 && (
                       <button 
                         onClick={() => setExpandedCommentsPost(expandedCommentsPost === post.id ? null : post.id)}
                         className="text-[11px] text-slate-400 mt-2 font-bold hover:text-slate-600"
                       >
                         View all {post.comments.length} comments
                       </button>
                     )}
                     <p className="text-[8px] text-slate-300 mt-2 uppercase font-black tracking-widest">3 HOURS AGO</p>
                   </div>
                </div>

                {/* Expand comments container */}
                <AnimatePresence>
                  {expandedCommentsPost === post.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 border-t bg-slate-50/50"
                    >
                      <div className="space-y-1.5 mb-3 text-[11px]">
                        {post.comments.map((comment, index) => (
                          <p key={index} className="text-slate-700">
                            <span className="font-bold text-slate-900 mr-2">anon_user_{index}</span>
                            {comment}
                          </p>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={igCommentInput}
                          onChange={(e) => setIgCommentInput(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs outline-none focus:border-pink-500 font-medium"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddIGComment(post.id);
                          }}
                        />
                        <button 
                          onClick={() => handleAddIGComment(post.id)}
                          className="p-1 px-3 bg-pink-500 text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-pink-600"
                        >
                          Send
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </>
        ) : (
          /* Profile view */
          <div className="p-0 bg-white">
            <div className="p-6 text-left">
               <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shrink-0">
                     <div className="w-full h-full rounded-full bg-white p-1">
                       <img src={profilePic} className="w-full h-full rounded-full object-cover" alt="Profile" />
                     </div>
                  </div>
                  <div className="flex-1">
                     <h2 className="text-lg font-black tracking-tight mb-3">taissuuu</h2>
                     <div className="flex gap-4 text-center">
                        <div><p className="font-black text-xs">42</p><p className="text-[8px] text-slate-400 font-bold uppercase">Posts</p></div>
                        <div><p className="font-black text-xs">{followCount}</p><p className="text-[8px] text-slate-400 font-bold uppercase">Followers</p></div>
                        <div><p className="font-black text-xs">824</p><p className="text-[8px] text-slate-400 font-bold uppercase">Following</p></div>
                     </div>
                  </div>
               </div>
               
               <div className="mb-6">
                  <p className="font-black text-xs text-slate-900 mb-1">Tasfiya Tabassum</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                     Certified Dumb Developer.<br/>
                     Turning coffee into brilliant chaos & structural layouts organically. ❤️<br/>
                     <span className="text-blue-900 font-extrabold hover:underline">ais.studio/build</span>
                  </p>
                  
                  <button 
                    onClick={handleFollowToggle}
                    className={`w-full mt-4 py-2 border rounded-md text-xs font-bold transition-all uppercase tracking-wider ${isFollowing ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-pink-500 border-pink-500 text-white shadow-md hover:bg-pink-600'}`}
                  >
                    {isFollowing ? "Following" : "Follow Profile"}
                  </button>
               </div>
               
               {/* Grid tab selector */}
               <div className="flex border-t">
                  <button className="flex-1 py-3 flex justify-center border-t-2 border-slate-900"><PlusSquare size={18} /></button>
               </div>
               
               {/* Image posts representation grid */}
               <div className="grid grid-cols-3 gap-1 mt-2">
                  {posts.map((post, i) => (
                    <div 
                      key={post.id} 
                      onClick={() => setSelectedPhotoPost(post)}
                      className={`aspect-square relative group overflow-hidden cursor-pointer bg-gradient-to-br ${post.colorTheme}`}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                         <div className="flex items-center gap-1 text-white text-[10px] font-black">
                            <Heart size={10} fill="currentColor" /> {post.likes}
                         </div>
                      </div>
                      <div className="absolute inset-2 border border-white/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-white/15 text-[8px] tracking-widest uppercase">
                         VIEW
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav Tab bar toggle */}
      <div className="sticky bottom-0 w-full bg-white/95 backdrop-blur-md border-t px-8 py-3 flex justify-between items-center z-40">
        <button onClick={() => setView("feed")}><Home size={22} className={view === "feed" ? "text-slate-900 fill-slate-900" : "text-slate-400"} /></button>
        <button onClick={() => setView("profile")}><User size={22} className={view === "profile" ? "text-slate-900 fill-slate-900" : "text-slate-400"} /></button>
      </div>
    </div>
  );
}

// ==========================================
// GITHUB MOCK (FULLY DETAILED INTERACTIVE)
// ==========================================
interface GHRepo {
  name: string;
  desc: string;
  lang: string;
  starsNum: number;
  fork: number;
  color: string;
  isStarred: boolean;
  isPublic: boolean;
}

function GithubMock() {
  const [activeTab, setActiveTab] = useState<"overview" | "repositories" | "activity">("overview");
  
  // State managed Repositories
  const [repos, setRepos] = useState<GHRepo[]>([
    { name: "dumb-card-app", desc: "The official National Identity Card platform for the People's Republic of Dumbland.", lang: "TypeScript", starsNum: 1242, fork: 142, color: "bg-sky-500", isStarred: false, isPublic: true },
    { name: "chaos-logic-engine", desc: "A robust framework for implementing systematic absurdity in mission-critical HTML.", lang: "Rust", starsNum: 892, fork: 56, color: "bg-orange-500", isStarred: false, isPublic: true },
    { name: "tasfiya-portfolio", desc: "My professional portfolio hub site, built with React, Vite, and absolute design precision.", lang: "TypeScript", starsNum: 2514, fork: 342, color: "bg-sky-500", isStarred: false, isPublic: true },
    { name: "legacy-bugs-repo", desc: "A curated collection of beautiful bugs that refuse to be fixed despite multiple layout refreshes.", lang: "C++", starsNum: 45, fork: 2, color: "bg-rose-500", isStarred: false, isPublic: true }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateRepo, setShowCreateRepo] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDesc, setNewRepoDesc] = useState("");
  const [newRepoLang, setNewRepoLang] = useState("TypeScript");

  // Heatmap hover details
  const [hoveredCell, setHoveredCell] = useState<{ contributions: number; day: string } | null>(null);

  const [repoLanguageStats, setRepoLanguageStats] = useState({
    TypeScript: 2,
    Rust: 1,
    'C++': 1
  });

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(8200);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setFollowersCount(c => c - 1);
    } else {
      setFollowersCount(c => c + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const handleStarToggle = (repoName: string) => {
    setRepos(prev => prev.map(r => {
      if (r.name === repoName) {
        return {
          ...r,
          isStarred: !r.isStarred,
          starsNum: r.isStarred ? r.starsNum - 1 : r.starsNum + 1
        };
      }
      return r;
    }));
  };

  const handleCreateRepository = () => {
    if (!newRepoName.trim()) return;
    
    const colors: Record<string, string> = {
      TypeScript: "bg-sky-500",
      Rust: "bg-orange-500",
      'C++': "bg-rose-500",
      JavaScript: "bg-yellow-400",
      Python: "bg-blue-400"
    };

    const newRepo: GHRepo = {
      name: newRepoName.toLowerCase().replace(/\s+/g, '-'),
      desc: newRepoDesc.trim() || "No description provided.",
      lang: newRepoLang,
      starsNum: 0,
      fork: 0,
      color: colors[newRepoLang] || "bg-slate-400",
      isStarred: false,
      isPublic: true
    };

    setRepos([...repos, newRepo]);
    
    // reset form fields
    setNewRepoName("");
    setNewRepoDesc("");
    setNewRepoLang("TypeScript");
    setShowCreateRepo(false);
  };

  const filteredRepos = repos.filter(repo => 
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    repo.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full font-sans bg-[#0d1117] text-[#c9d1d9] selection:bg-blue-500/30 text-left relative">
      {/* GH Header */}
      <div className="p-3 flex items-center justify-between bg-[#161b22] border-b border-[#30363d] sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <Github size={28} className="text-white" />
          <div className="bg-[#0d1117] rounded-md px-3 py-1.5 flex items-center gap-2 border border-[#30363d] w-[140px] md:w-[160px]">
            <Search size={12} className="text-[#8b949e]" />
            <input 
              type="text" 
              placeholder="Filter repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] w-full text-white placeholder-[#8b949e] font-mono" 
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
           <a href="https://github.com/Quincunx33" target="_blank" rel="noopener noreferrer" className="bg-[#238636] text-white px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest hover:bg-[#2ea043] transition-colors shadow-lg active:scale-95 leading-none">
             Open Real
           </a>
        </div>
      </div>

      {showCreateRepo && (
        <div className="absolute inset-0 z-30 bg-[#0d1117]/95 flex items-center justify-center p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 w-full max-w-[320px] text-xs">
            <h3 className="font-extrabold text-white text-md border-b border-[#30363d] pb-3 mb-4 flex justify-between items-center">
              <span>Create Repository</span>
              <button onClick={() => setShowCreateRepo(false)}><X size={16} /></button>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[#8b949e] mb-1 font-mono text-[9px] uppercase">Repository Name</label>
                <input 
                  type="text" 
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="e.g. bio-hacker-logic"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[#8b949e] mb-1 font-mono text-[9px] uppercase">Description</label>
                <textarea 
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  placeholder="A short description of your project"
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white outline-none focus:border-emerald-500 h-16 resize-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[#8b949e] mb-1 font-mono text-[9px] uppercase">Primary Language</label>
                <select 
                  value={newRepoLang}
                  onChange={(e) => setNewRepoLang(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-white outline-none focus:border-emerald-500 font-bold"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="Rust">Rust</option>
                  <option value="C++">C++</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setShowCreateRepo(false)}
                  className="flex-1 bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] py-2 rounded text-white font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateRepository}
                  className="flex-1 bg-[#238636] hover:bg-[#2ea043] py-2 rounded text-white font-bold"
                >
                  Create Repo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="p-5 border-b border-[#30363d] bg-[#0d1117]">
          <div className="flex items-start gap-4 mb-4">
             <div className="w-16 h-16 rounded-full border-2 border-[#30363d] overflow-hidden relative shrink-0">
                <img src={profilePic} className="w-full h-full object-cover" alt="Profile avatar" />
                <div className="absolute bottom-0 right-1 w-2.5 h-2.5 bg-[#2ea043] rounded-full border-2 border-[#0d1117]"></div>
             </div>
             <div className="pt-0.5">
                <h2 className="text-md font-bold text-white leading-tight">Tasfiya Tabassum</h2>
                <p className="text-[#8b949e] font-mono text-xs">Quincunx33</p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-bold text-[#8b949e] uppercase tracking-tighter">
                   <User size={10} /> {followersCount.toLocaleString()} followers • 8.2k following
                </div>
             </div>
          </div>
          <p className="text-[12px] text-[#c9d1d9] leading-relaxed mb-4 italic opacity-85">
             Building the future of systematic absurdity. <br/>
             Certified Senior Developer and StackOverflow historian.
          </p>
          <div className="flex gap-2">
             <button 
               onClick={handleFollowToggle}
               className={`flex-1 border py-1.5 rounded-md text-[11px] font-bold transition-all uppercase tracking-wider ${isFollowing ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-white'}`}
             >
               {isFollowing ? "Unfollow" : "Follow Profile"}
             </button>
             <button 
               onClick={() => setShowCreateRepo(true)}
               className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider flex items-center gap-1 transition-colors border border-transparent"
             >
               <PlusSquare size={12} /> New Repo
             </button>
          </div>
        </div>

        {/* Tabs Headers */}
        <div className="flex border-b border-[#30363d] bg-[#0d1117] sticky top-[51px] z-10 shadow-sm">
           {["overview", "repositories", "activity"].map((tab) => (
             <button 
               key={tab}
               onClick={() => {
                 setActiveTab(tab as any);
                 // clear query when clicking activity
                 if (tab === "activity") setSearchQuery("");
               }}
               className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative transition-colors ${activeTab === tab ? "text-white" : "text-[#8b919a] hover:text-white"}`}
             >
               {tab}
               {activeTab === tab && <motion.div layoutId="gh-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f78166]" />}
             </button>
           ))}
        </div>

        <div className="p-5 space-y-4">
           {activeTab === "overview" ? (
             <>
               {/* Contributions Grid Heatmap Widget */}
               <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 relative group">
                  <h4 className="text-[9px] font-bold text-[#8b949e] uppercase mb-3 flex items-center justify-between">
                     <span>1,248 contributions in the last year</span>
                  </h4>
                  
                  {hoveredCell && (
                    <div className="absolute top-1 right-4 bg-[#30363d] border border-slate-700 text-white font-mono text-[8px] px-2 py-0.5 rounded shadow-xl uppercase z-10">
                      {hoveredCell.contributions} contribution(s) on {hoveredCell.day}
                    </div>
                  )}

                  <div className="flex gap-[3px] justify-between overflow-x-auto pb-1 scrollbar-hide">
                    {Array(22).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col gap-[3px] shrink-0">
                         {Array(7).fill(0).map((_, j) => {
                           // Stable randomized levels based on coordinate seeds
                           const factor = (i * 3 + j * 7) % 11;
                           const level = factor > 8 ? 0 : factor > 5 ? 1 : factor > 3 ? 2 : factor > 1 ? 3 : 4;
                           const levels = ['bg-[#161b22]', 'bg-[#0e4429]', 'bg-[#006d32]', 'bg-[#26a641]', 'bg-[#39d353]'];
                           const contributions = level * 2 + (i + j) % 3;
                           const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][j];
                           
                           return (
                             <div 
                               key={j} 
                               onMouseEnter={() => setHoveredCell({ contributions, day: `${dayName} Wk-${i + 1}` })}
                               onMouseLeave={() => setHoveredCell(null)}
                               className={`w-2 h-2 rounded-[1.5px] cursor-pointer transition-colors hover:ring-1 hover:ring-white/50 ${levels[level]}`}
                             />
                           );
                         })}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center text-[8px] text-[#8b949e] font-mono uppercase tracking-widest">
                     <span>Less</span>
                     <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 rounded-[1px] bg-[#161b22]"></div>
                        <div className="w-2 h-2 rounded-[1px] bg-[#0e4429]"></div>
                        <div className="w-2 h-2 rounded-[1px] bg-[#006d32]"></div>
                        <div className="w-2 h-2 rounded-[1px] bg-[#26a641]"></div>
                        <div className="w-2 h-2 rounded-[1px] bg-[#39d353]"></div>
                     </div>
                     <span>More</span>
                  </div>
               </div>

               {/* Pin repos title */}
               <h3 className="font-bold text-[10px] uppercase text-[#8b949e] tracking-wider mb-2">Pinned Repositories</h3>
               <div className="grid grid-cols-1 gap-3">
                  {filteredRepos.slice(0, 3).map((repo, i) => (
                    <div key={i} className="p-4 border border-[#30363d] rounded-lg bg-[#0d1117] hover:border-[#8b949e] transition-colors relative group">
                       <div className="flex items-center gap-2 mb-2">
                          <Code size={14} className="text-[#8b949e]" />
                          <h5 className="font-bold text-xs text-[#58a6ff] hover:underline cursor-pointer">{repo.name}</h5>
                          <span className="text-[8px] px-1.5 py-0.2 rounded-full border border-[#30363d] text-[#8b949e] font-bold uppercase tracking-wider">Public</span>
                       </div>
                       <p className="text-[11px] text-[#8b949e] mb-4 italic leading-normal">{repo.desc}</p>
                       
                       <div className="flex items-center justify-between text-[10px] text-[#8b949e] pt-1">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1"><div className={`w-2 h-2 rounded-full ${repo.color}`}></div>{repo.lang}</div>
                            <div className="flex items-center gap-1"><Star size={11} /> {repo.starsNum}</div>
                          </div>
                          
                          <button 
                            onClick={() => handleStarToggle(repo.name)}
                            className={`px-2 py-0.5 border rounded-md text-[9px] font-bold uppercase transition-all ${repo.isStarred ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500' : 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]'}`}
                          >
                            {repo.isStarred ? "Starred" : "Star"}
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
             </>
           ) : activeTab === "repositories" ? (
             <div className="space-y-4">
               {filteredRepos.map((repo, i) => (
                 <div key={i} className="p-4 border-b border-[#30363d] last:border-0 hover:bg-[#161b22]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1 justify-between">
                       <div className="flex items-center gap-1.5">
                         <h5 className="font-bold text-sm text-[#58a6ff] hover:underline cursor-pointer">{repo.name}</h5>
                         <span className="text-[8px] px-1.5 py-0.2 rounded-full border border-[#30363d] text-[#8b949e] font-bold uppercase tracking-wider">Public</span>
                       </div>
                       <button 
                         onClick={() => handleStarToggle(repo.name)}
                         className={`px-2 py-0.5 border rounded-md text-[9px] font-bold uppercase transition-all ${repo.isStarred ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500' : 'bg-[#21262d] border-[#30363d] hover:bg-[#30363d] text-[#c9d1d9]'}`}
                       >
                         {repo.isStarred ? "Starred" : "Star"}
                       </button>
                    </div>
                    <p className="text-[11px] text-[#8b949e] mb-4 leading-relaxed italic">{repo.desc}</p>
                    <div className="flex items-center gap-5 text-[10px] text-[#8b949e]">
                       <div className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${repo.color}`}></div>{repo.lang}</div>
                       <div className="flex items-center gap-1"><Star size={11} fill={repo.isStarred ? "currentColor" : "none"} className={repo.isStarred ? "text-yellow-400" : ""} /> {repo.starsNum}</div>
                       <div className="flex items-center gap-1"><Share2 size={11} /> {repo.fork}</div>
                    </div>
                 </div>
               ))}
               {filteredRepos.length === 0 && (
                 <p className="text-center text-xs text-[#8b949e] italic py-8">No repositories found matching query.</p>
               )}
             </div>
           ) : (
             /* Activity list */
             <div className="space-y-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                     <div className="w-8 h-8 border border-[#30363d] rounded-md flex items-center justify-center bg-[#161b22] shrink-0">
                        <Github size={16} className="text-[#8b949e]" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] text-[#8b949e] mb-1">Success: Deploy <span className="font-bold text-white">[{i === 1 ? 'production' : 'staging'}]</span></p>
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3">
                           <p className="text-xs font-mono text-[#79c0ff]">quincunx33/portfolio-v{i}</p>
                           <p className="text-[10px] text-[#8b949e] mt-1.5">Deployed by Vercel • 5m ago</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
