import React from "react";
import { MdDelete } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";

const DropDownMenu = ({ onEditClick, onDeleteClick }) => {
  return (
    <div className="absolute top-2 -right-2 z-30 min-w-[140px] bg-[#222] text-white rounded-md shadow-xl border border-[#3a3a3a] p-1 text-sm before:content-[''] before:absolute before:w-3 before:h-3 before:bg-[#222] before:rotate-45 before:-top-1.5 before:right-4 before:border before:border-[#3a3a3a] before:z-[-1]">
      <button
        type="button"
        onClick={onEditClick}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#333] transition"
      >
        <RiEditCircleFill style={{ color: "#fb64b6", fontSize: "1.2rem" }} />
        <span className="text-[#ffc0cb]">Edit title</span>
      </button>

      <button
        type="button"
        onClick={onDeleteClick}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md  text-[#ffc0cb] hover:bg-[#333] transition"
      >
        <MdDelete style={{ color: "#fb64b6", fontSize: "1.2rem" }} />
        <span>Delete chat</span>
      </button>
    </div>
  );
};

export default DropDownMenu;
