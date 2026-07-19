/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Eye, Gem, Heart, Candy, ChevronDown, Camera, Image as ImageIcon, Music, Gamepad2, Github, Facebook } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
  } | null;
  banner: string | null;
  banner_color: string | null;
  accent_color: number | null;
  global_name: string | null;
  public_flags: number;
  display_name_styles?: {
    font_id?: number;
    effect_id?: number;
    colors?: number[];
  } | null;
}

const getDisplayNameStyle = (user?: DiscordUser) => {
  // Determine font family based on font_id
  let fontFamily = '"Outfit", "Inter", sans-serif';
  if (user && user.display_name_styles) {
    const fontId = user.display_name_styles.font_id;
    if (fontId === 6) {
      fontFamily = '"DynaPuff", cursive';
    } else if (fontId === 1) {
      fontFamily = '"Space Grotesk", sans-serif';
    } else if (fontId === 2) {
      fontFamily = '"JetBrains Mono", monospace';
    } else if (fontId === 3) {
      fontFamily = '"Playfair Display", serif';
    } else if (fontId === 4) {
      fontFamily = '"Orbitron", sans-serif';
    } else if (fontId === 5) {
      fontFamily = '"Caveat", cursive';
    }
  }

  if (!user || !user.display_name_styles || !user.display_name_styles.colors || user.display_name_styles.colors.length === 0) {
    return {
      color: '#ffffff',
      textShadow: '0 0 10px rgba(255,255,255,0.3)',
      fontFamily: fontFamily
    };
  }

  const hexColors = user.display_name_styles.colors.map(num => {
    return `#${num.toString(16).padStart(6, '0')}`;
  });

  if (hexColors.length === 1) {
    return {
      color: hexColors[0],
      textShadow: `0 0 12px ${hexColors[0]}80`,
      fontFamily: fontFamily
    };
  }

  // Linear gradient for multiple colors
  return {
    backgroundImage: `linear-gradient(to right, ${hexColors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: 'none',
    display: 'inline-block',
    fontFamily: fontFamily
  };
};

const TypewriterBio = ({ hasEntered, discordUser }: { hasEntered: boolean; discordUser?: DiscordUser }) => {
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [age, setAge] = useState('');
  
  const displayName = discordUser?.global_name || 'TrungTinh';
  const text1 = `Hi I'm ${displayName}`;
  const text2 = "Welcome to my page";
  const text3 = "Im ";
  const text4 = " years old";

  useEffect(() => {
    if (!hasEntered) return;
    
    let current1 = 0;
    let current2 = 0;
    let current3 = 0;
    let current4 = 0;
    
    const typeText = () => {
      if (current1 < text1.length) {
        setLine1(text1.substring(0, current1 + 1));
        current1++;
        setTimeout(typeText, 75);
      } else if (current2 < text2.length) {
        setLine2(text2.substring(0, current2 + 1));
        current2++;
        setTimeout(typeText, 65);
      } else if (current3 < text3.length) {
        setLine3(text3.substring(0, current3 + 1));
        current3++;
        setTimeout(typeText, 65);
      } else if (current4 < text4.length) {
        setLine3(text3 + "<age>" + text4.substring(0, current4 + 1));
        current4++;
        setTimeout(typeText, 65);
      }
    };
    
    setTimeout(typeText, 500);
  }, [hasEntered, text1]);

  useEffect(() => {
    // Ngày sinh: 28/08/2012
    const birthDate = new Date('2012-08-28T00:00:00Z').getTime();
    const msPerYear = 31557600000; // 365.25 ngày
    
    const interval = setInterval(() => {
      const now = Date.now();
      const currentAge = (now - birthDate) / msPerYear;
      setAge(currentAge.toFixed(10)); // Tăng độ chính xác lên 10 chữ số thập phân
    }, 10); // Cập nhật mỗi 10ms để số chạy thật mượt và nhanh
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-left flex flex-col gap-2 font-sans mb-4">
      <h1 className="text-white text-2xl md:text-3xl font-bold min-h-[2rem] md:min-h-[2.25rem]">
        {line1.startsWith("Hi I'm ") ? (
          <>
            Hi I'm{" "}
            <span style={discordUser ? getDisplayNameStyle(discordUser) : { color: '#ffffff' }}>
              {line1.substring(7)}
            </span>
          </>
        ) : (
          line1
        )}
      </h1>
      <h3 className="text-zinc-300 text-lg md:text-xl font-light min-h-[1.75rem] md:min-h-[2rem]">{line2}</h3>
      <h4 className="text-zinc-400 text-sm md:text-base font-light min-h-[1.5rem] md:min-h-[1.75rem]">
        {line3.includes('<age>') ? (
          <>
            {line3.split('<age>')[0]}<span className="font-mono text-white">{age}</span>{line3.split('<age>')[1]}
          </>
        ) : (
          line3
        )}
      </h4>
    </div>
  );
};

interface Activity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  application_id?: string;
}

interface SpotifyData {
  track_id: string;
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps: {
    start: number;
    end: number;
  };
}

interface DiscordProfile {
  discord_user: DiscordUser;
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Activity[];
  listening_to_spotify: boolean;
  spotify: SpotifyData | null;
  isFallback?: boolean;
  isFullyOffline?: boolean;
}

const getAvatarUrl = (user: DiscordUser) => {
  if (!user.avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator || "0") % 5}.png`;
  }
  const isAnimated = user.avatar.startsWith("a_");
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isAnimated ? 'gif' : 'png'}?size=256`;
};

const getBannerStyle = (user: DiscordUser) => {
  const fallbackGrad = 'linear-gradient(135deg, #09090b, #18181b)';
  const fallbackColor = user.banner_color || (user.accent_color ? `#${user.accent_color.toString(16).padStart(6, '0')}` : '#1e3a8a');

  if (user.banner) {
    const isAnimated = user.banner.startsWith("a_");
    const url = user.banner.startsWith("http")
      ? user.banner
      : `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${isAnimated ? 'gif' : 'png'}?size=600`;
    return { 
      backgroundImage: `url(${url}), ${fallbackGrad}`, 
      backgroundColor: fallbackColor,
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    };
  }
  if (user.banner_color) {
    return { backgroundColor: user.banner_color };
  }
  if (user.accent_color) {
    const hex = `#${user.accent_color.toString(16).padStart(6, '0')}`;
    return { backgroundColor: hex };
  }
  return { backgroundImage: fallbackGrad };
};

const getAvatarDecorationUrl = (user: DiscordUser) => {
  if (user.avatar_decoration_data) {
    const asset = user.avatar_decoration_data.asset;
    if (asset.startsWith("http")) {
      return asset;
    }
    return `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
  }
  return null;
};

const getBadges = (flags: number) => {
  const badgesList = [];
  const base = "https://cdn.jsdelivr.net/gh/Glowstik/discord-badges@master";
  if (flags & (1 << 0)) badgesList.push({ name: "Staff", icon: `${base}/staff.svg` });
  if (flags & (1 << 1)) badgesList.push({ name: "Partner", icon: `${base}/partner.svg` });
  if (flags & (1 << 2)) badgesList.push({ name: "HypeSquad Events", icon: `${base}/hypesquad_events.svg` });
  if (flags & (1 << 3)) badgesList.push({ name: "Bug Hunter Level 1", icon: `${base}/bug_hunter_level_1.svg` });
  if (flags & (1 << 6)) badgesList.push({ name: "HypeSquad Bravery", icon: `${base}/hypesquad_bravery.svg` });
  if (flags & (1 << 7)) badgesList.push({ name: "HypeSquad Brilliance", icon: `${base}/hypesquad_brilliance.svg` });
  if (flags & (1 << 8)) badgesList.push({ name: "HypeSquad Balance", icon: `${base}/hypesquad_balance.svg` });
  if (flags & (1 << 9)) badgesList.push({ name: "Early Supporter", icon: `${base}/early_supporter.svg` });
  if (flags & (1 << 14)) badgesList.push({ name: "Bug Hunter Level 2", icon: `${base}/bug_hunter_level_2.svg` });
  if (flags & (1 << 17)) badgesList.push({ name: "Early Verified Developer", icon: `${base}/early_verified_developer.svg` });
  if (flags & (1 << 18)) badgesList.push({ name: "Certified Moderator", icon: `${base}/certified_moderator.svg` });
  if (flags & (1 << 22)) badgesList.push({ name: "Active Developer", icon: `${base}/active_developer.svg` });
  return badgesList;
};

const getAssetUrl = (appId: string, assetId: string) => {
  if (!assetId) return null;
  if (assetId.startsWith("mp:external/")) {
    return `https://media.discordapp.net/external/${assetId.slice(12)}`;
  }
  return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
};

export default function App() {
  const homeRef = useRef<HTMLDivElement>(null);
  
  const [bgMedia, setBgMedia] = useState<string>("/bg.mp4");
  const [isBgVideo, setIsBgVideo] = useState<boolean>(true);

  const [discordData, setDiscordData] = useState<DiscordProfile | null>(null);
  const [spotifyProgress, setSpotifyProgress] = useState(0);
  const [spotifyTimeStr, setSpotifyTimeStr] = useState({ current: "0:00", total: "0:00" });

  const bgInputRef = useRef<HTMLInputElement>(null);

  // Poll Discord data directly from client-side public APIs (Lanyard and Japi)
  useEffect(() => {
    const fetchDiscord = async () => {
      const discordId = "1383398182351929384";
      const highFidelityProfile = {
        id: discordId,
        username: "trungtinhxd",
        discriminator: "0",
        avatar: "30175d67bf480f2f49bc07ccd85bf76a",
        avatar_decoration_data: {
          asset: "a_d3da36040163ee0f9176dfe7ced45cdc",
          sku_id: "1144058522808614923"
        },
        banner: "a_f0a4fc1f5cb01acd16748c16c062fb28",
        banner_color: "#000000",
        accent_color: null,
        global_name: "TrungTinh",
        public_flags: 0,
        display_name_styles: {
          font_id: 6,
          effect_id: 4,
          colors: [
            4144959
          ]
        }
      };

      let lanyardData: any = null;
      let japiProfile: any = null;

      // 1. Fetch Lanyard Presence
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            lanyardData = result.data;
          }
        }
      } catch (err) {
        console.warn("Could not fetch direct Lanyard presence, using backup", err);
      }

      // 2. Fetch Japi Profile
      try {
        const response = await fetch(`https://japi.rest/discord/v1/user/${discordId}`);
        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            japiProfile = result.data;
          }
        }
      } catch (err) {
        console.warn("Could not fetch direct Japi profile, using backup", err);
      }

      // Merge the retrieved profile information matching the original high-fidelity layout
      const baseProfile = japiProfile || (lanyardData ? lanyardData.discord_user : null) || highFidelityProfile;
      
      const mergedUser = {
        id: baseProfile.id || discordId,
        username: baseProfile.username || highFidelityProfile.username,
        discriminator: baseProfile.discriminator || "0",
        avatar: baseProfile.avatar || highFidelityProfile.avatar,
        avatar_decoration_data: baseProfile.avatar_decoration_data || (baseProfile.avatar_decoration ? { asset: baseProfile.avatar_decoration } : highFidelityProfile.avatar_decoration_data),
        banner: baseProfile.banner || highFidelityProfile.banner,
        banner_color: baseProfile.banner_color || highFidelityProfile.banner_color,
        accent_color: baseProfile.accent_color !== undefined ? baseProfile.accent_color : null,
        global_name: baseProfile.global_name || highFidelityProfile.global_name,
        public_flags: baseProfile.public_flags !== undefined ? baseProfile.public_flags : highFidelityProfile.public_flags,
        display_name_styles: baseProfile.display_name_styles || highFidelityProfile.display_name_styles || null
      };

      const status = lanyardData ? lanyardData.discord_status : "offline";
      const activities = lanyardData ? lanyardData.activities : [
        {
          id: "custom",
          name: "Custom Status",
          type: 4,
          state: "What you hold in your hands isn't always yours.",
          emoji: { name: "✨" }
        }
      ];
      const listeningToSpotify = lanyardData ? lanyardData.listening_to_spotify : false;
      const spotify = lanyardData ? lanyardData.spotify : null;

      setDiscordData({
        discord_user: mergedUser,
        discord_status: status,
        activities: activities,
        listening_to_spotify: listeningToSpotify,
        spotify: spotify,
        isFallback: !lanyardData
      });
    };

    fetchDiscord();
    const interval = setInterval(fetchDiscord, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sync Spotify Progress if playing
  useEffect(() => {
    if (!discordData?.spotify) return;
    
    const updateProgress = () => {
      const now = Date.now();
      const start = discordData.spotify!.timestamps.start;
      const end = discordData.spotify!.timestamps.end;
      const total = end - start;
      const current = now - start;
      const percent = Math.min(100, Math.max(0, (current / total) * 100));
      setSpotifyProgress(percent);

      const formatTime = (ms: number) => {
        const s = Math.max(0, Math.floor(ms / 1000));
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

      setSpotifyTimeStr({
        current: formatTime(current),
        total: formatTime(total)
      });
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [discordData?.spotify]);

  // Fetch persistent config from localStorage on load
  useEffect(() => {
    const savedBg = localStorage.getItem("portfolio_bg");
    if (savedBg) {
      setBgMedia(savedBg);
      setIsBgVideo(savedBg.toLowerCase().endsWith('.mp4') || savedBg.toLowerCase().endsWith('.webm') || savedBg.startsWith('data:video/'));
    } else {
      setBgMedia("/bg.mp4");
      setIsBgVideo(true);
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner' | 'bg') => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith("video/");
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (type === 'bg') {
          setBgMedia(dataUrl);
          setIsBgVideo(isVideo);
          try {
            localStorage.setItem("portfolio_bg", dataUrl);
          } catch (error) {
            console.warn("Could not save to localStorage (file too large for storage limits), keeping as active session background only.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div 
      className={`relative bg-black text-white ${hasEntered ? 'min-h-screen overflow-x-hidden' : 'h-screen overflow-hidden'}`}
    >
      <style>{`
        @keyframes electric-shoot {
          0% { stroke-dashoffset: 100; opacity: 0; }
          2% { opacity: 1; }
          30% { stroke-dashoffset: -50; opacity: 1; }
          35% { opacity: 0; }
          100% { stroke-dashoffset: -50; opacity: 0; }
        }
        .electric-coil {
          stroke-dasharray: 30 100;
          animation: electric-shoot 2.5s infinite linear;
          stroke-linecap: round;
        }
        .electric-strike {
          stroke-dasharray: 40 100;
          animation: electric-shoot 2.5s infinite linear 0.4s;
          stroke-linecap: round;
        }
        .electric-coil-reverse {
          stroke-dasharray: 20 100;
          animation: electric-shoot 2.5s infinite linear 0.8s;
          stroke-linecap: round;
        }
        @keyframes text-shock {
          0%, 100% { transform: translate(0) skew(0deg); text-shadow: 0 4px 20px rgba(56, 189, 248, 0.5); }
          5% { transform: translate(0) skew(0deg); text-shadow: 0 4px 20px rgba(56, 189, 248, 0.5); }
          10% { transform: translate(2px, -2px) skew(-5deg); text-shadow: 2px 0 10px #0ff, -2px 0 20px #00f, 0 0 30px #38bdf8; color: #e0ffff; }
          15% { transform: translate(-2px, 2px) skew(5deg); text-shadow: -3px 0 10px #0ff, 2px 0 20px #00f, 0 0 30px #38bdf8; color: #fff; }
          20% { transform: translate(0) skew(0deg); text-shadow: 0 4px 20px rgba(56, 189, 248, 0.5); color: white; }
        }
        .name-shock {
          animation: text-shock 3s infinite;
        }
        @keyframes enchant-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.6); }
        }
        .enchant-particle {
          animation: enchant-float 1.2s ease-out forwards;
          color: #ffffff;
          text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px rgba(255, 255, 255, 0.8);
          filter: blur(0.5px);
        }
        @keyframes enchant-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0.6); }
        }
        .enchant-particle {
          animation: enchant-float 1.2s ease-out forwards;
          color: #ffffff;
          text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px rgba(255, 255, 255, 0.8);
          filter: blur(0.5px);
        }
        @keyframes glitch-anim {
          0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
          40% { clip-path: inset(40% 0 40% 0); transform: translate(2px, 2px); }
          60% { clip-path: inset(15% 0 65% 0); transform: translate(-2px, -2px); }
          80% { clip-path: inset(60% 0 20% 0); transform: translate(2px, 2px); }
          100% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, -2px); }
        }
        .glitch-hover:hover {
          animation: glitch-anim 0.2s cubic-bezier(.25, .46, .45, .94) both infinite;
          filter: drop-shadow(0 0 10px rgba(0,255,255,0.8)) drop-shadow(0 0 20px rgba(255,0,255,0.8));
        }
        @keyframes type-clip {
          0% { clip-path: inset(0 100% 0 0); opacity: 1; }
          100% { clip-path: inset(0 0 0 0); opacity: 1; }
        }
        .type-clip-anim {
          animation: type-clip 1.5s steps(40, end) forwards;
        }
        .type-clip-anim-delayed {
          opacity: 0;
          animation: type-clip 2s steps(50, end) 1.5s forwards;
        }
        @keyframes border-glow {
          0%, 100% { border-color: rgba(255, 255, 255, 0.1); }
          50% { border-color: rgba(56, 189, 248, 0.5); }
        }
        .card-glow {
          animation: border-glow 4s infinite;
        }
        @keyframes rotate-border {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-rotate-border {
          animation: rotate-border 6s linear infinite;
        }
      `}</style>

      {/* Click to Enter Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/[0.15] backdrop-blur-3xl cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setHasEntered(true);
            }}
          >
            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1], 
                opacity: [0.7, 1, 0.7],
                filter: ["drop-shadow(0 0 10px rgba(255,255,255,0.1))", "drop-shadow(0 0 25px rgba(255,255,255,0.35))", "drop-shadow(0 0 10px rgba(255,255,255,0.1))"]
              }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              whileHover={{ scale: 1.25 }}
              className="text-8xl select-none"
            >
              🖤
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Media (Dark Anime/Fantasy Vibe) */}
      <div className="fixed inset-0 z-0 opacity-40 transition-all duration-700">
        {isBgVideo ? (
          <video 
            key={bgMedia}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) contrast(1.2)' }}
          >
            <source src={bgMedia} />
          </video>
        ) : (
          <img 
            src={bgMedia} 
            alt="Background" 
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) contrast(1.2)' }}
            referrerPolicy="no-referrer"
          />
        )}
      </div>
      

      
      {/* Main Content Container */}
      <motion.div 
        ref={homeRef} 
        initial={{ opacity: 0, y: 20 }}
        animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center min-h-screen justify-center pt-24 pb-12"
      >
        
        {/* Profile Card (Liquid Glass with Animated Flowing Border) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={hasEntered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-sm rounded-2xl mb-10 shadow-[0_0_50px_rgba(0,0,0,0.6)] mt-4 group/card text-left"
        >
          {/* Animated spinning white glowing border beam (Strictly on the border via Masking) */}
          <div 
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            style={{
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "exclude",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              padding: "2.5px"
            }}
          >
            <div className="absolute inset-[-150%] animate-rotate-border bg-[conic-gradient(from_0deg,transparent_35%,#ffffff_50%,transparent_65%)]" />
          </div>
          
          {/* Inner Liquid Glass Card */}
          <div className="w-full bg-white/[0.03] backdrop-blur-3xl rounded-2xl overflow-hidden relative z-10 border border-white/10 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.15)]">
          {/* Banner Area */}
          <div 
            className="h-32 w-full relative overflow-hidden"
            style={discordData ? getBannerStyle(discordData.discord_user) : { backgroundImage: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          <div className="relative pt-14 pb-6 px-6">
            {/* Avatar positioned top-left, overlapping banner */}
            <div className="absolute -top-12 left-6 w-24 h-24 z-20 group/avatar">
              {/* Avatar Image (Supports gif, jpg, png) */}
              <img 
                src={discordData ? getAvatarUrl(discordData.discord_user) : "/avatar.jpg"} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-full border-[6px] border-zinc-950/60 shadow-2xl backdrop-blur-md transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              
              {/* Avatar Decoration / Frame */}
              {discordData && getAvatarDecorationUrl(discordData.discord_user) && (
                <img
                  src={getAvatarDecorationUrl(discordData.discord_user)!}
                  alt="Avatar Decoration"
                  className="absolute -inset-[14%] w-[128%] h-[128%] max-w-none pointer-events-none z-30"
                  referrerPolicy="no-referrer"
                />
              )}

              {/* Status Badge */}
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-zinc-950/60 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center z-40">
                <div 
                  className={`w-4.5 h-4.5 rounded-full transition-all duration-500 ${
                    discordData?.discord_status === "online" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                    discordData?.discord_status === "idle" ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" :
                    discordData?.discord_status === "dnd" ? "bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                    "bg-zinc-500"
                  }`}
                  title={
                    discordData?.discord_status === "online" ? "Online" :
                    discordData?.discord_status === "idle" ? "Idle" :
                    discordData?.discord_status === "dnd" ? "Do Not Disturb" :
                    "Offline"
                  }
                />
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-left w-full mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <h1 
                    className="text-2xl md:text-3xl font-bold tracking-wide relative z-10"
                    style={discordData ? getDisplayNameStyle(discordData.discord_user) : { color: '#ffffff' }}
                  >
                    {discordData?.discord_user.global_name || "TrungTinh"}
                  </h1>
                </div>
                <p className="text-zinc-400 text-xs font-mono font-semibold mt-0.5">
                  @{discordData?.discord_user.username || "ngtrtinh28"}
                </p>

                {/* Custom Status */}
                {(() => {
                  const customStatus = discordData?.activities.find(act => act.type === 4 || act.id === "custom");
                  if (customStatus && (customStatus.state || customStatus.emoji)) {
                    return (
                      <div className="flex items-center gap-2 text-zinc-200 text-sm mt-3 bg-white/[0.04] backdrop-blur-md border border-white/5 py-1.5 px-3 rounded-xl w-fit shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        {customStatus.emoji && (
                          <span className="text-base flex-shrink-0">
                            {customStatus.emoji.id ? (
                              <img 
                                src={`https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}`} 
                                alt={customStatus.emoji.name} 
                                className="w-4.5 h-4.5 inline-block"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              customStatus.emoji.name
                            )}
                          </span>
                        )}
                        {customStatus.state && <span className="font-light truncate">{customStatus.state}</span>}
                      </div>
                    );
                  }
                  return (
                    <p className={`text-zinc-400/80 italic text-xs md:text-sm font-light tracking-wide mt-3 ${hasEntered ? 'type-clip-anim-delayed' : 'opacity-0'}`}>
                      "What you hold in your hands isn't always yours."
                    </p>
                  );
                })()}
              </div>

              {/* Bio & Age Section */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <TypewriterBio hasEntered={hasEntered} discordUser={discordData?.discord_user} />
              </div>

              {/* Lanyard Help Notice */}
              {discordData?.isFallback && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 leading-relaxed font-sans">
                  <div className="font-semibold mb-1 flex items-center gap-1 text-blue-300">
                    <span>💡</span> Kết nối Discord Live Presence
                  </div>
                  Tài khoản của bạn đang dùng dữ liệu dự phòng. Để hiển thị trạng thái Trực tuyến, Spotify và Game trực tiếp theo thời gian thực, vui lòng tham gia server Lanyard:{" "}
                  <a 
                    href="https://discord.gg/lanyard" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 underline font-semibold hover:text-blue-300"
                  >
                    discord.gg/lanyard
                  </a>
                </div>
              )}

              {/* LIVE DISCORD PRESENCE SECTION */}
              {(discordData?.spotify || discordData?.activities.some(act => act.type !== 4 && act.id !== "spotify" && act.name !== "Spotify")) && (
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
                  
                  {/* Spotify Live Playing */}
                  {discordData?.spotify && (
                    <div className="p-4 bg-[#1db954]/5 border border-[#1db954]/10 rounded-xl relative overflow-hidden group/spotify">
                      <div className="absolute top-2 right-3 text-[10px] text-[#1db954] font-bold tracking-widest flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1db954] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1db954]"></span>
                        </span>
                        LISTENING TO SPOTIFY
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-[#1db954]/20 shadow-md">
                          <img 
                            src={discordData.spotify.album_art_url} 
                            alt={discordData.spotify.album} 
                            className="w-full h-full object-cover animate-[spin_12s_linear_infinite]"
                            style={{ animationPlayState: 'running' }}
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-8">
                          <h4 className="text-white text-sm font-semibold truncate hover:text-[#1db954] transition-colors">
                            <a 
                              href={`https://open.spotify.com/track/${discordData.spotify.track_id}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              {discordData.spotify.song}
                            </a>
                          </h4>
                          <p className="text-zinc-300 text-xs truncate mt-0.5">by {discordData.spotify.artist}</p>
                          <p className="text-zinc-400 text-[10px] truncate mt-0.5 italic">on {discordData.spotify.album}</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mt-4 flex flex-col gap-1">
                        <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#1db954] h-full transition-all duration-1000 ease-linear rounded-full" 
                            style={{ width: `${spotifyProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                          <span>{spotifyTimeStr.current}</span>
                          <span>{spotifyTimeStr.total}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Game Activity */}
                  {(() => {
                    const gameActivity = discordData?.activities.find(act => act.type !== 4 && act.id !== "spotify" && act.name !== "Spotify");
                    if (gameActivity) {
                      return (
                        <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-xl flex gap-4 items-center relative overflow-hidden">
                          <div className="absolute top-2 right-3 text-[10px] text-cyan-400 font-bold tracking-widest flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                            </span>
                            PLAYING
                          </div>
                          <div className="relative w-16 h-16 flex-shrink-0">
                            {gameActivity.assets?.large_image ? (
                              <img 
                                src={getAssetUrl(gameActivity.application_id || '', gameActivity.assets.large_image) || ''} 
                                alt={gameActivity.assets.large_text || gameActivity.name} 
                                className="w-full h-full rounded-lg object-cover border border-white/10"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5">
                                <Gamepad2 size={24} className="text-zinc-500" />
                              </div>
                            )}
                            {gameActivity.assets?.small_image && (
                              <img 
                                src={getAssetUrl(gameActivity.application_id || '', gameActivity.assets.small_image) || ''} 
                                alt={gameActivity.assets.small_text || ''} 
                                className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-[#111214] object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-8">
                            <div className="text-white text-sm font-semibold truncate mt-0.5">{gameActivity.name}</div>
                            {gameActivity.details && <div className="text-zinc-300 text-xs truncate mt-0.5">{gameActivity.details}</div>}
                            {gameActivity.state && <div className="text-zinc-400 text-xs truncate mt-0.5">{gameActivity.state}</div>}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                </div>
              )}

            </div>
          </div>
        </div>
      </motion.div>

        {/* Social Buttons */}
        <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
          {/* Discord Button */}
          <a 
            href="https://discord.com/users/1383398182351929384" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(88,101,242,0.5)]"
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>

          {/* Spotify Button */}
          <a 
            href="https://open.spotify.com/user/31aqdqwu3peb6wbzl4wt3th33gfu?si=LM0ZFArOTxu7jofuC_LUGg" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(29,185,84,0.5)]"
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" className="text-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.001 10.62 18.72 12.9c.36.181.54.84.241 1.14zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.38 4.2-1.26 11.28-1.02 15.72 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </a>

          {/* Facebook Button */}
          <a 
            href="https://www.facebook.com/trungtinh28/" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(24,119,242,0.5)]"
          >
            <Facebook size={32} className="text-white" fill="currentColor" stroke="none" />
          </a>

          {/* Roblox Button */}
          <a 
            href="https://www.roblox.com/users/4503079198/profile" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" className="text-black">
              <path d="M5.44 0L0 18.56l18.56 5.44L24 5.44 5.44 0zm8.32 14.88l-4.48-1.28 1.28-4.48 4.48 1.28-1.28 4.48z"/>
            </svg>
          </a>

          {/* GitHub Button */}
          <a 
            href="https://github.com/trungtinhxd" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-[#24292e] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            <Github size={32} className="text-white" />
          </a>
        </div>

      </motion.div>
      
    </div>
  );
}
