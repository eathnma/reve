'use client';

import { useState } from 'react';
import LeftSidebar from '@/components/LeftSidebar';
import ChatPanel from '@/components/ChatPanel';
import Canvas from '@/components/Canvas';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export default function Home() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditGenerating, setIsEditGenerating] = useState(false);

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    const newImage: GeneratedImage = {
      id: Math.random().toString(36).substring(2, 9),
      url: imageUrl,
      prompt,
    };
    setImages(prev => [...prev, newImage]);
    // Don't auto-select - user must click thumbnail to view
  };

  const selectedImage = images.find(img => img.id === selectedImageId);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <LeftSidebar />
      <ChatPanel
        onImageGenerated={handleImageGenerated}
        onGeneratingChange={setIsGenerating}
      />
      <Canvas
        images={images}
        selectedImageId={selectedImageId}
        onSelectImage={setSelectedImageId}
        isGenerating={isGenerating || isEditGenerating}
        onImageEdited={handleImageGenerated}
        onEditGeneratingChange={setIsEditGenerating}
      />
    </div>
  );
}
