'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L7 5L1 9V1Z" fill="black" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5H17M7 9V15M11 9V15M2 5L3 17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19H13C13.5304 19 14.0391 18.7893 14.4142 18.4142C14.7893 18.0391 15 17.5304 15 17L16 5M6 5V2C6 1.73478 6.10536 1.48043 6.29289 1.29289C6.48043 1.10536 6.73478 1 7 1H11C11.2652 1 11.5196 1.10536 11.7071 1.29289C11.8946 1.48043 12 1.73478 12 2V5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.166 2.5009C14.3849 2.28203 14.6447 2.10842 14.9307 1.98996C15.2167 1.87151 15.5232 1.81055 15.8327 1.81055C16.1422 1.81055 16.4487 1.87151 16.7347 1.98996C17.0206 2.10842 17.2805 2.28203 17.4993 2.5009C17.7182 2.71977 17.8918 2.97961 18.0103 3.26558C18.1287 3.55154 18.1897 3.85804 18.1897 4.16757C18.1897 4.4771 18.1287 4.7836 18.0103 5.06956C17.8918 5.35553 17.7182 5.61537 17.4993 5.83424L6.24935 17.0842L1.66602 18.3342L2.91602 13.7509L14.166 2.5009Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
  image: string;
  onDoubleClick?: () => void;
}

function ObjectItem({ name, image, onDoubleClick }: ObjectItemProps) {
  return (
    <div
      className="group flex items-center w-full cursor-pointer rounded-[10px] hover:bg-[#f0f0f0] transition-colors duration-150 px-2 py-1"
      onDoubleClick={onDoubleClick}
    >
      {/* Thumbnail */}
      <div className="w-[32px] h-[32px] overflow-hidden relative flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <p className="text-base text-black font-normal ml-2 flex-1">{name}</p>

      {/* Action icons - only visible on hover */}
      <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button className="w-5 h-5 flex items-center justify-center hover:opacity-70">
          <TrashIcon />
        </button>
        <button className="w-5 h-5 flex items-center justify-center hover:opacity-70">
          <PencilIcon />
        </button>
      </div>
    </div>
  );
}

interface ObjectsPanelProps {
  isSelected?: boolean;
  onSelectObject?: () => void;
}

export default function ObjectsPanel({ isSelected = true, onSelectObject }: ObjectsPanelProps) {
  const [activeTab, setActiveTab] = useState<'objects' | 'edit'>('objects');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddReferenceImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Handle the selected files here
      console.log('Selected files:', files);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  // Deselected state - simple list view
  if (!isSelected) {
    return (
      <div className="w-[319px] h-full flex flex-col bg-white">
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

        <div className="flex flex-col gap-3 pt-4 px-2">
          <ObjectItem name="House" image="/images/house.png" onDoubleClick={onSelectObject} />
          <ObjectItem name="Forest" image="/images/forset.png" onDoubleClick={onSelectObject} />
          <ObjectItem name="Sky" image="/images/sky.png" onDoubleClick={onSelectObject} />
          <ObjectItem name="Ground" image="/images/ground.png" onDoubleClick={onSelectObject} />
        </div>
      </div>
    );
  }

  // Selected state - detailed view
  return (
    <div className="w-[319px] h-full flex flex-col">
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
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <button
                      className="w-5 h-5 flex items-center justify-center cursor-pointer"
                      onClick={handleAddReferenceImage}
                    >
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
