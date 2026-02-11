'use client';

import Image from 'next/image';
import ObjectsPanel from './ObjectsPanel';

function SelectionHandle({ className }: { className?: string }) {
  return (
    <div className={`absolute w-[10px] h-[10px] bg-white border-2 border-black/50 ${className}`} />
  );
}

export default function Canvas() {
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Main canvas area */}
      <div className="flex-1 bg-[#f0f0f0] relative overflow-hidden">
        {/* Objects panel positioned on the right */}
        <div className="absolute right-0 top-0 border-l border-[#d9d9d9]">
          <ObjectsPanel />
        </div>

        {/* Back arrow */}
        <div className="absolute left-0 top-0 w-[855px] flex items-center justify-between px-[30px] py-4">
          <button className="w-5 h-5 flex items-center justify-center">
            <Image
              src="/images/arrow-icon.svg"
              alt="Back"
              width={20}
              height={20}
            />
          </button>
        </div>

        {/* House image with selection */}
        <div className="absolute left-[119px] top-[217px] w-[639px] h-[361px]">
          <Image
            src="/images/canvas-house.jpg"
            alt="Rendered house"
            fill
            className="object-cover"
          />
        </div>

        {/* Selection box */}
        <div className="absolute left-[146px] top-[400px] w-[594px] h-[130px] pointer-events-none">
          <div className="absolute inset-0 border border-white" />
          <SelectionHandle className="-left-[5px] -top-[5px]" />
          <SelectionHandle className="-left-[5px] -bottom-[5px]" />
          <SelectionHandle className="-right-[5px] -top-[5px]" />
          <SelectionHandle className="-right-[5px] -bottom-[5px]" />
        </div>

        {/* Label tooltip */}
        <div className="absolute left-[382px] top-[370px] bg-[#484848] rounded-[2px] px-[6px] py-1">
          <p className="text-[11px] text-white font-normal">
            House, Mobius House
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white h-[112px] flex items-center justify-between px-6 py-5 border-t border-[#d9d9d9]">
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

        {/* Upload button */}
        <button className="bg-black text-white rounded-full px-[12.8px] py-[10.5px]">
          <span className="text-[16.28px] font-medium">Apply edits</span>
        </button>
      </div>
    </div>
  );
}
