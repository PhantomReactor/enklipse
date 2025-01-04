import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { useAuth, useSession } from '@clerk/nextjs';
import { encryptAES } from '@/utils/encryption';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { api_url } from '@/constants';

interface ConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
    className?: string;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose, buttonRef, className }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { userId } = useAuth();
    const { session } = useSession();
    const { toast } = useToast();
    const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchConnections = async () => {
            if (!isOpen || !session) return;

            try {
                const trackingId = uuidv4();
                const response = await fetch(`${api_url}/connections`, {
                    headers: {
                        'Authorization': `Bearer ${await session.getToken()}`,
                        'X-Tracking-ID': trackingId
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch connections');
                }

                const platforms = await response.text();
                setConnectedPlatforms(new Set(platforms.split('')));
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch connected platforms",
                    variant: "destructive",
                });
            }
        };

        fetchConnections();
    }, [isOpen, session, toast]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, buttonRef]);

    // Add new function to calculate position
    const calculatePosition = () => {
        const buttonRect = buttonRef.current?.getBoundingClientRect();
        const modalWidth = 384; // w-96 = 24rem = 384px

        // Default desktop positioning
        let left = buttonRect ? buttonRect.left : 0;
        const top = buttonRect ? buttonRect.bottom + 8 : 0;

        // Mobile adjustment
        if (window.innerWidth < 768) { // md breakpoint
            // Center the modal with a slight right offset to avoid left edge
            left = Math.max(16, Math.min(window.innerWidth - modalWidth - 16, left));
        }

        return { top, left };
    };

    if (!isOpen) return null;

    const { top, left } = calculatePosition();

    const handleYoutubeConnect = () => {
        const stateData = {
            userId: userId,
            redirectUrl: window.location.href
        };
        const encryptedState = encryptAES(JSON.stringify(stateData));

        const params = new URLSearchParams({
            scope: process.env.NEXT_PUBLIC_GOOGLE_SCOPE ?? '',
            access_type: 'offline',
            include_granted_scopes: 'true',
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI ?? '',
            response_type: 'code',
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
            state: encryptedState
        } as Record<string, string>);

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        window.location.href = authUrl;
    };

    return (
        <div
            ref={modalRef}
            className={`fixed z-50 animate-fadeIn ${className}`}
            style={{
                top: `${top}px`,
                left: `${left}px`,
                maxWidth: 'calc(100vw - 32px)', // Ensure 16px padding on both sides
            }}
        >
            <div className="bg-[#1a1a1a] backdrop-blur-sm rounded-xl p-6 w-96 max-w-full shadow-2xl border border-gray-700">
                {/* Refined arrow */}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl text-white font-semibold">Connect Your Socials</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700/50 rounded-full"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        disabled={connectedPlatforms.has('I')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 
                                 ${connectedPlatforms.has('I') ? 'bg-green-800 cursor-not-allowed opacity-80' : 'bg-gray-800 hover:bg-gray-700'}
                                 text-white group`}
                    >
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                            <span className="font-medium">
                                {connectedPlatforms.has('I') ? 'Connected to Instagram' : 'Connect Instagram'}
                            </span>
                        </div>
                        <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        onClick={handleYoutubeConnect}
                        disabled={connectedPlatforms.has('Y')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 
                                 ${connectedPlatforms.has('Y') ? 'bg-green-800 cursor-not-allowed opacity-80' : 'bg-gray-800 hover:bg-gray-700'}
                                 text-white group`}
                    >
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
                            <span className="font-medium">
                                {connectedPlatforms.has('Y') ? 'Connected to YouTube' : 'Connect YouTube'}
                            </span>
                        </div>
                        <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        disabled={connectedPlatforms.has('T')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 
                                 ${connectedPlatforms.has('T') ? 'bg-green-800 cursor-not-allowed opacity-80' : 'bg-gray-800 hover:bg-gray-700'}
                                 text-white group`}
                    >
                        <div className="flex items-center space-x-3">
                            <FontAwesomeIcon icon={faTiktok} className="w-6 h-6" />
                            <span className="font-medium">
                                {connectedPlatforms.has('T') ? 'Connected to TikTok' : 'Connect TikTok'}
                            </span>
                        </div>
                        <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectModal;
