import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

const SearchableMemberSelect = ({
  members = [],
  value,
  onChange,
  placeholder = "Select Member",
  variant = "portal", // "portal" or "admin"
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedMember = members.find((m) => String(m.id) === String(value));

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
    const code = (m.memberCode || "").toLowerCase();
    const company = (m.companyName || "").toLowerCase();
    return fullName.includes(query) || code.includes(query) || company.includes(query);
  });

  const isPortal = variant === "portal";

  const buttonClasses = isPortal
    ? "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white flex items-center justify-between outline-none focus:border-[#0C831F] transition text-left"
    : "w-full bg-[#162040] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white flex items-center justify-between outline-none focus:border-blue-500 transition text-left";

  const dropdownClasses = isPortal
    ? "absolute z-50 mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
    : "absolute z-50 mt-1 w-full bg-[#0f1b3d] border border-white/10 rounded-xl shadow-2xl overflow-hidden";

  const searchBoxClasses = isPortal
    ? "w-full bg-zinc-950 border-b border-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none"
    : "w-full bg-[#162040] border-b border-white/10 px-3 py-2 text-sm text-white placeholder-[#6b7ea3] outline-none";

  const optionHoverClasses = isPortal
    ? "hover:bg-zinc-800 text-zinc-300 hover:text-white"
    : "hover:bg-white/10 text-[#a8b8d4] hover:text-white";

  const selectedOptionClasses = isPortal
    ? "bg-[#0C831F]/20 text-[#0C831F] font-semibold"
    : "bg-blue-600/20 text-blue-400 font-semibold";

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Hidden input for HTML form validation if required */}
      {required && (
        <input
          type="text"
          value={value || ""}
          onChange={() => {}}
          required
          className="sr-only"
          tabIndex={-1}
        />
      )}

      {/* Select Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className="truncate">
          {selectedMember ? (
            <span>
              {selectedMember.firstName} {selectedMember.lastName || ""}{" "}
              <span className={isPortal ? "text-zinc-500 text-xs" : "text-[#6b7ea3] text-xs font-mono"}>
                ({selectedMember.memberCode})
              </span>
            </span>
          ) : (
            <span className={isPortal ? "text-zinc-500" : "text-[#6b7ea3]"}>
              {placeholder}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${isPortal ? "text-zinc-400" : "text-[#6b7ea3]"}`}
        />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className={dropdownClasses}>
          {/* Search Input Bar */}
          <div className="relative flex items-center px-2">
            <Search
              size={15}
              className={`ml-2 shrink-0 ${isPortal ? "text-zinc-500" : "text-[#6b7ea3]"}`}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, code or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchBoxClasses}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 space-y-0.5">
            {filteredMembers.length === 0 ? (
              <div className={`p-3 text-xs text-center ${isPortal ? "text-zinc-500" : "text-[#6b7ea3]"}`}>
                No members found
              </div>
            ) : (
              filteredMembers.map((m) => {
                const isSelected = String(m.id) === String(value);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.id);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition ${
                      isSelected ? selectedOptionClasses : optionHoverClasses
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-medium">
                        {m.firstName} {m.lastName || ""}
                      </div>
                      <div className={`text-xs ${isPortal ? "text-zinc-500" : "text-[#6b7ea3]"}`}>
                        {m.memberCode} {m.companyName ? `• ${m.companyName}` : ""}
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableMemberSelect;
