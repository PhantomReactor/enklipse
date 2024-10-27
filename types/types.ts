export interface ClipResponse {
  clipId: string;
  title: string;
  script: string;
  segments: Segment[];
  clipUrl: string;
  status: string;
}

interface Segment {
  segId: number;
  section: string;
  imagePrompt: string;
  imageUrl: string;
  audioUrl: string;
  subtitlesUrl: string;
}
