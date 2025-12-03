import { z } from "zod";

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string(),
  thumbnail2Url: z.string().optional(),
  embedCode: z.string(),
  embedUrl: z.string(),
  duration: z.string(),
  durationSeconds: z.number(),
  views: z.string(),
  viewsCount: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  category: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  actors: z.array(z.string()),
  screenshots: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  count: z.number(),
});

export const performerSchema = z.object({
  id: z.string(),
  name: z.string(),
  videoCount: z.number(),
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  count: z.number(),
});

export const paginatedVideosSchema = z.object({
  videos: z.array(videoSchema),
  page: z.number(),
  totalPages: z.number(),
  totalVideos: z.number(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  passwordHash: z.string(),
  createdAt: z.string(),
});

export type Video = z.infer<typeof videoSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Performer = z.infer<typeof performerSchema>;
export type Tag = z.infer<typeof tagSchema>;
export type PaginatedVideos = z.infer<typeof paginatedVideosSchema>;
export type User = z.infer<typeof userSchema>;

export const insertVideoSchema = videoSchema.omit({ id: true });
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, passwordHash: true }).extend({
  password: z.string().min(8),
});
export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const users = {
  id: "",
  username: "",
  password: "",
};
