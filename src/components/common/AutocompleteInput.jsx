import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const AutocompleteInput = ({
    value,
    onChange,
    options = [],
    placeholder = 'Search...',
    label,
    required = false,
    onSelect,
    loading = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Filter options based on input value
    useEffect(() => {
        if (!value) {
            setFilteredOptions([]);
            setIsOpen(false);
            return;
        }

        const filtered = options.filter(option =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(filtered);
        setIsOpen(filtered.length > 0);
        setHighlightedIndex(-1);
    }, [value, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        onChange(e.target.value);
    };

    const handleSelectOption = (option) => {
        onChange(option);
        setIsOpen(false);
        if (onSelect) {
            onSelect(option);
        }
    };

    const handleClear = () => {
        onChange('');
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown') {
                setIsOpen(true);
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
                    handleSelectOption(filteredOptions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
            default:
                break;
        }
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative group">
                {/* Search Icon - Hidden by default, visible if needed or kept minimal */}
                {/* <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search size={16} />
                </div> */}

                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => value && filteredOptions.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    required={required}
                    className="w-full font-medium text-slate-900 outline-none placeholder:text-slate-300 bg-transparent border-none p-0 focus:ring-0"
                />

                {loading && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            {/* Dropdown - Slick floating card */}
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-50 left-0 min-w-full w-max mt-1 bg-white border border-slate-100 rounded-lg shadow-xl shadow-slate-200/50 max-h-60 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectOption(option)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-all whitespace-nowrap ${index === highlightedIndex
                                ? 'bg-slate-50 text-blue-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {isOpen && filteredOptions.length === 0 && value && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-lg p-4">
                    <p className="text-sm text-slate-500 text-center">No components found</p>
                </div>
            )}
        </div>
    );
};

export default AutocompleteInput;
