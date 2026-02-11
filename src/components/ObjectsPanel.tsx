'use client';

import { useState } from 'react';
import Image from 'next/image';

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

interface PropertyRowProps {
  label: string;
  hasColorDot?: boolean;
}

function PropertyRow({ label, hasColorDot }: PropertyRowProps) {
  return (
    <div className="border-b border-black/20 flex items-center h-[56px] px-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center">
          <p className="text-base text-black font-normal">{label}</p>
          {hasColorDot && (
            <div className="w-2 h-2 rounded-full bg-[#4A90D9]" />
          )}
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <ChevronRight />
        </div>
      </div>
    </div>
  );
}

interface ObjectItemProps {
  name: string;
  hasArrow?: boolean;
}

function ObjectItem({ name, hasArrow }: ObjectItemProps) {
  return (
    <div className="flex gap-2 items-center w-full">
      {hasArrow && (
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <path d="M6.5 0L12.5 10H0.5L6.5 0Z" fill="black"/>
        </svg>
      )}
      <div className="w-8 h-8 rounded overflow-hidden relative flex-shrink-0">
        <Image
          src="/images/object-thumb.jpg"
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <p className="text-base text-black font-normal">{name}</p>
    </div>
  );
}

interface ObjectsPanelProps {
  isSelected?: boolean;
  onSelectObject?: () => void;
}

export default function ObjectsPanel({ isSelected = true, onSelectObject }: ObjectsPanelProps) {
  const [activeTab, setActiveTab] = useState<'objects' | 'edit'>('objects');

  // Deselected state - simple list view
  if (!isSelected) {
    return (
      <div className="w-[319px] h-full border-b border-[#d9d9d9] flex flex-col bg-white">
        <div className="flex flex-col gap-5 pt-[30px] px-[18px] pb-[23px]">
          <div className="cursor-pointer" onClick={onSelectObject}>
            <ObjectItem name="House, Mobius House" />
          </div>
          <ObjectItem name="ASDF" />
          <ObjectItem name="Interior lighting" hasArrow />
          <ObjectItem name="House, Mobius House" />
          <ObjectItem name="House, Mobius House" />
          <ObjectItem name="House, Mobius House" />
          <ObjectItem name="House, Mobius House" />
          <ObjectItem name="House, Mobius House" />
        </div>
      </div>
    );
  }

  // Selected state - detailed view
  return (
    <div className="w-[319px] h-full border-b border-[#d9d9d9] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#d9d9d9] h-[50px] flex items-center px-4">
        <div className="flex gap-4 items-center w-[190px]">
          <button
            onClick={() => setActiveTab('objects')}
            className={`text-base font-medium cursor-pointer ${activeTab === 'objects' ? 'text-black' : 'text-black/50'}`}
          >
            Objects
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`text-base font-medium cursor-pointer ${activeTab === 'edit' ? 'text-black' : 'text-black/50'}`}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white flex-1 overflow-auto">
        {activeTab === 'objects' ? (
          <div className="flex flex-col gap-[10px] pt-4">
            <div className="flex flex-col gap-4">
              {/* Description box */}
              <div className="px-4">
                <div className="bg-[#f0f0f0] border border-[#dbdbdb] rounded-[13px] px-[15px] py-2">
                  <p className="text-base text-black font-normal leading-[26px]">
                    A modern, minimalist house with large windows, and a mix of light gray and light brown wood sliding. The interior of the house should be well lit, with fractions of the house partially covered by curtains.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#d9d9d9] w-full" />

              {/* Reference images section */}
              <div className="border-b border-black/20 pb-4 pt-1 px-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <p className="text-base text-black font-normal">Reference images</p>
                    <button className="w-5 h-5 flex items-center justify-center">
                      <Image
                        src="/images/plus-small.svg"
                        alt="Add"
                        width={20}
                        height={20}
                      />
                    </button>
                  </div>

                  {/* Reference image cards */}
                  <div className="flex flex-col gap-2">
                    {/* Mobius house card */}
                    <div className="border border-black/10 rounded-[5px] p-[10px] w-[289px]">
                      <div className="flex gap-4 items-center">
                        <div className="w-[77px] h-[38px] rounded-[2px] overflow-hidden relative">
                          <Image
                            src="/images/mobius-house.jpg"
                            alt="Mobius house"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-black/90" />
                        </div>
                        <div className="flex flex-col w-[179px]">
                          <p className="text-base text-black font-normal leading-6">Mobius house</p>
                          <p className="text-base text-black/50 font-normal leading-6">Brutalism &amp; Concrete</p>
                        </div>
                      </div>
                    </div>

                    {/* Interior card */}
                    <div className="border border-black/10 rounded-[5px] p-[10px] w-[289px]">
                      <div className="flex gap-4 items-center">
                        <div className="w-[77px] h-[48px] flex items-center justify-center">
                          <div className="w-[32px] h-[48px] rounded-[3px] border border-[#cfcfcf] overflow-hidden relative">
                            <Image
                              src="/images/interior.jpg"
                              alt="Interior"
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col w-[179px]">
                          <p className="text-base text-black font-normal leading-6">Interior </p>
                          <p className="text-base text-black/50 font-normal leading-6">Jagged, Interior</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property rows */}
              <PropertyRow label="Exterior Color" hasColorDot />
              <PropertyRow label="Interior Color" />
              <PropertyRow label="Curtain style" />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
