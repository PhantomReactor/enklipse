"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { ClipResponse, ClipStatusEvent } from "@/types/types";
import {
    faYoutube,
    faTiktok,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { api_url } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { encryptAES } from "@/utils/encryption";
import { Loader2 } from "lucide-react";

const VideoPage = () => {
    const router = useRouter();
    const { getToken, userId } = useAuth();
    const params = useParams();
    const [clipData, setClipData] = useState<ClipResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [progress, setProgress] = useState({ percentage: 0, message: '' });
    const [isSSELoading, setIsSSELoading] = useState(false);
    const [eventSource, setEventSource] = useState<EventSource | null>(null);

    useEffect(() => {
        fetchClipData();

        // Cleanup function
        return () => {
            if (eventSource) {
                console.log('Cleaning up SSE connection');
                eventSource.close();
            }
        };
    }, []);  // Keep empty dependency array

    const fetchClipData = async () => {
        try {
            const clipId = params.clip;
            const token = await getToken();
            const response = await fetch(`${api_url}/clips/${clipId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorResp = await response.json();
                throw new Error(errorResp.message);
            }
            const data: ClipResponse = await response.json();
            setClipData(data);

            if (data.status === 'I') {
                setIsSSELoading(true);
                setupSSE();
            } else {
                if (data.status === 'E') {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Video generation failed. Please try again.",
                    });
                }
                setIsLoading(false);
            }
        } catch (error: any) {
            console.error('Error fetching clip data:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to fetch video data.",
            });
            setIsLoading(false);
        }
    };

    const setupSSE = async () => {
        // Close any existing connection
        if (eventSource) {
            eventSource.close();
        }

        if (!userId) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User authentication failed. Please try logging in again.",
            });
            return;
        }

        try {
            const clipId = params.clip;
            const encryptedUserId = encryptAES(userId);
            const encodedToken = encodeURIComponent(encryptedUserId);
            const newEventSource = new EventSource(
                `${api_url}/clip-status/${clipId}?token=${encodedToken}`
            );

            // Store the EventSource instance
            setEventSource(newEventSource);

            newEventSource.onopen = (event) => {
                console.log('SSE Connection opened');
            };

            newEventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                newEventSource.close();
                setIsSSELoading(false);

                // Only show toast if component is still mounted
                toast({
                    variant: "destructive",
                    title: "Connection Error",
                    description: "Attempting to reconnect...",
                });

                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (clipData?.status === 'I') {  // Only reconnect if still in progress
                        setupSSE();
                    }
                }, 5000);
            };

            newEventSource.addEventListener('clip-status', (event) => {
                console.log('Received clip-status event:', event.data);
                try {
                    const data = JSON.parse(event.data) as ClipStatusEvent;
                    setProgress({
                        percentage: data.percentage,
                        message: data.message
                    });

                    if (data.percentage === 100 || data.status === 'S') {
                        newEventSource.close();
                        setIsSSELoading(false);
                        setClipData(prev => ({
                            ...prev!,
                            status: 'S',
                            clipUrl: data.clipUrl!,
                            script: data.script!
                        }));
                        setIsLoading(false);
                    }

                    if (data.status === 'E') {
                        newEventSource.close();
                        setIsSSELoading(false);
                        setClipData(prev => ({
                            ...prev!,
                            status: 'E'
                        }));
                        setIsLoading(false);
                        toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Video generation failed. Please try again.",
                        });
                    }
                } catch (error) {
                    console.error('Error parsing SSE data:', error);
                }
            });

        } catch (error) {
            console.error('Setup SSE Error:', error);
            setIsSSELoading(false);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to establish connection with the server.",
            });
        }
    };

    const title = clipData?.title || '';
    const videoUrl = clipData?.clipUrl || '';
    const script = clipData?.script || '';

    const handlePublishToYoutube = async () => {
        console.log("Publishing to YouTube");
        try {
            const token = await getToken();
            if (!token) {
                throw new Error('No authentication token available');
            }

            const json = {
                connectionTypes: ['Y'],
                clipId: params.clip
            };
            console.log("Request payload:", json);

            const response = await fetch(`${api_url}/connections/publish`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            });

            if (!response.ok) {
                const errorResp = await response.json();
                throw new Error(errorResp.message);
            }

            toast({
                title: "Success",
                description: "Video published to YouTube successfully",
            });
        } catch (error: any) {
            console.error('Error publishing to YouTube:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to publish video to YouTube. Please try again.",
            });
        }
    };

    const handlePublishToTikTok = () => {
        router.push(`/publish-to-tiktok?videoUrl=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
    };

    const handlePublishToInstagram = () => {
        router.push(`/publish-to-instagram?videoUrl=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {isLoading ? (
                <div className="flex flex-col justify-center items-center min-h-[70vh]">
                    {isSSELoading ? (
                        <div className="text-center text-gray-400 w-full max-w-md">
                            <div className="w-full bg-gray-700 h-4 mb-4">
                                <div
                                    className="bg-green-500 h-4 transition-all duration-300 ease-in-out"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                            <p>Loading... {progress.percentage}%</p>
                            <p className="text-sm mt-2">{progress.message}</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <p className="mt-2">Loading video data...</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-8 sm:mt-16">
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                    </div>
                    <div className="flex flex-col items-center mb-4 sm:mb-8">
                        <p className="text-gray-400 text-sm mb-2">Publish to:</p>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <button
                                onClick={handlePublishToYoutube}
                                className="text-red-500 hover:text-red-600 px-3 py-2 rounded-md transition-colors flex items-center text-sm sm:text-base"
                                title="Publish to YouTube"
                            >
                                <FontAwesomeIcon icon={faYoutube} className="mr-2 text-xl" />
                                <span>YouTube</span>
                            </button>
                            <button
                                onClick={() => handlePublishToTikTok()}
                                className="text-cyan-400 hover:text-cyan-500 px-3 py-2 rounded-md transition-colors flex items-center text-sm sm:text-base"
                                title="Publish to TikTok"
                            >
                                <FontAwesomeIcon icon={faTiktok} className="mr-2 text-xl" />
                                <span>TikTok</span>
                            </button>
                            <button
                                onClick={handlePublishToInstagram}
                                className="text-pink-500 hover:text-pink-600 px-3 py-2 rounded-md transition-colors flex items-center text-sm sm:text-base"
                                title="Publish to Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} className="mr-2 text-xl" />
                                <span>Instagram</span>
                            </button>
                            <a
                                href={videoUrl}
                                download
                                className="text-green-500 hover:text-green-600 px-3 py-2 rounded-md transition-colors flex items-center text-sm sm:text-base"
                                title="Download video"
                            >
                                <FontAwesomeIcon icon={faDownload} className="mr-2 text-xl" />
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto mt-4 sm:mt-8">
                        <div className="aspect-w-16 aspect-h-9 sm:aspect-none sm:h-[400px] h-[250px] flex justify-center items-center">
                            {clipData?.status === 'I' ? (
                                <div className="text-center text-gray-400">
                                    <p>Generating your video...</p>
                                </div>
                            ) : clipData?.status === 'S' ? (
                                <video
                                    src={clipData.clipUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p>Error loading video</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 p-2 sm:p-4 bg-gray-800 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-2">Video Script</h3>
                        <p className="text-sm sm:text-base text-gray-300">
                            {script}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPage;
