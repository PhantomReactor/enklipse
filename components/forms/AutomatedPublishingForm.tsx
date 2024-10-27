import React from "react";

const AutomatedPublishingForm = () => {
  return (
    <form className="space-y-4">
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

export default AutomatedPublishingForm;
