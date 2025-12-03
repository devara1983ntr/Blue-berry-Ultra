import type { Video, Category, Performer, Tag, PaginatedVideos, User } from "@shared/schema";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

export interface IStorage {
  getVideosPage(page: number): Promise<PaginatedVideos>;
  getVideoById(pageNum: number, videoIndex: number): Promise<Video | undefined>;
  getVideoByGlobalId(globalId: string): Promise<Video | undefined>;
  getCategories(): Promise<Category[]>;
  getPerformers(): Promise<Performer[]>;
  getTags(): Promise<Tag[]>;
  searchVideos(query: string, page?: number): Promise<PaginatedVideos>;
  getVideosByCategory(category: string, page?: number): Promise<PaginatedVideos>;
  getVideosByPerformer(performer: string, page?: number): Promise<PaginatedVideos>;
  getVideosByTag(tag: string, page?: number): Promise<PaginatedVideos>;
  getTotalPages(): number;
  getTotalVideos(): number;
}

interface RawVideoData {
  embed: string;
  thumbnail: string;
  thumbnail2?: string;
  screenshots?: string;
  screenshots2?: string;
  title: string;
  tags: string;
  categories: string;
  actors: string;
  duration: string;
  views: string;
  likes: string;
  dislikes: string;
}

function parseVideoData(raw: RawVideoData, pageNum: number, index: number): Video {
  const embedMatch = raw.embed.match(/src="([^"]+)"/);
  const embedUrl = embedMatch ? embedMatch[1] : '';
  
  const durationSeconds = parseInt(raw.duration) || 0;
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const viewsCount = parseInt(raw.views) || 0;
  let viewsFormatted = viewsCount.toString();
  if (viewsCount >= 1000000) {
    viewsFormatted = (viewsCount / 1000000).toFixed(1) + 'M';
  } else if (viewsCount >= 1000) {
    viewsFormatted = (viewsCount / 1000).toFixed(1) + 'K';
  }
  
  const categories = raw.categories ? raw.categories.split(';').map(c => c.trim()).filter(Boolean) : [];
  const tags = raw.tags ? raw.tags.split(';').map(t => t.trim()).filter(Boolean) : [];
  const actors = raw.actors ? raw.actors.split(';').map(a => a.trim()).filter(Boolean) : [];
  const screenshots = raw.screenshots ? raw.screenshots.split(';').filter(Boolean) : [];
  
  return {
    id: `${pageNum}-${index}`,
    title: raw.title || 'Untitled Video',
    thumbnailUrl: raw.thumbnail || '',
    thumbnail2Url: raw.thumbnail2,
    embedCode: raw.embed,
    embedUrl,
    duration: durationFormatted,
    durationSeconds,
    views: viewsFormatted,
    viewsCount,
    likes: parseInt(raw.likes) || 0,
    dislikes: parseInt(raw.dislikes) || 0,
    category: categories[0] || 'Uncategorized',
    categories,
    tags,
    actors,
    screenshots,
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export class VideoStorage implements IStorage {
  private dataDir: string;
  private totalPages: number = 0;
  private categoriesCache: Map<string, number> = new Map();
  private performersCache: Map<string, number> = new Map();
  private tagsCache: Map<string, number> = new Map();
  private initialized: boolean = false;
  private videosPerPage: number = 0;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.initialize();
  }

  private initialize() {
    try {
      const files = fs.readdirSync(this.dataDir);
      const jsonFiles = files.filter(f => f.startsWith('videos_page_') && f.endsWith('.json'));
      this.totalPages = jsonFiles.length;
      
      if (this.totalPages > 0) {
        const firstPagePath = path.join(this.dataDir, 'videos_page_1.json');
        if (fs.existsSync(firstPagePath)) {
          const data = JSON.parse(fs.readFileSync(firstPagePath, 'utf-8'));
          this.videosPerPage = Array.isArray(data) ? data.length : 0;
        }
      }
      
      this.buildMetadataCache();
      this.initialized = true;
      console.log(`VideoStorage initialized: ${this.totalPages} pages found`);
    } catch (error) {
      console.error('Failed to initialize VideoStorage:', error);
      this.totalPages = 0;
    }
  }

  private buildMetadataCache() {
    const pagesToSample = Math.min(50, this.totalPages);
    
    for (let i = 1; i <= pagesToSample; i++) {
      try {
        const filePath = path.join(this.dataDir, `videos_page_${i}.json`);
        if (!fs.existsSync(filePath)) continue;
        
        const data: RawVideoData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        for (const video of data) {
          if (video.categories) {
            const cats = video.categories.split(';').map(c => c.trim()).filter(Boolean);
            for (const cat of cats) {
              this.categoriesCache.set(cat, (this.categoriesCache.get(cat) || 0) + 1);
            }
          }
          
          if (video.actors) {
            const performers = video.actors.split(';').map(a => a.trim()).filter(Boolean);
            for (const performer of performers) {
              this.performersCache.set(performer, (this.performersCache.get(performer) || 0) + 1);
            }
          }
          
          if (video.tags) {
            const tagsList = video.tags.split(';').map(t => t.trim()).filter(Boolean);
            for (const tag of tagsList) {
              this.tagsCache.set(tag, (this.tagsCache.get(tag) || 0) + 1);
            }
          }
        }
      } catch (error) {
        console.error(`Error reading page ${i}:`, error);
      }
    }
  }

  private loadPage(pageNum: number): Video[] {
    try {
      const filePath = path.join(this.dataDir, `videos_page_${pageNum}.json`);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      
      const data: RawVideoData[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.map((raw, index) => parseVideoData(raw, pageNum, index));
    } catch (error) {
      console.error(`Error loading page ${pageNum}:`, error);
      return [];
    }
  }

  async getVideosPage(page: number): Promise<PaginatedVideos> {
    const validPage = Math.max(1, Math.min(page, this.totalPages));
    const videos = this.loadPage(validPage);
    
    return {
      videos,
      page: validPage,
      totalPages: this.totalPages,
      totalVideos: this.totalPages * this.videosPerPage,
      hasNext: validPage < this.totalPages,
      hasPrevious: validPage > 1,
    };
  }

  async getVideoById(pageNum: number, videoIndex: number): Promise<Video | undefined> {
    const videos = this.loadPage(pageNum);
    return videos[videoIndex];
  }

  async getVideoByGlobalId(globalId: string): Promise<Video | undefined> {
    const parts = globalId.split('-');
    if (parts.length !== 2) return undefined;
    
    const pageNum = parseInt(parts[0]);
    const videoIndex = parseInt(parts[1]);
    
    if (isNaN(pageNum) || isNaN(videoIndex)) return undefined;
    
    return this.getVideoById(pageNum, videoIndex);
  }

  async getCategories(): Promise<Category[]> {
    const iconMap: Record<string, string> = {
      'Amateur': 'camera',
      'Asian': 'globe',
      'Babe': 'star',
      'BBW': 'circle',
      'Big Ass': 'circle',
      'Big Tits': 'circle',
      'Blonde': 'sun',
      'Blowjob': 'circle',
      'Brunette': 'moon',
      'Creampie': 'circle',
      'Cumshot': 'circle',
      'Ebony': 'circle',
      'Fetish': 'zap',
      'Hardcore': 'flame',
      'HD': 'monitor',
      'Interracial': 'users',
      'Latina': 'globe',
      'Lesbian': 'heart',
      'MILF': 'star',
      'POV': 'eye',
      'Pornstar': 'star',
      'Public': 'globe',
      'Reality': 'video',
      'Redhead': 'flame',
      'Teen': 'user',
      'Threesome': 'users',
      'Toys': 'box',
      'Verified Models': 'check-circle',
      'Vintage': 'clock',
    };
    
    return Array.from(this.categoriesCache.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        icon: iconMap[name] || 'folder',
        count: count * Math.ceil(this.totalPages / 50),
      }));
  }

  async getPerformers(): Promise<Performer[]> {
    return Array.from(this.performersCache.entries())
      .filter(([name]) => name.length > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        videoCount: count * Math.ceil(this.totalPages / 50),
      }));
  }

  async getTags(): Promise<Tag[]> {
    return Array.from(this.tagsCache.entries())
      .filter(([name]) => name.length > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100)
      .map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        count: count * Math.ceil(this.totalPages / 50),
      }));
  }

  async searchVideos(query: string, page: number = 1): Promise<PaginatedVideos> {
    const lowerQuery = query.toLowerCase();
    const results: Video[] = [];
    const searchPages = Math.min(20, this.totalPages);
    
    for (let i = 1; i <= searchPages; i++) {
      const videos = this.loadPage(i);
      const matches = videos.filter(v => 
        v.title.toLowerCase().includes(lowerQuery) ||
        v.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
        v.categories.some(c => c.toLowerCase().includes(lowerQuery)) ||
        v.actors.some(a => a.toLowerCase().includes(lowerQuery))
      );
      results.push(...matches);
      
      if (results.length >= 100) break;
    }
    
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(results.length / itemsPerPage);
    
    return {
      videos: paginatedResults,
      page,
      totalPages,
      totalVideos: results.length,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getVideosByCategory(category: string, page: number = 1): Promise<PaginatedVideos> {
    const lowerCategory = category.toLowerCase();
    const results: Video[] = [];
    const searchPages = Math.min(30, this.totalPages);
    
    for (let i = 1; i <= searchPages; i++) {
      const videos = this.loadPage(i);
      const matches = videos.filter(v => 
        v.categories.some(c => c.toLowerCase() === lowerCategory)
      );
      results.push(...matches);
      
      if (results.length >= 200) break;
    }
    
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(results.length / itemsPerPage);
    
    return {
      videos: paginatedResults,
      page,
      totalPages,
      totalVideos: results.length,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getVideosByPerformer(performer: string, page: number = 1): Promise<PaginatedVideos> {
    const lowerPerformer = performer.toLowerCase();
    const results: Video[] = [];
    const searchPages = Math.min(30, this.totalPages);
    
    for (let i = 1; i <= searchPages; i++) {
      const videos = this.loadPage(i);
      const matches = videos.filter(v => 
        v.actors.some(a => a.toLowerCase().includes(lowerPerformer))
      );
      results.push(...matches);
      
      if (results.length >= 100) break;
    }
    
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(results.length / itemsPerPage);
    
    return {
      videos: paginatedResults,
      page,
      totalPages,
      totalVideos: results.length,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getVideosByTag(tag: string, page: number = 1): Promise<PaginatedVideos> {
    const lowerTag = tag.toLowerCase();
    const results: Video[] = [];
    const searchPages = Math.min(30, this.totalPages);
    
    for (let i = 1; i <= searchPages; i++) {
      const videos = this.loadPage(i);
      const matches = videos.filter(v => 
        v.tags.some(t => t.toLowerCase() === lowerTag)
      );
      results.push(...matches);
      
      if (results.length >= 200) break;
    }
    
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = results.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(results.length / itemsPerPage);
    
    return {
      videos: paginatedResults,
      page,
      totalPages,
      totalVideos: results.length,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  getTotalPages(): number {
    return this.totalPages;
  }

  getTotalVideos(): number {
    return this.totalPages * this.videosPerPage;
  }
}

export const storage = new VideoStorage();
