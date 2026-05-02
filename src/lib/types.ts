export interface Wallpaper {
  id: number;
  r2_key: string;
  url: string;
  thumbnail_url: string | null;
  title: string;
  tags: string;
  prompt: string;
  image_hash: string | null;
  width: number;
  height: number;
  file_size: number;
  status: string;
  view_count: number;
  download_count: number;
  is_featured: number;
  created_at: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    list: Wallpaper[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SingleWallpaperResponse {
  success: boolean;
  data: Wallpaper;
}
