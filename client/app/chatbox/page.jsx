"use client";
import React, { useEffect, useRef } from "react";
import { FaBahai } from "react-icons/fa";
import { useSaarthiContext } from "@/context/SaarthiContext";
import { useChatMessages } from "@/hooks/useChatMessages";
import MessageBubble from "./_components/message-bubble";
import ChatInput from "./_components/chat-input";

const ChatBox = ({ setSidebarOpen }) => {
  const { selectedChat } = useSaarthiContext();

  const { messages, query, setQuery, sendMessage, streaming, typing } =
    useChatMessages();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex flex-col w-full h-full bg-[#0f0f0f]/70 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl text-white">
      <div className="fixed top-0 left-0 right-0 z-50 flex rounded-tl-xl rounded-tr-xl justify-between items-center px-6 py-5 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            SaarthiAI
          </h1>
          <div className="text-sm mt-1 text-pink-400">
            {streaming ? <p>Streaming...</p> : typing ? <p>Typing...</p> : null}
          </div>
        </div>

        <div className="md:hidden flex items-center text-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl"
            aria-label="Open Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="flex-1 overflow-y-auto pt-[96px] px-4 py-4 custom-scrollbar">
        {selectedChat ? (
          <>
            {messages.map((message, i) => (
              <MessageBubble key={i} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            {/* Glowing Krishna Image */}
            <div className="relative mb-4">
              <div className="absolute inset-10 blur-2xl rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 opacity-50 w-[200px] h-[200px] z-0" />
              <img
                src="lord2.png"
                alt="Lord Krishna"
                className="relative z-10 w-72 object-contain"
              />
            </div>

            <span className="text-2xl font-semibold text-pink-500 flex items-center gap-2">
              Welcome to SaarthiAI <FaBahai className="animate-spin" />
            </span>
            <p className="text-gray-400 mt-2">
              Your AI Saarthi, here to guide you through the wisdom of the Gita.
            </p>
          </div>
        )}
      </div>

      {/* CHAT INPUT */}
      {selectedChat && (
        <ChatInput
          query={query}
          setQuery={setQuery}
          sendMessage={sendMessage}
          streaming={streaming}
        />
      )}
    </div>
  );
};

export default ChatBox;
