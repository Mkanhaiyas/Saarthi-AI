import React from "react";
import { FaStop } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

const ChatInput = ({ query, setQuery, sendMessage, streaming }) => {
  return (
    <div className="px-4 pb-5 bg-transparent rounded-bl-xl rounded-br-xl backdrop-blur-lg w-full">
      <div className="flex items-center gap-3 bg-[#1e1e1e] px-6 py-2 border border-white/20 rounded-full shadow-md">
        {/* Input Field */}
        <input
          type="text"
          value={query}
          placeholder="Send a message..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm md:text-base focus:outline-none"
        />

        {/* Action Button (Send or stream) */}
        {streaming ? (
          <button className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition">
            <FaStop className="text-white text-sm" />
          </button>
        ) : (
          <button
            onClick={sendMessage}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d946ef] to-[#7c3aed] hover:opacity-90 flex items-center justify-center transition shadow-lg"
          >
            <IoMdSend className="text-white text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
