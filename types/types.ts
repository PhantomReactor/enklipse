export type ClipResponse = {
  clipId: string;
  title: string;
  script: string;
  segments: Segment[];
  clipUrl: string;
  status: string;
  thumbnailUrl: string;
  message?: string;
};

type Segment = {
  segId: number;
  section: string;
  imagePrompt: string;
  imageUrl: string;
  audioUrl: string;
  subtitlesUrl: string;
};

export type ConnectionRequest = {
  authCode: string;
  type: "G" | "I" | "T"; // G for Google/YouTube, I for Instagram, T for TikTok
};

export type PagedResponse = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalClips: number;
  clips: ClipResponse[];
};

export type ClipStatusEvent = {
  percentage: number;
  message: string;
  clipUrl?: string;
  script?: string;
  status?: "I" | "S" | "E"; // In Progress, Success, Error
  error?: string;
};
