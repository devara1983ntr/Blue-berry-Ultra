import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/videos", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const { search, category, performer, tag } = req.query;

      let result;
      if (typeof search === "string" && search.trim()) {
        result = await storage.searchVideos(search.trim(), page);
      } else if (typeof category === "string" && category.trim()) {
        result = await storage.getVideosByCategory(category.trim(), page);
      } else if (typeof performer === "string" && performer.trim()) {
        result = await storage.getVideosByPerformer(performer.trim(), page);
      } else if (typeof tag === "string" && tag.trim()) {
        result = await storage.getVideosByTag(tag.trim(), page);
      } else {
        result = await storage.getVideosPage(page);
      }

      res.json(result);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideoByGlobalId(id);

      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }

      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ error: "Failed to fetch video" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/performers", async (req, res) => {
    try {
      const performers = await storage.getPerformers();
      res.json(performers);
    } catch (error) {
      console.error("Error fetching performers:", error);
      res.status(500).json({ error: "Failed to fetch performers" });
    }
  });

  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      res.json({
        totalPages: storage.getTotalPages(),
        totalVideos: storage.getTotalVideos(),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/auth/me", (req, res) => {
    res.status(401).json({ error: "Not authenticated" });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    res.status(401).json({ message: "Invalid credentials" });
  });

  app.post("/api/auth/register", (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    res.status(201).json({ 
      user: { 
        id: "demo-user",
        username,
        email,
      } 
    });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    res.json({ success: true, message: "Reset link sent" });
  });

  app.post("/api/auth/reset-password", (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password required" });
    }
    res.json({ success: true });
  });

  return httpServer;
}
