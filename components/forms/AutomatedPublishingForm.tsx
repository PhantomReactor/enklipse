import React, { useState, useRef } from "react";
import { api_url, voices } from "../../constants";
import { Play, Pause, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";


const AutomatedPublishingForm = () => {
  const { toast } = useToast();
  const { getToken } = useAuth();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    publishToSocials: {
      instagram: false,
      tiktok: false,
      youtube: false,
    },
    publishTime: "",
    script: "",
    narrator: "alloy",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedVoiceObj = voices.find((v) => v.id === formData.narrator);
      const token = await getToken();

      const socialPlatforms = Object.entries(formData.publishToSocials)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform[0].toUpperCase())
        .join('');

      const response = await fetch(`${api_url}/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          publishTo: socialPlatforms,
          text2SpeechProvider: selectedVoiceObj?.provider,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create series');
      }

      toast({
        title: "Success",
        description: "Series created successfully!",
      });
    } catch (error) {
      console.error('Error creating series:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create series",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('social-')) {
      const platform = name.replace('social-', '');
      setFormData(prev => ({
        ...prev,
        publishToSocials: {
          ...prev.publishToSocials,
          [platform]: (e.target as HTMLInputElement).checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const playVoiceSample = (voiceId: string) => {
    const voice = voices.find(v => v.id === voiceId);
    if (!voice?.sampleUrl) return;

    const audio = audioRefs.current[voiceId];
    if (audio) {
      if (isPlaying === voiceId) {
        audio.pause();
        setIsPlaying(null);
      } else {
        if (isPlaying && audioRefs.current[isPlaying]) {
          audioRefs.current[isPlaying]!.pause();
          audioRefs.current[isPlaying]!.currentTime = 0;
        }
        audio.play();
        setIsPlaying(voiceId);
      }
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(null);
  };

  const inputClassName = "mt-1 block w-full rounded-xl bg-gray-800 border-gray-600 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 text-white px-4 py-3";
  const labelClassName = "block text-sm font-semibold text-gray-200 mb-2";

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Title Input */}
      <div>
        <label htmlFor="title" className={labelClassName}>Series Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClassName}
          required
        />
      </div>

      {/* Topic Input */}
      <div>
        <label htmlFor="topic" className={labelClassName}>Topic</label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className={inputClassName}
          required
        />
      </div>

      {/* Publish to Socials Checkboxes */}
      <div className="space-y-4">
        <label className={labelClassName}>Publish to Platforms</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'instagram',
              label: 'Instagram',
              icon: '📸'
            },
            {
              id: 'tiktok',
              label: 'TikTok',
              icon: '🎵'
            },
            {
              id: 'youtube',
              label: 'YouTube',
              icon: '▶️'
            }
          ].map(platform => (
            <div
              key={platform.id}
              className={`
                relative flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                ${formData.publishToSocials[platform.id as keyof typeof formData.publishToSocials]
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'}
              `}
              onClick={() => {
                const e = {
                  target: {
                    name: `social-${platform.id}`,
                    checked: !formData.publishToSocials[platform.id as keyof typeof formData.publishToSocials]
                  }
                } as React.ChangeEvent<HTMLInputElement>;
                handleChange(e);
              }}
            >
              <input
                type="checkbox"
                id={`social-${platform.id}`}
                name={`social-${platform.id}`}
                checked={formData.publishToSocials[platform.id as keyof typeof formData.publishToSocials]}
                onChange={handleChange}
                className="sr-only" // Hide the actual checkbox
              />
              <span className="mr-3 text-xl">{platform.icon}</span>
              <label
                htmlFor={`social-${platform.id}`}
                className="flex-grow text-sm font-medium text-gray-200 cursor-pointer"
              >
                {platform.label}
              </label>
              {formData.publishToSocials[platform.id as keyof typeof formData.publishToSocials] && (
                <svg
                  className="h-5 w-5 text-emerald-500 absolute right-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Publish Time Input */}
      <div>
        <label htmlFor="publishTime" className={labelClassName}>Daily Publish Time</label>
        <input
          type="time"
          id="publishTime"
          name="publishTime"
          value={formData.publishTime}
          onChange={handleChange}
          className={`${inputClassName} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
          required
          step="1800"
        />
        <span className="text-sm text-gray-400 mt-1 block">
          {formData.publishTime && new Date(`2000/01/01 ${formData.publishTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </span>
      </div>

      {/* Script Template */}
      <div>
        <label htmlFor="script" className={labelClassName}>Script Template</label>
        <textarea
          id="script"
          name="script"
          rows={4}
          value={formData.script}
          onChange={handleChange}
          className={`${inputClassName} resize-none`}
          placeholder="Enter your script template here..."
        />
      </div>

      {/* Narrator Selection */}
      <div>
        <label htmlFor="narrator" className={labelClassName}>Narrator Voice</label>
        <div className="relative">
          <select
            id="narrator"
            name="narrator"
            value={formData.narrator}
            onChange={handleChange}
            className={`${inputClassName} appearance-none pr-20`}
          >
            {voices.map((voice) => (
              <option key={voice.id} value={voice.id}>{voice.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <button
            type="button"
            onClick={() => playVoiceSample(formData.narrator)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {isPlaying === formData.narrator ? (
              <Pause className="h-4 w-4 text-emerald-400" />
            ) : (
              <Play className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>

        {voices.map((voice) => (
          <audio
            key={voice.id}
            ref={el => { audioRefs.current[voice.id] = el }}
            src={voice.sampleUrl}
            onEnded={handleAudioEnd}
          />
        ))}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 text-sm font-medium text-white bg-emerald-700 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition duration-300 ease-in-out transform hover:-translate-y-1"
      >
        Create Series
      </button>
    </form>
  );
};

export default AutomatedPublishingForm;
