'use client';

import { useState } from 'react';
import Image from 'next/image';
import ObjectsPanel from './ObjectsPanel';

function SelectionHandle({ className }: { className?: string }) {
  return (
    <div className={`absolute w-[10px] h-[10px] bg-white border-2 border-black/50 ${className}`} />
  );
}

interface ObjectDotProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

function ObjectDot({ className, onClick }: ObjectDotProps) {
  return (
    <div
      className={`absolute w-[17px] h-[17px] ${onClick ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'} ${className}`}
      onClick={onClick}
    >
      <div className="w-full h-full rounded-full bg-white border-2 border-black/20 shadow-md" />
    </div>
  );
}

export default function Canvas() {
  const [isSelected, setIsSelected] = useState(true);

  const handleCanvasClick = () => {
    setIsSelected(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSelected(true);
  };

  const handleSelectObject = () => {
    setIsSelected(true);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Main canvas area */}
      <div
        className="flex-1 bg-[#f0f0f0] relative overflow-hidden"
        onClick={handleCanvasClick}
      >
        {/* Objects panel positioned on the right */}
        <div
          className="absolute right-0 top-0 bottom-0 border-l border-[#d9d9d9]"
          onClick={(e) => e.stopPropagation()}
        >
          <ObjectsPanel isSelected={isSelected} onSelectObject={handleSelectObject} />
        </div>

        {/* Top bar */}
        <div className="absolute left-0 top-0 right-[319px] flex items-center justify-between px-[30px] py-4" onClick={(e) => e.stopPropagation()}>
          <button className="w-5 h-5 relative">
            <img
              src="/images/arrow-icon.svg"
              alt="Back"
              className="absolute w-[15px] h-[11px] left-[2.5px] top-[4.5px]"
            />
          </button>
          <button className="w-5 h-5">
            <img
              src="/images/focus-icon.svg"
              alt="Focus"
              className="w-full h-full"
            />
          </button>
        </div>

        {/* Centered content area (excluding objects panel) */}
        <div className="absolute left-0 top-0 bottom-0 right-[319px] flex items-center justify-center pointer-events-none">
          <div className="relative w-[639px] h-[361px] pointer-events-auto">
            {/* House image */}
            <Image
              src="/images/canvas-house.jpg"
              alt="Rendered house"
              fill
              className="object-cover"
            />

            {/* Object dots - positioned as percentages to follow image on resize */}
            <ObjectDot className="left-[42.88%] top-[12.19%]" />
            <ObjectDot className="left-[86.85%] top-[29.09%]" />
            <ObjectDot className="left-[49.61%] top-[64.27%]" onClick={handleImageClick} />
            <ObjectDot className="left-[49.45%] top-[90.58%]" />

            {/* Selection box - only show when selected */}
            {isSelected && (
              <div className="absolute left-[27px] bottom-[27px] w-[594px] h-[154px] pointer-events-none animate-selection-appear">
                <div className="absolute inset-0 border border-white" />
                <SelectionHandle className="-left-[5px] -top-[5px]" />
                <SelectionHandle className="-left-[5px] -bottom-[5px]" />
                <SelectionHandle className="-right-[5px] -top-[5px]" />
                <SelectionHandle className="-right-[5px] -bottom-[5px]" />

                {/* Label tooltip - 8px above selection box */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] bg-[#484848] rounded-[2px] px-[6px] py-1">
                  <p className="text-[16px] text-white font-normal whitespace-nowrap">
                    House, Mobius House
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white h-[112px] flex items-center justify-between pl-2 pr-6 border-t border-[#d9d9d9]">
        {/* Thumbnail */}
        <div className="w-[81px] h-[81px] relative">
          <div className="absolute inset-[10px_10px_10px_10px] rounded-[13px] border-8 border-[#d3e2f5] overflow-hidden">
            <Image
              src="/images/thumbnail.jpg"
              alt="Thumbnail"
              fill
              className="object-cover rounded-[13px]"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 items-center">
          <button className="border border-black/20 text-black rounded-full px-[12.8px] py-[10.5px]">
            <span className="text-[16.28px] font-medium">Cancel</span>
          </button>
          <button className="bg-black text-white rounded-full px-[12.8px] py-[10.5px]">
            <span className="text-[16.28px] font-medium">Apply edits</span>
          </button>
        </div>
      </div>
    </div>
  );
}
