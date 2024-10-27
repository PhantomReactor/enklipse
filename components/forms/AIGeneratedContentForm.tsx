import React, { useState } from "react";
import { api_url } from "../../constants";

const AIGeneratedContentForm = () => {
  const [title, setTitle] = useState("");
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("alloy");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      title,
      script,
      voice,
    };

    try {
      const response = await fetch(`${api_url}/clip/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate video");
      }

      // Handle successful response
      console.log("Video generation request sent successfully");
      // You might want to add some user feedback here
    } catch (error) {
      console.error("Error generating video:", error);
      // You might want to add some error handling for the user here
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 text-white"
          placeholder="Enter video title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label
          htmlFor="script"
          className="block text-sm font-medium text-gray-300"
        >
          Script
        </label>
        <textarea
          id="script"
          name="script"
          rows={4}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 text-white"
          placeholder="Enter your script here..."
          value={script}
          onChange={(e) => setScript(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label
          htmlFor="style"
          className="block text-sm font-medium text-gray-300"
        >
          Video Style
        </label>
        <select
          id="style"
          name="style"
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50 text-white"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
        >
          <option>Cinematic</option>
          <option>Animated</option>
          <option>Documentary</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Generate Video
      </button>
    </form>
  );
};

export default AIGeneratedContentForm;
