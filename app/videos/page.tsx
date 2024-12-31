"use client";

import { useState, useEffect } from "react";
import { api_url } from "../../constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { ClipResponse, PagedResponse } from "@/types/types";
import Link from "next/link";

export default function VideosPage() {
  const [clips, setClips] = useState<ClipResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { getToken } = useAuth();

  const fetchVideos = async (page: number) => {
    if (isLoading) return;
    setIsLoading(true);

    if (page > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    try {
      const token = await getToken();
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to view your videos.",
        });
        return;
      }

      const response = await fetch(
        `${api_url}/clips?pageNumber=${page}&pageSize=6`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PagedResponse = await response.json();
      setClips(prevClips => page === 0 ? data.clips : [...prevClips, ...data.clips]);
      setHasMore(page < data.totalPages - 1);

    } catch (error) {
      console.error("Error fetching videos:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

      toast({
        variant: "destructive",
        title: "Error loading videos",
        description: errorMessage.includes('401')
          ? "Your session has expired. Please sign in again."
          : errorMessage.includes('404')
            ? "Could not find your videos."
            : "Failed to load videos. Please try again later.",
      });

      setClips([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scroll events with debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (!hasMore || isLoading) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 800;

      if (scrollPosition >= threshold) {
        // Clear any existing timeout
        clearTimeout(timeoutId);

        // Set a new timeout
        timeoutId = setTimeout(() => {
          setPageNumber(prev => prev + 1);
        }, 100); // 100ms debounce
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [hasMore, isLoading]);

  // Fetch videos when page number changes
  useEffect(() => {
    fetchVideos(pageNumber);
  }, [pageNumber]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-6xl mt-16">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Videos</h1>

        {isLoading && clips.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
          </div>
        ) : clips.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 rounded-xl">
              {clips.map((clip) => (
                <Link
                  key={clip.clipId}
                  href={`/generate/video/${clip.clipId}`}
                  className="bg-gray-800/50 shadow rounded-xl p-6 cursor-pointer hover:bg-gray-700/50 transition-colors h-[350px]"
                >
                  <div className="aspect-video mb-4">
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-sans text-white truncate">
                    {clip.title}
                  </h2>
                </Link>
              ))}
              <Link
                href="/generate"
                className="bg-gray-800/50 shadow rounded-xl p-6 cursor-pointer hover:bg-gray-700/50 transition-colors h-[350px] flex flex-col items-center justify-center"
              >
                <div className="rounded-full bg-emerald-500/10 p-4 mb-4">
                  <Plus className="text-emerald-500 h-8 w-8" />
                </div>
                <h2 className="text-xl font-sans text-white">Create Video</h2>
              </Link>
            </ul>
            {isLoading && (
              <div className="flex justify-center items-center h-24 mt-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
            <p className="text-white text-xl">No videos available</p>
          </div>
        )}
      </div>
    </div>
  );
}
