import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api_url } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(30, "Title must not exceed 30 characters"),
  script: z.string().refine(
    (value) => {
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount >= 100 && wordCount <= 500;
    },
    {
      message: "Script must be between 100 and 500 words",
    }
  ),
  voice: z.string(),
});

type FormData = z.infer<typeof formSchema>;

const ScriptToVideoForm = () => {
  const { getToken } = useAuth();
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      script: "",
      voice: "alloy",
    },
  });

  const script = useWatch({
    control,
    name: "script",
  });

  const wordCount = script ? script.trim().split(/\s+/).length : 0;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const token = await getToken();
      console.log("Narrator: " + data.voice);
      const response = await fetch(`${api_url}/clip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          script: data.script,
          captionsRequired: true,
          narrator: data.voice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      const result = await response.json();
      console.log("Video generation successful:", result);

      router.push(`/generate/video/${result.clipId}`);
    } catch (error) {
      console.error("Error generating video:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate video. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const voices = [
    { id: "alloy", name: "Alloy" },
    { id: "echo", name: "Echo" },
    { id: "fable", name: "Fable" },
    { id: "onyx", name: "Onyx" },
    { id: "nova", name: "Nova" },
    { id: "shimmer", name: "Shimmer" },
  ];

  const router = useRouter();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-semibold text-gray-200 mb-2"
        >
          Title
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-gray-700 transition duration-200"
          placeholder="Enter the title of your script..."
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="script"
          className="block text-sm font-semibold text-gray-200 mb-2"
        >
          Script
        </label>
        <textarea
          {...register("script")}
          id="script"
          rows={10}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-gray-700 transition duration-200 resize-none"
          placeholder="Enter your script here..."
        ></textarea>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-emerald-400">
            Word count: {wordCount} / 500
          </p>
          {errors.script && (
            <p className="text-red-500 text-xs">{errors.script.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="voice"
          className="block text-sm font-semibold text-gray-200 mb-2"
        >
          Voice
        </label>
        <select
          {...register("voice")}
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-gray-700 transition duration-200"
        >
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 text-sm font-medium text-white bg-emerald-700 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Video"
        )}
      </button>
    </form>
  );
};

export default ScriptToVideoForm;
