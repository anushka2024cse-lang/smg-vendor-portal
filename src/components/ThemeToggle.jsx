import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    return (
        /* 
          Container increased to w-56 h-56 (approx 300% larger area than button)
          Anchored to bottom-right fixed position.
          'group' class here enables hover detection on this large area.
        */
        <div className="fixed bottom-0 right-0 w-56 h-56 z-[9999] group flex items-end justify-end pointer-events-auto">
            <button
                onClick={toggleTheme}
                // Button positioned with margins to sit at the original "bottom-8 right-8" visual spot
                // opacity-20 is default, group-hover:opacity-100 triggers when mouse enters the large w-56 h-56 box
                className="mb-8 mr-8 bg-card/80 backdrop-blur-sm p-4 rounded-full border border-border/50 text-foreground 
                   shadow-2xl hover:scale-110 transition-all duration-500 ease-in-out
                   opacity-20 group-hover:opacity-100"
                aria-label="Toggle Dark Mode"
            >
                {isDark ? (
                    <Moon size={24} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                ) : (
                    <Sun size={24} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                )}
            </button>
        </div>
    );
};

export default ThemeToggle;
