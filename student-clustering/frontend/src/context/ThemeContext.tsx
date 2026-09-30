import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  plotlyLayout: {
    paper_bgcolor: string;
    plot_bgcolor: string;
    font: { color: string; family: string };
    gridcolor: string;
    zerolinecolor: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('synapse-theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    // Default to dark theme (ChatGPT signature dark mode)
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('synapse-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const isDark = theme === 'dark';

  const plotlyLayout = {
    paper_bgcolor: isDark ? '#171717' : '#ffffff',
    plot_bgcolor: isDark ? '#171717' : '#ffffff',
    font: {
      color: isDark ? '#ececec' : '#0d0d0d',
      family: 'Inter, system-ui, sans-serif'
    },
    gridcolor: isDark ? '#262626' : '#f0f0f0',
    zerolinecolor: isDark ? '#333333' : '#e5e5e5'
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, plotlyLayout }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
