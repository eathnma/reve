'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

// Reusable hook for drag and drop image handling (supports multiple images)
function useImageDrop(onImagesDrop: (urls: string[]) => void) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          urls.push(URL.createObjectURL(file));
        }
      }
      if (urls.length > 0) {
        onImagesDrop(urls);
      }
    }
  }, [onImagesDrop]);

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}

// Reusable dropped image card component
interface DroppedImageCardProps {
  previewUrl: string;
  label?: string;
  onRemove: () => void;
}

function DroppedImageCard({ previewUrl, label = 'Reference image', onRemove }: DroppedImageCardProps) {
  return (
    <div className="group border border-black/10 rounded-[5px] p-[10px] cursor-pointer relative">
      <div className="flex gap-4 items-center">
        <div className="w-[33px] h-[44px] rounded-[2px] overflow-hidden relative flex-shrink-0">
          <img
            src={previewUrl}
            alt="Reference"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-base text-black font-normal leading-6 flex-1">{label}</p>
        <button
          className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-black/5 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L11 11M1 11L11 1" stroke="black" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

function PropertyRow({ label, hasColorDot, onMouseEnter, onMouseLeave, className }: PropertyRowProps) {
  return (
    <div
      className={`border-b border-black/20 flex items-center p-4 w-full cursor-pointer ${className || ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
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
  isHovered?: boolean;
}

function ObjectItem({ name, image, onDoubleClick, isHovered }: ObjectItemProps) {
  return (
    <div
      className={`group flex items-center w-full cursor-pointer rounded-[10px] transition-colors duration-150 px-2 py-1 ${isHovered ? 'bg-[#f0f0f0]' : 'hover:bg-[#f0f0f0]'}`}
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
      <div className={`flex gap-2 items-center transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
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

// Window size section component
interface WindowSizeSectionProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  expanded?: boolean;
  onToggle?: () => void;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

function WindowSizeSection({ onMouseEnter, onMouseLeave, expanded = true, onToggle, images, onImagesChange }: WindowSizeSectionProps) {
  const windowFileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = useCallback((urls: string[]) => {
    onImagesChange([...images, ...urls]);
  }, [images, onImagesChange]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useImageDrop(handleAddImages);

  const handleClickAdd = () => {
    windowFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      onImagesChange([...images, ...urls]);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div
      className="border-b border-black/20 py-2 px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={windowFileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      <div className="flex flex-col gap-4 pb-2 pt-2">
        {/* Header */}
        <div
          className="flex items-center cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-[8px]">
            <img
              src="/triangle.svg"
              alt=""
              className={`w-[7px] h-[8px] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            />
            <p className="text-base text-black font-normal">Window size</p>
          </div>
        </div>
        {/* Content */}
        {expanded && (
          <div className="flex flex-col gap-2">
            {/* Existing images */}
            {images.map((url, index) => (
              <DroppedImageCard
                key={url}
                previewUrl={url}
                label="Reference image"
                onRemove={() => handleRemoveImage(index)}
              />
            ))}
            {/* Add more button */}
            <div
              className={`border rounded-[5px] p-[10px] cursor-pointer transition-colors ${
                isDragging ? 'border-[#4993fc] bg-[#4993fc]/5 border-dashed' : 'border-black/10'
              }`}
              onClick={handleClickAdd}
            >
              <div className="flex gap-2 items-center">
                <div className="w-5 h-5 flex items-center justify-center">
                  <img src="/images/plus-icon.svg" alt="Add" className="w-[15px] h-[15px] opacity-50" />
                </div>
                <p className="text-base text-black/50 font-normal leading-6">
                  {isDragging ? 'Drop images here' : 'Drop or click to add'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Exterior color section component
const EXTERIOR_IMAGES = [
  '/images/exterior 1.png',
  '/images/exterior 2.png',
  '/images/exterior 3.png',
  '/images/exterior 4.png',
];

// Representative colors for exterior images
const EXTERIOR_COLORS = [
  '#4A5D8A', // exterior 1 - blue
  '#D4BC9A', // exterior 2 - warm tan wood
  '#E8DFD0', // exterior 3 - light cream
  '#7A9AB0', // exterior 4 - blue-gray tiles
];

interface ExteriorColorSectionProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  expanded?: boolean;
  onToggle?: () => void;
  selectedColor: number;
  brightness: number;
  onColorChange: (index: number) => void;
  onBrightnessChange: (value: number) => void;
  customImages: string[];
  onCustomImagesChange: (images: string[]) => void;
}

function ExteriorColorSection({ onMouseEnter, onMouseLeave, expanded = true, onToggle, selectedColor, brightness, onColorChange, onBrightnessChange, customImages, onCustomImagesChange }: ExteriorColorSectionProps) {
  const handleAddImages = useCallback((urls: string[]) => {
    onCustomImagesChange([...customImages, ...urls]);
  }, [customImages, onCustomImagesChange]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useImageDrop(handleAddImages);

  const handleRemoveImage = (index: number) => {
    const newImages = customImages.filter((_, i) => i !== index);
    onCustomImagesChange(newImages);
  };

  return (
    <div
      className="border-b border-black/20 py-2 px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col gap-4 pb-2 pt-2">
        {/* Header */}
        <div className="flex items-center cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-[8px]">
            <img
              src="/triangle.svg"
              alt=""
              className={`w-[7px] h-[8px] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            />
            <p className="text-base text-black font-normal">Exterior color</p>
          </div>
        </div>

        {expanded && (
          <>
            {/* Custom dropped images */}
            {customImages.length > 0 ? (
              customImages.map((url, index) => (
                <DroppedImageCard
                  key={url}
                  previewUrl={url}
                  label="Reference image"
                  onRemove={() => handleRemoveImage(index)}
                />
              ))
            ) : (
              <>
                {/* Exterior images */}
                <div className={`flex gap-[10px] items-start ${isDragging ? 'opacity-50' : ''}`}>
                  {EXTERIOR_IMAGES.map((src, index) => (
                    <div
                      key={index}
                      className={`w-[47px] h-[47px] cursor-pointer overflow-hidden relative ${
                        selectedColor === index ? 'ring-2 ring-[#4993fc]' : 'border border-black/20'
                      }`}
                      onClick={() => onColorChange(index)}
                    >
                      <Image
                        src={src}
                        alt={`Exterior style ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {/* Drop zone indicator */}
                  <div className={`w-[47px] h-[47px] border bg-white flex items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? 'border-[#4993fc] border-dashed bg-[#4993fc]/5' : 'border-black/25'
                  }`}>
                    <img src="/images/plus-icon.svg" alt="Add" className="w-[15px] h-[15px]" />
                  </div>
                </div>

                {/* Brightness slider */}
                <div className="flex gap-4 items-center">
                  <p className="text-base text-black/65 font-normal whitespace-nowrap">Brightness</p>
                  <div className="flex-1 h-[28px] relative">
                    <div
                      className="absolute top-[4px] left-0 right-0 h-[19px] rounded-full border border-[#c6c6c6]"
                      style={{ background: `linear-gradient(to right, white, ${EXTERIOR_COLORS[selectedColor]})` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => onBrightnessChange(Number(e.target.value))}
                      className="absolute top-0 left-0 right-0 h-full opacity-0 cursor-grab active:cursor-grabbing z-10"
                    />
                    <div
                      className="absolute top-[2px] w-6 h-6 bg-white rounded-full border border-black/20 shadow-sm pointer-events-none"
                      style={{ left: `${brightness}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Interior color section component
const INTERIOR_IMAGES = [
  '/images/interior 1.png',
  '/images/interior 2.png',
  '/images/interior 3.png',
  '/images/interior 4.png',
];

// Representative colors for interior images
const INTERIOR_COLORS = [
  '#F5D96A', // interior 1 - yellow
  '#D8E5F0', // interior 2 - light blue
  '#E5A574', // interior 3 - orange/peach
  '#A88BC8', // interior 4 - purple/lavender
];

interface InteriorColorSectionProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  expanded?: boolean;
  onToggle?: () => void;
  selectedColor: number;
  brightness: number;
  onColorChange: (index: number) => void;
  onBrightnessChange: (value: number) => void;
  customImages: string[];
  onCustomImagesChange: (images: string[]) => void;
}

function InteriorColorSection({ onMouseEnter, onMouseLeave, expanded = true, onToggle, selectedColor, brightness, onColorChange, onBrightnessChange, customImages, onCustomImagesChange }: InteriorColorSectionProps) {
  const handleAddImages = useCallback((urls: string[]) => {
    onCustomImagesChange([...customImages, ...urls]);
  }, [customImages, onCustomImagesChange]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useImageDrop(handleAddImages);

  const handleRemoveImage = (index: number) => {
    const newImages = customImages.filter((_, i) => i !== index);
    onCustomImagesChange(newImages);
  };

  return (
    <div
      className="border-b border-black/20 py-2 px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col gap-4 pb-2 pt-2">
        {/* Header */}
        <div className="flex items-center cursor-pointer" onClick={onToggle}>
          <div className="flex items-center gap-[8px]">
            <img
              src="/triangle.svg"
              alt=""
              className={`w-[7px] h-[8px] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            />
            <p className="text-base text-black font-normal">Interior color</p>
          </div>
        </div>

        {expanded && (
          <>
            {/* Custom dropped images */}
            {customImages.length > 0 ? (
              customImages.map((url, index) => (
                <DroppedImageCard
                  key={url}
                  previewUrl={url}
                  label="Reference image"
                  onRemove={() => handleRemoveImage(index)}
                />
              ))
            ) : (
              <>
                {/* Interior images */}
                <div className={`flex gap-[10px] items-start ${isDragging ? 'opacity-50' : ''}`}>
                  {INTERIOR_IMAGES.map((src, index) => (
                    <div
                      key={index}
                      className={`w-[47px] h-[47px] cursor-pointer overflow-hidden relative ${
                        selectedColor === index ? 'ring-2 ring-[#4993fc]' : 'border border-black/20'
                      }`}
                      onClick={() => onColorChange(index)}
                    >
                      <Image
                        src={src}
                        alt={`Interior style ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {/* Drop zone indicator */}
                  <div className={`w-[47px] h-[47px] border bg-white flex items-center justify-center cursor-pointer transition-colors ${
                    isDragging ? 'border-[#4993fc] border-dashed bg-[#4993fc]/5' : 'border-black/25'
                  }`}>
                    <img src="/images/plus-icon.svg" alt="Add" className="w-[15px] h-[15px]" />
                  </div>
                </div>

                {/* Brightness slider */}
                <div className="flex gap-4 items-center">
                  <p className="text-base text-black/65 font-normal whitespace-nowrap">Brightness</p>
                  <div className="flex-1 h-[28px] relative">
                    <div
                      className="absolute top-[4px] left-0 right-0 h-[19px] rounded-full border border-[#c6c6c6]"
                      style={{ background: `linear-gradient(to right, white, ${INTERIOR_COLORS[selectedColor]})` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brightness}
                      onChange={(e) => onBrightnessChange(Number(e.target.value))}
                      className="absolute top-0 left-0 right-0 h-full opacity-0 cursor-grab active:cursor-grabbing z-10"
                    />
                    <div
                      className="absolute top-[2px] w-6 h-6 bg-white rounded-full border border-black/20 shadow-sm pointer-events-none"
                      style={{ left: `${brightness}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Curtain style section component
const CURTAIN_IMAGES = [
  '/images/green curtain.png',
  '/images/beige curtain.png',
  '/images/ash curtain.png',
  '/images/red curtain.png',
];

interface CurtainStyleSectionProps {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  expanded?: boolean;
  onToggle?: () => void;
  selectedCurtain: number;
  onCurtainChange: (index: number) => void;
  customImages: string[];
  onCustomImagesChange: (images: string[]) => void;
}

function CurtainStyleSection({ onMouseEnter, onMouseLeave, expanded = true, onToggle, selectedCurtain, onCurtainChange, customImages, onCustomImagesChange }: CurtainStyleSectionProps) {
  const curtainImages = CURTAIN_IMAGES;

  const handleAddImages = useCallback((urls: string[]) => {
    onCustomImagesChange([...customImages, ...urls]);
  }, [customImages, onCustomImagesChange]);

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useImageDrop(handleAddImages);

  const handleRemoveImage = (index: number) => {
    const newImages = customImages.filter((_, i) => i !== index);
    onCustomImagesChange(newImages);
  };

  return (
    <div
      className="border-b border-black/20 py-2 px-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`flex flex-col gap-4 pt-2 ${expanded ? 'pb-8' : 'pb-2'}`}>
        {/* Header */}
        <div
          className="flex items-center cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-center gap-[8px]">
            <img
              src="/triangle.svg"
              alt=""
              className={`w-[7px] h-[8px] transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
            />
            <p className="text-base text-black font-normal">Curtain style</p>
          </div>
        </div>

        {expanded && (
          <>
            {/* Custom dropped images */}
            {customImages.map((url, index) => (
              <DroppedImageCard
                key={url}
                previewUrl={url}
                label="Reference image"
                onRemove={() => handleRemoveImage(index)}
              />
            ))}

            {/* Curtain images */}
            <div className={`flex gap-[10px] items-start ${isDragging ? 'opacity-50' : ''}`}>
              {curtainImages.map((src, index) => (
                <div
                  key={index}
                  className={`w-[65px] h-[80px] rounded-[5px] cursor-pointer overflow-hidden relative ${
                    selectedCurtain === index && customImages.length === 0 ? 'ring-2 ring-[#4993fc]' : 'border border-black/20'
                  }`}
                  onClick={() => onCurtainChange(index)}
                >
                  <Image
                    src={src}
                    alt={`Curtain style ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {/* Drop zone indicator */}
              <div className={`w-[65px] h-[80px] rounded-[5px] border bg-white flex items-center justify-center cursor-pointer transition-colors ${
                isDragging ? 'border-[#4993fc] border-dashed bg-[#4993fc]/5' : 'border-black/25'
              }`}>
                <img src="/images/plus-icon.svg" alt="Add" className="w-[15px] h-[15px]" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Edit data interface - tracks which edits the user has made
export interface EditData {
  windowSizeImage: string | null; // Preview URL of uploaded window size reference
  windowSizeDescription: string | null; // AI-generated description of the window image
  exteriorImage: { image: string; brightness: number } | null; // null if unchanged from default
  interiorImage: { image: string; brightness: number } | null; // null if unchanged from default
  curtainImage: string | null; // Path to selected curtain image, null if unchanged
}

interface ObjectsPanelProps {
  isSelected?: boolean;
  onSelectObject?: () => void;
  onShowPrompt?: () => void;
  isHoveringHouseDot?: boolean;
  isHoveringSkyDot?: boolean;
  isHoveringForestDot?: boolean;
  isHoveringGroundDot?: boolean;
  onImageEdited?: (imageUrl: string, prompt: string) => void;
  onEditGeneratingChange?: (isGenerating: boolean) => void;
  onEditDataChange?: (editData: EditData) => void;
}

export default function ObjectsPanel({
  isSelected = true,
  onSelectObject,
  onShowPrompt,
  isHoveringHouseDot,
  isHoveringSkyDot,
  isHoveringForestDot,
  isHoveringGroundDot,
  onImageEdited,
  onEditGeneratingChange,
  onEditDataChange,
}: ObjectsPanelProps) {
  const [activeTab, setActiveTab] = useState<'objects' | 'prompt'>('objects');
  const [isHoveringArchStyle, setIsHoveringArchStyle] = useState(false);
  const [isHoveringWindowSize, setIsHoveringWindowSize] = useState(false);
  const [isHoveringExteriorColor, setIsHoveringExteriorColor] = useState(false);
  const [isHoveringInteriorColor, setIsHoveringInteriorColor] = useState(false);
  const [isHoveringCurtainStyle, setIsHoveringCurtainStyle] = useState(false);
  const [archStyleExpanded, setArchStyleExpanded] = useState(true);
  const [windowSizeExpanded, setWindowSizeExpanded] = useState(true);
  const [exteriorColorExpanded, setExteriorColorExpanded] = useState(true);
  const [interiorColorExpanded, setInteriorColorExpanded] = useState(true);
  const [curtainStyleExpanded, setCurtainStyleExpanded] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit state - track user changes (arrays for multiple images)
  const [windowSizeImages, setWindowSizeImages] = useState<string[]>([]);
  const [exteriorColorIndex, setExteriorColorIndex] = useState(0);
  const [exteriorBrightness, setExteriorBrightness] = useState(35);
  const [exteriorChanged, setExteriorChanged] = useState(false);
  const [exteriorCustomImages, setExteriorCustomImages] = useState<string[]>([]);
  const [interiorColorIndex, setInteriorColorIndex] = useState(0);
  const [interiorBrightness, setInteriorBrightness] = useState(35);
  const [interiorChanged, setInteriorChanged] = useState(false);
  const [interiorCustomImages, setInteriorCustomImages] = useState<string[]>([]);
  const [curtainIndex, setCurtainIndex] = useState(0);
  const [curtainChanged, setCurtainChanged] = useState(false);
  const [curtainCustomImages, setCurtainCustomImages] = useState<string[]>([]);

  // Notify parent of edit data changes
  const getEditData = (): EditData => ({
    windowSizeImage: windowSizeImages.length > 0 ? windowSizeImages[0] : null,
    windowSizeDescription: null,
    exteriorImage: exteriorChanged ? { image: EXTERIOR_IMAGES[exteriorColorIndex], brightness: exteriorBrightness } : null,
    interiorImage: interiorChanged ? { image: INTERIOR_IMAGES[interiorColorIndex], brightness: interiorBrightness } : null,
    curtainImage: curtainChanged ? CURTAIN_IMAGES[curtainIndex] : null,
  });

  // Handle edit state changes
  const handleWindowSizeImagesChange = (images: string[]) => {
    setWindowSizeImages(images);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleExteriorColorChange = (index: number) => {
    setExteriorColorIndex(index);
    setExteriorChanged(true);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleExteriorBrightnessChange = (value: number) => {
    setExteriorBrightness(value);
    setExteriorChanged(true);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleInteriorColorChange = (index: number) => {
    setInteriorColorIndex(index);
    setInteriorChanged(true);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleInteriorBrightnessChange = (value: number) => {
    setInteriorBrightness(value);
    setInteriorChanged(true);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleCurtainChange = (index: number) => {
    setCurtainIndex(index);
    setCurtainChanged(true);
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleExteriorCustomImagesChange = (images: string[]) => {
    setExteriorCustomImages(images);
    if (images.length > 0) {
      setExteriorChanged(true);
    }
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleInteriorCustomImagesChange = (images: string[]) => {
    setInteriorCustomImages(images);
    if (images.length > 0) {
      setInteriorChanged(true);
    }
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

  const handleCurtainCustomImagesChange = (images: string[]) => {
    setCurtainCustomImages(images);
    if (images.length > 0) {
      setCurtainChanged(true);
    }
    setTimeout(() => onEditDataChange?.(getEditData()), 0);
  };

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
              onClick={() => {
                setActiveTab('prompt');
                onShowPrompt?.();
              }}
              className={`text-base font-medium cursor-pointer ${activeTab === 'prompt' ? 'text-black' : 'text-black/50'}`}
            >
              Prompt
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4 px-2">
          <ObjectItem name="House" image="/images/house.png" onDoubleClick={onSelectObject} isHovered={isHoveringHouseDot} />
          <ObjectItem name="Forest" image="/images/forset.png" onDoubleClick={onSelectObject} isHovered={isHoveringForestDot} />
          <ObjectItem name="Sky" image="/images/sky.png" onDoubleClick={onSelectObject} isHovered={isHoveringSkyDot} />
          <ObjectItem name="Ground" image="/images/ground.png" onDoubleClick={onSelectObject} isHovered={isHoveringGroundDot} />
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
            onClick={() => setActiveTab('prompt')}
            className={`text-base font-medium cursor-pointer ${activeTab === 'prompt' ? 'text-black' : 'text-black/50'}`}
          >
            Prompt
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white flex-1 overflow-auto relative">
        {activeTab === 'objects' ? (
          <div className="flex flex-col">
            {/* Sticky description box */}
            <div className="sticky top-0 z-10">
              <div className="bg-white pt-4 pb-4 px-4 border-b border-[#d9d9d9]">
                <div className="bg-[#f0f0f0] border border-[#dbdbdb] rounded-[13px] px-[15px] py-2">
                  <p className="text-base text-black font-normal leading-[26px]">
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>A </span>
                    <span className={`transition-all duration-150 ${isHoveringArchStyle ? 'underline' : ''} ${isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>modern, minimalist house</span>
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}> with </span>
                    <span className={`transition-all duration-150 ${isHoveringWindowSize ? 'underline' : ''} ${isHoveringArchStyle || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>large windows</span>
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>, and a </span>
                    <span className={`transition-all duration-150 ${isHoveringExteriorColor ? 'underline' : ''} ${isHoveringArchStyle || isHoveringWindowSize || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>mix of light gray and light brown wood sliding</span>
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>. The </span>
                    <span className={`transition-all duration-150 ${isHoveringInteriorColor ? 'underline' : ''} ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>interior of the house should be well lit</span>
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>, with fractions of the house partially </span>
                    <span className={`transition-all duration-150 ${isHoveringCurtainStyle ? 'underline' : ''} ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor ? 'opacity-50' : ''}`}>covered by curtains</span>
                    <span className={`transition-opacity duration-150 ${isHoveringArchStyle || isHoveringWindowSize || isHoveringExteriorColor || isHoveringInteriorColor || isHoveringCurtainStyle ? 'opacity-50' : ''}`}>.</span>
                  </p>
                </div>
              </div>
              {/* Gradient fade */}
              <div className="h-3 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            </div>

            {/* Scrollable sections */}
            <div className="flex flex-col">
              {/* Reference images section */}
              <div className="border-b border-black/20 py-2 px-4">
                <div className="flex flex-col gap-4 pt-2 pb-2">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => setArchStyleExpanded(!archStyleExpanded)}
                  >
                    <div className="flex items-center gap-[8px]">
                      <img
                        src="/triangle.svg"
                        alt=""
                        className={`w-[7px] h-[8px] transition-transform duration-200 ${archStyleExpanded ? 'rotate-90' : ''}`}
                      />
                      <p className="text-base text-black font-normal">Architectural style</p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </div>

                  {archStyleExpanded && (
                    /* Reference image cards */
                    <div
                      className="flex flex-col gap-4"
                      onMouseEnter={() => setIsHoveringArchStyle(true)}
                      onMouseLeave={() => setIsHoveringArchStyle(false)}
                    >
                      {/* Mobius house card */}
                      <div className="border border-black/10 rounded-[5px] p-[10px] w-[289px] cursor-pointer">
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
                      <div className="border border-black/10 rounded-[5px] p-[10px] w-[289px] cursor-pointer">
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
                  )}
                </div>
              </div>

              {/* Window size section */}
              <WindowSizeSection
                onMouseEnter={() => setIsHoveringWindowSize(true)}
                onMouseLeave={() => setIsHoveringWindowSize(false)}
                expanded={windowSizeExpanded}
                onToggle={() => setWindowSizeExpanded(!windowSizeExpanded)}
                images={windowSizeImages}
                onImagesChange={handleWindowSizeImagesChange}
              />

              {/* Exterior color section */}
              <ExteriorColorSection
                onMouseEnter={() => setIsHoveringExteriorColor(true)}
                onMouseLeave={() => setIsHoveringExteriorColor(false)}
                expanded={exteriorColorExpanded}
                onToggle={() => setExteriorColorExpanded(!exteriorColorExpanded)}
                selectedColor={exteriorColorIndex}
                brightness={exteriorBrightness}
                onColorChange={handleExteriorColorChange}
                onBrightnessChange={handleExteriorBrightnessChange}
                customImages={exteriorCustomImages}
                onCustomImagesChange={handleExteriorCustomImagesChange}
              />

              {/* Interior color section */}
              <InteriorColorSection
                onMouseEnter={() => setIsHoveringInteriorColor(true)}
                onMouseLeave={() => setIsHoveringInteriorColor(false)}
                expanded={interiorColorExpanded}
                onToggle={() => setInteriorColorExpanded(!interiorColorExpanded)}
                selectedColor={interiorColorIndex}
                brightness={interiorBrightness}
                onColorChange={handleInteriorColorChange}
                onBrightnessChange={handleInteriorBrightnessChange}
                customImages={interiorCustomImages}
                onCustomImagesChange={handleInteriorCustomImagesChange}
              />

              {/* Curtain style section */}
              <CurtainStyleSection
                onMouseEnter={() => setIsHoveringCurtainStyle(true)}
                onMouseLeave={() => setIsHoveringCurtainStyle(false)}
                expanded={curtainStyleExpanded}
                onToggle={() => setCurtainStyleExpanded(!curtainStyleExpanded)}
                selectedCurtain={curtainIndex}
                onCurtainChange={handleCurtainChange}
                customImages={curtainCustomImages}
                onCustomImagesChange={handleCurtainCustomImagesChange}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
