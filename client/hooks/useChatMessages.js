"use client";
import { useState, useEffect, useRef } from "react";
import { useSaarthiContext } from "@/context/SaarthiContext";
import axios from "axios";

export const useChatMessages = () => {
  const { setChats, selectedChat } = useSaarthiContext();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingIndicatorId = useRef(null);
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch messages when a chat is selected
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  // Typing indicator with debounce logic
  useEffect(() => {
    if (!query.trim()) {
      setTyping(false);
      if (typingIndicatorId.current) {
        clearTimeout(typingIndicatorId.current);
        typingIndicatorId.current = null;
      }
      return;
    }

    setTyping(true);
    const timeoutId = setTimeout(() => {
      setTyping(false);
    }, 2000);
    typingIndicatorId.current = timeoutId;

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Fetch messages from database
  const fetchMessages = async () => {
    if (!selectedChat) return;
    const chatId = selectedChat.id;
    try {
      const res = await axios.get(`${backend_url}/api/chat/${chatId}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("fetchMessages", err);
    }
  };

  // send message to Saarthi AI
  const sendMessage = async () => {
    if (!selectedChat || !query.trim()) return;

    if (typingIndicatorId.current) {
      clearTimeout(typingIndicatorId.current);
      setTyping(false);
    }

    const chatId = selectedChat.id;
    setQuery("");

    let assistantMsg = {
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      { role: "user", content: query, createdAt: new Date().toISOString() },
      assistantMsg,
    ]);

    try {
      const res = await fetch(
        `${backend_url}/api/chat/${chatId}/message/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: query }),
        }
      );

      const decoder = new TextDecoder("utf-8", { fatal: false });
      const reader = res.body?.getReader();

      let { done, value } = await reader.read();
      setStreaming(true);

      while (!done) {
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const parts = chunk.split("data: ").filter(Boolean);

        for (let part of parts) {
          if (part.includes("[DONE]")) {
            setStreaming(false);
            break;
          }
          const cleanedPart = part.replace(/\n\n$/, "");
          assistantMsg.content += cleanedPart;
          setMessages((prev) => prev.slice(0, -1).concat(assistantMsg));
        }
        ({ value, done } = await reader.read());
      }

      setStreaming(false);
    } catch (err) {
      console.error("sendMessage error", err);
      setStreaming(false);
    }
  };

  return {
    messages,
    query,
    setQuery,
    sendMessage,
    streaming,
    typing,
  };
};
