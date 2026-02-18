import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface ComboboxItem {
  id: string;
  label: string;
  subLabel?: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

const Combobox: React.FC<ComboboxProps> = ({
  items,
  value,
  onChange,
  placeholder = "Select item...",
  label,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === value),
    [items, value],
  );

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subLabel?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [items, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (itemId: string) => {
    onChange(itemId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div
        className={`relative flex items-center w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
          error ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`block truncate ${!selectedItem ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-gray-200"}`}
        >
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className="ml-auto text-gray-400 dark:text-gray-500"
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white dark:bg-gray-700 shadow-lg border border-gray-200 dark:border-gray-600">
          <div className="p-2 border-b border-gray-100 dark:border-gray-600 flex items-center gap-2">
            <Search size={16} className="text-gray-400 dark:text-gray-500" />
            <input
              autoFocus
              className="w-full text-sm outline-none border-none focus:ring-0 bg-transparent dark:text-gray-200 dark:placeholder:text-gray-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {filteredItems.length === 0 ? (
              <li className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center italic">
                No items found
              </li>
            ) : (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                    item.id === value
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item.id);
                  }}
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    {item.subLabel && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.subLabel}
                      </div>
                    )}
                  </div>
                  {item.id === value && (
                    <Check
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Combobox;
