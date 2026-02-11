'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ObjectsPanel, { EditData } from './ObjectsPanel';
import { GeneratedImage } from '@/app/page';
import { useReveApi } from '@/hooks/useReveApi';
import { base64ToDataUrl } from '@/lib/reve-api';

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

interface SelectedObject {
  name: string;
  image: string;
}

interface CanvasProps {
  images: GeneratedImage[];
  selectedImageId: string | null;
  onSelectImage: (id: string) => void;
  isGenerating: boolean;
  onImageEdited?: (imageUrl: string, prompt: string) => void;
  onEditGeneratingChange?: (isGenerating: boolean) => void;
  onObjectSelected?: (object: SelectedObject | null) => void;
}

export default function Canvas({ images, selectedImageId, onSelectImage, isGenerating, onImageEdited, onEditGeneratingChange, onObjectSelected }: CanvasProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isHoveringHouseDot, setIsHoveringHouseDot] = useState(false);
  const [isHoveringSkyDot, setIsHoveringSkyDot] = useState(false);
  const [isHoveringForestDot, setIsHoveringForestDot] = useState(false);
  const [isHoveringGroundDot, setIsHoveringGroundDot] = useState(false);
  const [editData, setEditData] = useState<EditData | null>(null);
  const [isApplyingEdits, setIsApplyingEdits] = useState(false);

  const { editImage } = useReveApi();

  const selectedImage = images.find(img => img.id === selectedImageId);

  // Helper to get exterior style description from image path
  const getExteriorStyleName = (imagePath: string): string => {
    const styleMap: Record<string, string> = {
      '/images/exterior 1.png': 'light gray concrete with warm wood accents',
      '/images/exterior 2.png': 'warm beige stone with natural textures',
      '/images/exterior 3.png': 'light brown wood siding',
      '/images/exterior 4.png': 'blue-gray modern panels',
    };
    return styleMap[imagePath] || 'modern exterior';
  };

  // Helper to get interior style description from image path
  const getInteriorStyleName = (imagePath: string): string => {
    const styleMap: Record<string, string> = {
      '/images/interior 1.png': 'warm yellow ambient lighting',
      '/images/interior 2.png': 'cool blue modern lighting',
      '/images/interior 3.png': 'warm orange cozy lighting',
      '/images/interior 4.png': 'soft purple accent lighting',
    };
    return styleMap[imagePath] || 'well-lit interior';
  };

  // Build edit prompt from edit data
  const buildEditPrompt = (data: EditData): string => {
    const parts: string[] = [];

    if (data.windowSizeImage) {
      const windowDesc = data.windowSizeDescription || 'large windows';
      parts.push(`Change the windows to match: ${windowDesc}`);
    }

    if (data.exteriorImage) {
      const styleName = getExteriorStyleName(data.exteriorImage.image);
      const brightnessDesc = data.exteriorImage.brightness > 50 ? 'bright' : 'darker';
      parts.push(`Change the exterior to ${styleName} with ${brightnessDesc} tone`);
    }

    if (data.interiorImage) {
      const styleName = getInteriorStyleName(data.interiorImage.image);
      const brightnessDesc = data.interiorImage.brightness > 50 ? 'brightly lit' : 'warmly lit';
      parts.push(`Make the interior have ${styleName}, ${brightnessDesc}`);
    }

    if (data.curtainImage) {
      const curtainMap: Record<string, string> = {
        '/images/green curtain.png': 'green',
        '/images/beige curtain.png': 'beige',
        '/images/ash curtain.png': 'ash gray',
        '/images/red curtain.png': 'red',
      };
      const curtainColor = curtainMap[data.curtainImage] || 'elegant';
      parts.push(`Add ${curtainColor} curtains to the windows`);
    }

    return 'Preserve the original image composition and structure. Only make these specific changes: ' + parts.join('. ') + '.';
  };

  // Handle Apply edits button click
  const handleApplyEdits = async () => {
    if (!editData) return;

    // Check if any edits were actually made
    const hasEdits = editData.windowSizeImage || editData.exteriorImage || editData.interiorImage || editData.curtainImage;
    if (!hasEdits) return;

    // Close selection state
    handleClose();

    setIsApplyingEdits(true);
    onEditGeneratingChange?.(true);

    try {
      // Get the current canvas image as base64
      const sourceImageUrl = selectedImage?.url || '/images/canvas-house.jpg';
      let imageBase64: string;

      if (sourceImageUrl.startsWith('data:')) {
        // Already a data URL
        imageBase64 = sourceImageUrl.split(',')[1];
      } else {
        // Fetch and convert to base64
        const response = await fetch(sourceImageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      // Build the edit prompt
      const prompt = buildEditPrompt(editData);

      // Call the API
      const result = await editImage({
        edit_instruction: prompt,
        reference_image: imageBase64,
      });

      if (result) {
        const newImageUrl = base64ToDataUrl(result.image);
        onImageEdited?.(newImageUrl, prompt);
      }
    } catch (err) {
      console.error('Error applying edits:', err);
    } finally {
      setIsApplyingEdits(false);
      onEditGeneratingChange?.(false);
    }
  };

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
    onObjectSelected?.(null);
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
    onObjectSelected?.({ name: 'House', image: '/images/house.png' });
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
            onEditDataChange={setEditData}
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
          {(isGenerating || isApplyingEdits) && (
            <div className="w-[61px] h-[61px] relative rounded-[8px] overflow-hidden loading-static" />
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 items-center">
          {isSelected || isApplyingEdits ? (
            <>
              <button className="border border-black/20 text-black rounded-full px-[12.8px] py-[10.5px]">
                <span className="text-[16.28px] font-medium">Cancel</span>
              </button>
              <button
                className="bg-black text-white rounded-full px-[12.8px] py-[10.5px] disabled:opacity-30 disabled:cursor-not-allowed"
                onClick={handleApplyEdits}
                disabled={isApplyingEdits || !editData || (!editData.windowSizeImage && !editData.exteriorImage && !editData.interiorImage && !editData.curtainImage)}
              >
                <span className="text-[16.28px] font-medium">Apply edits</span>
              </button>
            </>
          ) : (
            <button className="bg-black text-white rounded-full px-[12.8px] py-[10.5px]">
              <span className="text-[16.28px] font-medium">Done</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
