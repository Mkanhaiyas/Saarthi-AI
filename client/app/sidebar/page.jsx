"use client";

import React from "react";
import { FaBahai } from "react-icons/fa";
import ChatItem from "./_components/chat-item";
import { useSidebarChats } from "@/hooks/useSidebarChats";

const SideBar = () => {
  const {
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
    createNewChat,
    editChatTitle,
    deleteChat,
  } = useSidebarChats();

  return (
    <div
      className="flex flex-col w-full h-full md:max-w-[320px] p-4 bg-[#0f0f0f]/80
                 backdrop-blur-lg rounded-none md:rounded-xl text-white space-y-4 border border-white/10 shadow-lg"
    >
      {/* New Chat button */}
      <div className="pt-2">
        <button
          onClick={createNewChat}
          type="button"
          className="w-full py-2 rounded-xl font-semibold bg-gradient-to-br from-pink-500 to-purple-600 
                     text-white hover:opacity-90 transition-all duration-300"
        >
          {loading ? (
            <span className="animate-spin flex justify-center">
              <FaBahai size={20} />
            </span>
          ) : (
            "New Chat"
          )}
        </button>
      </div>

      {/* Title */}
      <h2 className="text-lg font-medium text-pink-400 px-1">Chats History</h2>

      {/* Chat list */}
      <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
        <ul className="space-y-2">
          {chats?.map((chat, i) => (
            <ChatItem
              key={i}
              chat={chat}
              isSelected={selectedChat?.id === chat?.id}
              editTitle={editingChatId === chat?.id}
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              chatRef={chatRef}
              onClick={() => setSelectedChat(chat)}
              onDropdownToggle={() =>
                setActiveDropdownId((prev) =>
                  prev === chat?.id ? null : chat?.id
                )
              }
              isDropdownOpen={activeDropdownId === chat?.id}
              onEdit={() => {
                setEditingChatId(chat?.id);
                setActiveDropdownId(null);
              }}
              onDelete={() => deleteChat(chat.id)}
              onEditSubmit={() => editChatTitle(chat.id)}
            />
          ))}
        </ul>
      </div>

      {/* Click outside to close dropdown */}
      <div
        onClick={() => setActiveDropdownId(null)}
        className={`${
          activeDropdownId ? "pointer-events-auto" : "pointer-events-none"
        } absolute inset-0 bg-transparent z-0`}
      />
    </div>
  );
};

export default SideBar;
