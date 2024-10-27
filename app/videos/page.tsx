"use client";

import { useState, useEffect } from "react";
import { api_url } from "../../constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

interface Video {
  id: string;
  title: string;
  // Add other video properties as needed
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { getToken } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(`${api_url}/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load videos. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mt-16">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Videos</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : videos.length > 0 ? (
          <ul className="space-y-4">
            {videos.map((video) => (
              <li key={video.id} className="bg-gray-800 shadow rounded-lg p-4">
                <h2 className="text-xl font-semibold text-white">
                  {video.title}
                </h2>
                {/* Add more video details here if needed */}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <p className="text-white text-xl">No videos available</p>
          </div>
        )}
      </div>
    </div>
  );
}
