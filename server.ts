import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { createServer as createViteServer } from "vite";

const PORT = 3000;
const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Config file path
const configPath = path.join(uploadsDir, "config.json");

// Helper to read config
const readConfig = () => {
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch (e) {
      console.error("Error reading config.json", e);
    }
  }
  return {
    avatar: "/avatar.jpg",
    banner: "/banner.jpg",
    bg: "/bg.mp4",
  };
};

// Helper to write config
const writeConfig = (config: any) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const type = req.body.type || "unknown";
    const ext = path.extname(file.originalname) || ".png";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `uploaded_${type}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size to support heavy GIFs / videos
});

app.use(express.json());

// API endpoints to serve config and hand uploads
app.get("/api/config", (req, res) => {
  res.json(readConfig());
});

let cachedDiscordData: any = null;
let lastFetchedTime = 0;
const CACHE_TTL = 15000; // 15 seconds

async function fetchWithTimeout(url: string, options = {}, timeout = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

app.get("/api/discord", async (req, res) => {
  try {
    const now = Date.now();
    if (cachedDiscordData && (now - lastFetchedTime < CACHE_TTL)) {
      return res.json(cachedDiscordData);
    }

    const discordId = "1383398182351929384";

    // Define High-Fidelity profile properties matching the user's latest Nitro profile to guarantee layout elements are always present
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
      const response = await fetchWithTimeout(`https://api.lanyard.rest/v1/users/${discordId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          lanyardData = result.data;
        }
      }
    } catch (err) {
      // Silent catch
    }

    // 2. Fetch High-Fidelity profile (including real banner) from japi.rest
    try {
      const response = await fetchWithTimeout(`https://japi.rest/discord/v1/user/${discordId}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.data) {
          japiProfile = result.data;
        }
      }
    } catch (err) {
      // Silent catch
    }

    // Merge the retrieved profile information
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

    const responseData = {
      discord_user: mergedUser,
      discord_status: status,
      activities: activities,
      listening_to_spotify: listeningToSpotify,
      spotify: spotify,
      isFallback: !lanyardData
    };

    cachedDiscordData = responseData;
    lastFetchedTime = now;
    return res.json(responseData);
  } catch (err: any) {
    console.error("Error in /api/discord:", err);
    // Return high-fidelity fallback user to keep frontend fully styled and interactive
    const discordId = "1383398182351929384";
    const fallbackUser = {
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
    return res.status(200).json({
      discord_user: fallbackUser,
      discord_status: "offline",
      activities: [],
      listening_to_spotify: false,
      spotify: null,
      isFallback: true,
      error: err.message || String(err)
    });
  }
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const type = req.body.type; // 'avatar', 'banner', 'bg'
  if (!["avatar", "banner", "bg"].includes(type)) {
    return res.status(400).json({ error: "Invalid type. Must be avatar, banner, or bg." });
  }

  const currentConfig = readConfig();
  const fileUrl = `/uploads/${req.file.filename}`;

  // Clean up the previously uploaded file of this type to save disk space
  const oldUrl = currentConfig[type];
  if (oldUrl && oldUrl.startsWith("/uploads/")) {
    const oldFilePath = path.join(process.cwd(), "public", oldUrl);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.error("Failed to delete older file", oldFilePath, err);
      }
    }
  }

  // Update config
  currentConfig[type] = fileUrl;
  writeConfig(currentConfig);

  res.json({ success: true, url: fileUrl, config: currentConfig });
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const publicPath = path.join(process.cwd(), "public");

    app.use(express.static(distPath));
    app.use(express.static(publicPath));

    app.get("*", (req, res, next) => {
      // Avoid intercepting API routes
      if (req.path.startsWith("/api/")) {
        return next();
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
