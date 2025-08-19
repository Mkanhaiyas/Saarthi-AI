"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSaarthiContext } from "@/context/SaarthiContext";

export const useSidebarChats = () => {
  const [activeDropdownId, setActiveDropdownId] = useState(null); // Stores ID of chat whose dropdown is open
  const [editedTitle, setEditedTitle] = useState(""); // Stores edited chat title value
  const [editingChatId, setEditingChatId] = useState(null); // Tracks currently edited chat ID
  const [loading, setLoading] = useState(false); // Loading state for async actions
  const chatRef = useRef(null); // Ref to auto-focus the input when editing
  const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

  const { chats, setChats, selectedChat, setSelectedChat } =
    useSaarthiContext();

  useEffect(() => {
    fetchChats(); // Fetch chats on component mount
  }, []);

  useEffect(() => {
    // Auto-focus input when editing starts
    if (editingChatId && chatRef.current) {
      chatRef.current.focus();
    }
  }, [editingChatId]);

  // Fetch all chats from backend
  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/api/chats`);
      setChats(res.data.chats);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Create a new chat and add it to the list
  const createNewChat = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${backend_url}/api/chat`, {});
      setSelectedChat(res.data.chat);
      setChats((prev) => [res.data.chat, ...prev]);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Update chat title both locally and on the server
  const editChatTitle = async (chatId) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: editedTitle } : chat
      )
    );

    try {
      const res = await axios.patch(`${backend_url}/api/chat/${chatId}`, {
        title: editedTitle,
      });

      if (res?.data?.success) {
        setEditingChatId(null);
        setEditedTitle("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a chat from both frontend and backend
  const deleteChat = async (chatId) => {
    try {
      await axios.delete(`${backend_url}/api/chat/${chatId}`);
      setSelectedChat(null);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setActiveDropdownId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    chats,
    selectedChat,
    setSelectedChat,
    activeDropdownId,
    setActiveDropdownId,
    editingChatId,
    setEditingChatId,
    editedTitle,
    setEditedTitle,
    chatRef,
    loading,
    fetchChats,
    createNewChat,
    editChatTitle,
    deleteChat,
  };
};
