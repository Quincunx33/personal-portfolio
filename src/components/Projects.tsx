import profilePic from "../assets/IMG_5197.jpeg";
import { useState } from "react";
import { ExternalLink, Facebook, Instagram, Heart, MessageCircle, Share2, Github, Code, Terminal, Server, FolderGit2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import SecureImage from "./SecureImage";

export default function Projects() {
  const [activeMainTab, setActiveMainTab] = useState<"projects" | "social">("projects");
  const [activeTabTab, setActiveTabTab] = useState<"facebook" | "instagram">("facebook");

  // GitHub Projects Data
  const githubProjects = [
    {
      description: "🛡️ HackerAI Framework (Project Sirra): A professional, modular security testing environment with automated orchestration, security sandboxing, and vulnerability assessment capabilities.",
      name: "EthicalHackingTools",
      url: "https://github.com/Quincunx33/EthicalHackingTools",
      icon: Terminal
    },
    {
      description: "Emulator ",
      name: "Virtual-machine",
      url: "https://github.com/Quincunx33/Virtual-machine",
      icon: Server
    },
    {
      description: "PyBrowser: Python Playground",
      name: "PyBrowser",
      url: "https://github.com/Quincunx33/PyBrowser",
      icon: Code
    },
    {
      description: "🚀 Ultimate SMS & Email Bomber v2.1 | Interactive | High-Speed | Proxy Support | Cross-Platform",
      name: "bomber-v2",
      url: "https://github.com/Quincunx33/bomber-v2",
      icon: Terminal
    },
    {
      description: "Naruto and Sasuke Hand Tracking Power Effects with MediaPipe, featuring dynamic visuals, immersive audio, and interactive UI/UX.",
      name: "naruto-sasuke",
      url: "https://github.com/Quincunx33/naruto-sasuke",
      icon: Code
    },
    {
      description: "Lightweight webOs",
      name: "WebOs",
      url: "https://github.com/Quincunx33/WebOs",
      icon: Server
    },
    {
      description: "JavaScript 3D Library.",
      name: "three.js",
      url: "https://github.com/Quincunx33/three.js",
      icon: Code
    },
    {
      description: "Web-based port of GTA: Vice City running in browser via WebAssembly.",
      name: "reVCDOS",
      url: "https://github.com/Quincunx33/reVCDOS",
      icon: Code
    },
    {
      description: "..",
      name: "re3",
      url: "https://github.com/Quincunx33/re3",
      icon: FolderGit2
    }
  ];

  // Custom mock data for high-fidelity social profile previews if iframe gets blocked
  const mockFacebookProfile = {
    name: "Tasfiya Tabassum",
    username: "@taissuuu",
    bio: "The Sovereign Queen of Dumbland 👑 | Governing the absurd with absolute majesty and a plastic crown. Deciding my own vibe since day one.",
    followers: "9.8K citizens",
    following: "124 decrees",
    avatar: profilePic,
    posts: [
      {
        id: 1,
        time: "Just now",
        content: "Behold the Queen's Power! Just issued a royal decree making caffeine mandatory for all Dumbland officials. Logic is for the commoners; majesty is for the Queen. 👑✨",
        likes: 1240,
        comments: 156,
        shares: 88
      },
      {
        id: 2,
        time: "Yesterday at 14:12 PM",
        content: "My doctor told me I need more order in my life. I told him chaos is the foundation of my empire. Unvetted cosmic authority achieved. 🚶‍♀️💎",
        likes: 856,
        comments: 210,
        shares: 42
      }
    ]
  };

  const mockInstagramProfile = {
    username: "taissuuu",
    fullName: "Tasfiya",
    bio: "✨ Wielder of Queenly Power\n🕵️‍♀️ Sovereign of the Realm\n🎨 Designing High-Precision Chaos\n☕ Fueled by Coffee and Majesty",
    followers: "5,640 subjects",
    following: "32 realms",
    postsCount: "256 decrees",
    avatar: profilePic,
    grid: [
      { id: 1, img: profilePic, likes: 511, comments: 45 },
      { id: 2, placeholder: "decree.issue();", text: "Optimal Majesty ✨", likes: 489, comments: 32 },
      { id: 3, placeholder: "interface Queen { ... }", text: "Defining the Standard 👑", likes: 750, comments: 88 },
      { id: 4, placeholder: "reign.continue();", text: "Genesis Logic.", likes: 920, comments: 112 },
    ]
  };

  return (
    <section id="projects" className="py-24 px-6 max-w-6xl mx-auto font-sans" style={{ perspective: "1500px" }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-slate-200 flex items-center">
            <span className="text-emerald-500 font-mono text-xl mr-2">02.</span>
            My Work & Coordinates
          </h2>
          <div className="h-px bg-slate-700 flex-1 md:max-w-xs"></div>
        </div>
        
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mb-8 font-mono">
          Explore my open-source tools and infrastructure projects, or connect with me via my active social coordinates.
        </p>

        {/* Global Section Tabs */}
        <div className="flex justify-start gap-4 mb-10 border-b border-slate-800 pb-px font-mono text-sm max-w-sm">
          <button
            onClick={() => setActiveMainTab("projects")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeMainTab === "projects" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
          >
            <Github size={16} /> Open Source
          </button>
          <button
            onClick={() => setActiveMainTab("social")}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${activeMainTab === "social" ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
          >
            <Share2 size={16} /> Social Spaces
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeMainTab === "projects" ? (
            <motion.div
              key="projects-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {githubProjects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_4px_30px_rgba(16,185,129,0.1)] hover:-translate-y-1 block"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <project.icon size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-slate-500 group-hover:text-emerald-400 transition-colors">
                      <ExternalLink size={18} />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 mb-2 truncate group-hover:text-emerald-300 transition-colors">{project.name}</h3>
                  <p className="text-sm text-slate-400 font-mono leading-relaxed line-clamp-3">
                    {project.description || "No description provided."}
                  </p>
                </a>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="social-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              {/* Mobile/Desktop Switch Tabs */}
              <div className="flex md:hidden justify-center gap-2 mb-8 bg-slate-800/80 p-1.5 rounded-lg border border-slate-700/60 font-mono text-sm">
                <button
                  onClick={() => setActiveTabTab("facebook")}
                  className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTabTab === "facebook" ? "bg-blue-600 text-white" : "text-slate-400"}`}
                >
                  <Facebook size={16} /> Facebook
                </button>
                <button
                  onClick={() => setActiveTabTab("instagram")}
                  className={`flex-1 py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTabTab === "instagram" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : "text-slate-400"}`}
                >
                  <Instagram size={16} /> Instagram
                </button>
              </div>

              {/* Responsive Desktop Side-by-Side Grid & Interactive Simulator Viewport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                
                {/* FACEBOOK FRAME CONTAINER */}
                <div className={`flex flex-col gap-4 ${activeTabTab !== "facebook" ? "hidden md:flex" : "flex"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook size={20} className="text-blue-500 fill-blue-500" />
                      <h3 className="font-bold text-slate-200 font-mono text-sm uppercase tracking-wide">Facebook Feed</h3>
                    </div>
                  </div>

                  {/* Simulated smartphone device frame */}
                  <div className="relative border border-slate-700/80 rounded-[32px] bg-slate-950 p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col aspect-[9/16] h-[640px]">
                    {/* Notch / Speaker bar */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                      <div className="bg-slate-950 w-36 h-5 rounded-b-xl flex items-center justify-center gap-1.5 px-4">
                        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-950"></div>
                      </div>
                    </div>

                    {/* Internal phone container */}
                    <div className="w-full h-full rounded-2xl bg-slate-900 overflow-hidden relative flex flex-col pt-4">
                      <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans">
                        {/* Simulated Facebook App Header */}
                        <div className="bg-[#1877F2] px-4 py-3 sticky top-0 flex items-center justify-between shadow-md z-30">
                          <span className="font-black text-xl italic tracking-tight font-serif select-none">facebook</span>
                          <div className="flex gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white"></span>
                            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Interactive Feed</span>
                          </div>
                        </div>

                        {/* Cover Photo */}
                        <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/20"></div>
                          <span className="text-[8px] font-mono text-white/50 border border-white/20 px-2 py-0.5 rounded">fb_cover_backdrop.jpg</span>
                        </div>

                        {/* Profile details */}
                        <div className="px-4 pb-4 relative">
                          <div className="absolute top-[-40px] left-4 border-4 border-slate-950 rounded-full overflow-hidden w-20 h-20 bg-slate-800 relative select-none">
                            <SecureImage srcUri={mockFacebookProfile.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                            <div className="absolute inset-0 bg-transparent rounded-full z-10" onContextMenu={(e) => e.preventDefault()} />
                          </div>
                          
                          <div className="pt-12">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-lg font-black text-white">{mockFacebookProfile.name}</h4>
                              <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold select-none" title="Verified Member">✓</span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono mb-2">{mockFacebookProfile.username}</p>
                            <p className="text-xs text-slate-300 bg-slate-900 border border-slate-850 p-2.5 rounded-lg leading-relaxed">{mockFacebookProfile.bio}</p>
                            
                            <div className="flex gap-4 mt-3 text-xs text-slate-400 font-mono">
                              <span><strong>{mockFacebookProfile.followers}</strong></span>
                              <span><strong>{mockFacebookProfile.following}</strong></span>
                            </div>
                          </div>

                          {/* Fun CTA buttons */}
                          <div className="flex gap-2 mt-4">
                            <a
                              href="https://www.facebook.com/taissuuu?"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 bg-[#1877F2] hover:bg-blue-600 text-white rounded-md text-xs font-bold text-center transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-600/20"
                            >
                              <ExternalLink size={12} /> Add Friend
                            </a>
                            <a
                              href="https://www.facebook.com/taissuuu?"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs text-center font-bold transition-all"
                            >
                              Message
                            </a>
                          </div>
                        </div>

                        {/* Mock Timeline Posts */}
                        <div className="mt-2 bg-slate-900 border-t border-slate-800">
                          <div className="p-3 border-b border-slate-800 text-xs text-slate-400 font-mono">
                            Timeline Activity ({mockFacebookProfile.posts.length})
                          </div>

                          {mockFacebookProfile.posts.map((post) => (
                            <div key={post.id} className="p-4 border-b border-slate-850 flex flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <SecureImage srcUri={mockFacebookProfile.avatar} alt="Mini avatar" className="w-8 h-8 rounded-full border border-slate-700" />
                                <div>
                                  <p className="text-xs font-bold text-white leading-none">{mockFacebookProfile.name}</p>
                                  <span className="text-[9px] text-slate-500 font-mono">{post.time}</span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed break-words">{post.content}</p>
                              
                              {/* Actions bar */}
                              <div className="flex justify-between items-center text-slate-500 text-[11px] pt-2 border-t border-slate-850/60 font-mono">
                                <span className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition-colors">
                                  <Heart size={12} className="fill-red-500 text-red-500" /> {post.likes}
                                </span>
                                <span className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors">
                                  <MessageCircle size={12} /> {post.comments}
                                </span>
                                <span className="flex items-center gap-1 hover:text-green-500 cursor-pointer transition-colors">
                                  <Share2 size={12} /> {post.shares}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                    </div>
                  </div>

                  {/* Direct Open Link CTA */}
                  <a 
                    href="https://www.facebook.com/taissuuu?" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 self-center flex items-center gap-1.5 text-xs text-blue-400 font-mono hover:text-emerald-400 transition-colors bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 hover:border-emerald-500/50"
                  >
                    <ExternalLink size={14} /> Open Facebook Profile Directly
                  </a>
                </div>

                {/* INSTAGRAM FRAME CONTAINER */}
                <div className={`flex flex-col gap-4 ${activeTabTab !== "instagram" ? "hidden md:flex" : "flex"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram size={20} className="text-pink-500" />
                      <h3 className="font-bold text-slate-200 font-mono text-sm uppercase tracking-wide">Instagram Profile</h3>
                    </div>
                  </div>

                  {/* Simulated smartphone device frame */}
                  <div className="relative border border-slate-700/80 rounded-[32px] bg-slate-950 p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col aspect-[9/16] h-[640px]">
                    {/* Notch / Speaker bar */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
                      <div className="bg-slate-950 w-36 h-5 rounded-b-xl flex items-center justify-center gap-1.5 px-4">
                        <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-950"></div>
                      </div>
                    </div>

                    {/* Internal phone container */}
                    <div className="w-full h-full rounded-2xl bg-slate-900 overflow-hidden relative flex flex-col pt-4">
                      <div className="w-full h-full overflow-y-auto bg-slate-950 text-slate-100 font-sans">
                        {/* Simulated Instagram Header */}
                        <div className="bg-[#121212] px-4 py-3 border-b border-slate-900 sticky top-0 flex items-center justify-between shadow-md z-30">
                          <span className="font-black text-xl italic font-serif bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text select-none">instagram</span>
                          <div className="flex gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 border border-white"></span>
                            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Interactive Profile</span>
                          </div>
                        </div>

                        {/* Head Profile Section */}
                        <div className="p-4 flex flex-col border-b border-slate-900 bg-[#121212] relative">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                              <div className="w-full h-full rounded-full bg-slate-950 p-[2px] relative overflow-hidden select-none">
                                <SecureImage srcUri={mockInstagramProfile.avatar} alt="Avatar profile" className="w-full h-full object-cover rounded-full select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                <div className="absolute inset-0 bg-transparent rounded-full z-10" onContextMenu={(e) => e.preventDefault()} />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <h4 className="text-sm font-black text-white">{mockInstagramProfile.username}</h4>
                                <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[7px] text-white font-bold select-none">✓</span>
                              </div>
                              <div className="flex gap-2.5 mt-2 text-[11px] font-mono text-slate-400 leading-snug">
                                <span><strong>135</strong> posts</span>
                                <span><strong>1.2K</strong> followers</span>
                              </div>
                            </div>
                          </div>

                          {/* Bio Details */}
                          <div className="mt-4">
                            <h5 className="text-[11px] font-bold text-white">{mockInstagramProfile.fullName}</h5>
                            <pre className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed whitespace-pre-line tracking-tight">
                              {mockInstagramProfile.bio}
                            </pre>
                          </div>

                          {/* CTA Buttons bar */}
                          <div className="flex gap-2 mt-4 font-mono">
                            <a
                              href="https://www.instagram.com/taissuuu"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md text-[10px] font-bold text-center transition-all flex items-center justify-center gap-1 shadow-md shadow-pink-600/10"
                            >
                              <ExternalLink size={10} /> Follow
                            </a>
                            <a
                              href="https://www.instagram.com/taissuuu"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-md text-[10px] text-center font-bold transition-all"
                            >
                              Message
                            </a>
                          </div>
                        </div>

                        {/* Photo Grid Section */}
                        <div className="p-1 bg-slate-950">
                          <div className="grid grid-cols-2 gap-1">
                            {mockInstagramProfile.grid.map((post) => (
                              <div key={post.id} className="aspect-square bg-slate-900 border border-slate-900 overflow-hidden relative group cursor-pointer flex flex-col justify-between p-3 select-none">
                                {post.img ? (
                                  <>
                                    <SecureImage srcUri={post.img} alt="Grid item" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 select-none" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                    <div className="absolute inset-0 bg-transparent z-10" onContextMenu={(e) => e.preventDefault()} />
                                  </>
                                ) : (
                                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center px-2">
                                    <pre className="text-[9px] font-mono text-emerald-400 leading-normal select-none overflow-x-hidden text-ellipsis whitespace-pre">
                                      {post.placeholder}
                                    </pre>
                                  </div>
                                )}
                                {post.text && (
                                  <div className="absolute bottom-2 inset-x-2 bg-slate-950/80 backdrop-blur-xs p-1 rounded border border-slate-800">
                                    <p className="text-[8px] text-slate-300 truncate text-center">{post.text}</p>
                                  </div>
                                )}

                                {/* Over hover information */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-mono font-bold z-10">
                                  <span className="flex items-center gap-1"><Heart size={12} className="fill-white" /> {post.likes}</span>
                                  <span className="flex items-center gap-1"><MessageCircle size={12} className="fill-white" /> {post.comments}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Direct Open Link CTA */}
                  <a 
                    href="https://www.instagram.com/taissuuu" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 self-center flex items-center gap-1.5 text-xs text-pink-400 font-mono hover:text-emerald-400 transition-colors bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 hover:border-emerald-500/50"
                  >
                    <ExternalLink size={14} /> Open Instagram Profile Directly
                  </a>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

