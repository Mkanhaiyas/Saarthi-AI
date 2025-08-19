import { formatDate, formatedTitle } from "@/utils/importantFunc";
import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import DropDownMenu from "./drop-down-menu";

const ChatItem = ({
  chat,
  isSelected,
  editTitle,
  editedTitle,
  setEditedTitle,
  chatRef,
  onClick,
  onDropdownToggle,
  isDropdownOpen,
  onEdit,
  onDelete,
  onEditSubmit,
}) => {
  console.log(chat);
  return (
    <div
      onClick={onClick}
      className={`group w-full px-3 py-2 rounded-md flex items-center justify-between cursor-pointer transition-colors duration-200 
        ${isSelected ? "bg-[#2e2e2e]" : "hover:bg-[#1a1a1a]"}`}
    >
      {/* Left: avatar + title */}
      <div className="flex items-center gap-3 w-[95%] md:w-[85%] overflow-hidden">
        {/* Avatar */}
        <div className="min-w-[36px] min-h-[36px] bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white">
          <img
            src="lord2.png"
            alt="Lord Krishna"
            className="relative z-10 w-10 object-contain"
          />
        </div>

        {/* Title and Date */}
        <div className="flex flex-col justify-center overflow-hidden">
          {editTitle ? (
            <input
              ref={chatRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onEditSubmit()}
              className="text-sm text-white bg-transparent border-b border-pink-500 focus:outline-none caret-pink-500 truncate"
              placeholder="Edit title..."
            />
          ) : (
            <span className="text-sm font-medium text-white truncate">
              {formatedTitle(chat?.title)}
            </span>
          )}

          <span className="text-xs text-gray-400">
            {formatDate(chat?.created_at).trim()}
          </span>
        </div>
      </div>

      {/* More options button */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDropdownToggle();
          }}
          className="p-1 rounded-full text-gray-300 hover:bg-white/10"
        >
          <FiMoreVertical size={18} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-8 right-0 z-20">
            <DropDownMenu onEditClick={onEdit} onDeleteClick={onDelete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
