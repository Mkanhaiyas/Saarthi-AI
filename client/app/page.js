"use client";
import { useState } from "react";
import ChatBox from "./chatbox/page";
import SideBar from "./sidebar/page";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] font-[outfit]">
      <main className="flex md:flex-row flex-col-reverse md:h-[100vh] w-full h-screen overflow-hidden md:py-6 md:px-20 px-0 gap-4 relative">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-0 h-full w-[80%] max-w-[320px] rounded-xl bg-[#1e1e1e] z-50 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0 md:flex md:w-[360px]
          `}
        >
          <SideBar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* Chatbox area */}
        <div className="flex-1 overflow-hidden z-0">
          <ChatBox setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />
        )}
      </main>
    </div>
  );
}
