"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ClipResponse } from "@/types/types";
import {
    faYoutube,
    faTiktok,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { api_url } from "@/constants";

const VideoPage = () => {
    const router = useRouter();
    const { getToken } = useAuth();
    const params = useParams();
    const [clipData, setClipData] = useState<ClipResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClipData = async () => {
            try {
                const clipId = params.clip;
                const token = await getToken();
                const response = await fetch(`${api_url}/clip/${clipId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data: ClipResponse = await response.json();
                setClipData(data);
            } catch (error) {
                console.error('Error fetching clip data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClipData();
    }, [params.clip, getToken]);

    const title = clipData?.title || '';
    const videoUrl = clipData?.clipUrl || '';

    const handlePublishToYoutube = () => {
        router.push(`/publish-to-youtube?videoUrl=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
    };

    const handlePublishToTikTok = () => {
        router.push(`/publish-to-tiktok?videoUrl=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
    };

    const handlePublishToInstagram = () => {
        router.push(`/publish-to-instagram?videoUrl=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mt-8 sm:mt-16">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-white">{title}</h2>
                </div>
                {/* Moved buttons above the video */}
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
                            onClick={handlePublishToTikTok}
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
                        {isLoading || clipData?.status === 'IP' ? (
                            <div className="text-center text-gray-400">
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="animate-spin text-4xl mb-4"
                                />
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
                {/* Dummy script section */}
                <div className="max-w-3xl mx-auto mt-4 sm:mt-8 p-2 sm:p-4 bg-gray-800 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Video Script</h3>
                    <p className="text-sm sm:text-base text-gray-300">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoPage;
