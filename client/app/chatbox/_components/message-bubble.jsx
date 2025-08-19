import React from "react";
import { formatDate } from "@/utils/importantFunc";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";

const MessageBubble = ({ message }) => {
  const isUser = message.role !== "assistant";

  return (
    <div
      className={`px-4 py-2 flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className="flex flex-col max-w-[93%] md:max-w-[75%]">
        {/* Timestamp */}
        <span
          className={`text-xs mb-1 ${
            isUser ? "text-right text-gray-400" : "text-left text-gray-500"
          }`}
        >
          {message?.createdAt && formatDate(message?.createdAt)}
        </span>

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words shadow-md ${
            isUser
              ? "bg-gradient-to-br from-[#d946ef] to-[#7c3aed] text-white rounded-br-none"
              : "bg-[#1f1f1f] text-[#d1d5db] rounded-bl-none"
          }`}
        >
          <div className="prose prose-sm max-w-none outfit text-inherit">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message?.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
