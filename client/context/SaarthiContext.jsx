"use client";

import { createContext, useContext, useState } from "react";

const SaarthiContext = createContext();

export const SaarthiProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]); // List of chat objects from backend
  return (
    <SaarthiContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </SaarthiContext.Provider>
  );
};

export const useSaarthiContext = () => useContext(SaarthiContext);
