'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ObjectsPanel from './ObjectsPanel';
import { GeneratedImage } from '@/app/page';

function SelectionHandle({ className }: { className?: string }) {
  return (
    <div className={`absolute w-[10px] h-[10px] bg-white border-2 border-black/50 ${className}`} />
  );
}

interface ObjectDotProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  dimmed?: boolean;
}

function ObjectDot({ className, onClick, onMouseEnter, onMouseLeave, dimmed }: ObjectDotProps) {
  return (
    <div
      className={`absolute w-[17px] h-[17px] transition-opacity duration-200 pointer-events-auto cursor-pointer ${dimmed ? 'opacity-40' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-full rounded-full bg-white border-2 border-black/20 shadow-md" />
    </div>
  );
}

interface CanvasProps {
  images: GeneratedImage[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  isGenerating: boolean;
  onImageEdited?: (imageUrl: string, prompt: string) => void;
  onEditGeneratingChange?: (isGenerating: boolean) => void;
}

export default function Canvas({ images, selectedImageId, onSelectImage, isGenerating, onImageEdited, onEditGeneratingChange }: CanvasProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHoveringHouseDot, setIsHoveringHouseDot] = useState(false);
  const [isHoveringSkyDot, setIsHoveringSkyDot] = useState(false);
  const [isHoveringForestDot, setIsHoveringForestDot] = useState(false);
  const [isHoveringGroundDot, setIsHoveringGroundDot] = useState(false);

  const selectedImage = images.find(img => img.id === selectedImageId);

  // Listen for Escape key to exit selection state
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSelected && !isClosing) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, isClosing]);

  const handleClose = () => {
    if (!isSelected || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsSelected(false);
      setIsClosing(false);
    }, 150);
  };

  const handleCanvasClick = () => {
    handleClose();
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
          <ObjectsPanel
            isSelected={isSelected && !isClosing}
            onSelectObject={handleSelectObject}
            isHoveringHouseDot={isHoveringHouseDot}
            isHoveringSkyDot={isHoveringSkyDot}
            isHoveringForestDot={isHoveringForestDot}
            isHoveringGroundDot={isHoveringGroundDot}
            onImageEdited={onImageEdited}
            onEditGeneratingChange={onEditGeneratingChange}
          />
        </div>

        {/* Top bar */}
        <div className="absolute left-0 top-0 right-[319px] flex items-center justify-between px-6 py-6" onClick={(e) => e.stopPropagation()}>
          <button className="w-5 h-5 flex items-center justify-center">
            <img
              src="/images/arrow-icon.svg"
              alt="Back"
              className="w-[15px] h-[11px]"
            />
          </button>
          <button className="w-5 h-5 flex items-center justify-center">
            <img
              src="/images/focus-icon.svg"
              alt="Focus"
              className="w-5 h-5"
            />
          </button>
        </div>

        {/* Centered content area (excluding objects panel) */}
        <div className="absolute top-8 left-8 bottom-8 right-[351px] flex items-center justify-center pointer-events-none">
          <div className="relative pointer-events-auto w-full" style={{ aspectRatio: '639/361', maxHeight: '100%' }}>
            {/* Show selected generated image or default house */}
            {selectedImage ? (
              <img
                src={selectedImage.url}
                alt="Generated image"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src="/images/canvas-house.jpg"
                alt="Rendered house"
                fill
                className="object-cover"
              />
            )}

            {/* Object dots - only show for the first/original image */}
            {!selectedImageId && (
              <div className="animate-dot-appear">
                {/* Sky - top */}
                <ObjectDot
                  className="left-[42.88%] top-[12.19%]"
                  dimmed={isSelected}
                  onMouseEnter={() => setIsHoveringSkyDot(true)}
                  onMouseLeave={() => setIsHoveringSkyDot(false)}
                />
                {/* Forest - right */}
                <ObjectDot
                  className="left-[86.85%] top-[29.09%]"
                  dimmed={isSelected}
                  onMouseEnter={() => setIsHoveringForestDot(true)}
                  onMouseLeave={() => setIsHoveringForestDot(false)}
                />
                {/* House - middle */}
                <ObjectDot
                  className="left-[49.61%] top-[68.7%]"
                  onClick={handleImageClick}
                  onMouseEnter={() => setIsHoveringHouseDot(true)}
                  onMouseLeave={() => setIsHoveringHouseDot(false)}
                />
                {/* Ground - bottom */}
                <ObjectDot
                  className="left-[49.45%] top-[90.58%]"
                  dimmed={isSelected}
                  onMouseEnter={() => setIsHoveringGroundDot(true)}
                  onMouseLeave={() => setIsHoveringGroundDot(false)}
                />
              </div>
            )}

            {/* Selection box - only show when selected and on first image */}
            {(isSelected || isClosing) && !selectedImageId && (
              <div className={`absolute left-[4.23%] bottom-[7.48%] w-[92.96%] h-[42.66%] pointer-events-none ${isClosing ? 'animate-selection-disappear' : 'animate-selection-appear'}`}>
                <div className="absolute inset-0 border border-white" />
                <SelectionHandle className="-left-[5px] -top-[5px]" />
                <SelectionHandle className="-left-[5px] -bottom-[5px]" />
                <SelectionHandle className="-right-[5px] -top-[5px]" />
                <SelectionHandle className="-right-[5px] -bottom-[5px]" />

                {/* Label tooltip - top left of selection box */}
                <div className="absolute left-0 bottom-[calc(100%+8px)] bg-[#484848] rounded-[2px] px-[6px] py-1">
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
        {/* Thumbnails */}
        <div className="flex gap-2 items-center">
          {/* Default thumbnail */}
          <div
            className={`w-[61px] h-[61px] relative cursor-pointer rounded-[8px] overflow-hidden ${
              !selectedImageId ? 'ring-2 ring-[#d3e2f5] ring-offset-2' : ''
            }`}
            onClick={() => onSelectImage('')}
          >
            <Image
              src="/images/thumbnail.jpg"
              alt="Original"
              fill
              className="object-cover"
            />
          </div>

          {/* Generated image thumbnails */}
          {images.map((image) => (
            <div
              key={image.id}
              className={`w-[61px] h-[61px] relative cursor-pointer rounded-[8px] overflow-hidden bg-[#e8e8e8] ${
                selectedImageId === image.id ? 'ring-2 ring-[#d3e2f5] ring-offset-2' : ''
              }`}
              onClick={() => onSelectImage(image.id)}
            >
              <img
                src={image.url}
                alt={image.prompt}
                className="absolute inset-0 w-full h-full object-cover animate-thumbnail-appear"
              />
            </div>
          ))}

          {/* Loading thumbnail while generating */}
          {isGenerating && (
            <div className="w-[61px] h-[61px] relative rounded-[8px] overflow-hidden loading-static" />
          )}
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
