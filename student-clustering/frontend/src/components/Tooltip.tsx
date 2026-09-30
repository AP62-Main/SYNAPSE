import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  title?: string;
  content: string;
}

export default function InfoTooltip({ title, content }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        type="button"
        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors p-0.5 rounded focus:outline-none"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        aria-label="Information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl text-xs text-neutral-600 dark:text-neutral-300 pointer-events-none transition-opacity duration-150">
          {title && <div className="font-semibold text-neutral-900 dark:text-white mb-1">{title}</div>}
          <div className="leading-relaxed">{content}</div>
        </div>
      )}
    </div>
  );
}
