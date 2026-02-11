'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useReveApi } from '@/hooks/useReveApi';
import { base64ToDataUrl } from '@/lib/reve-api';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  timestamp: Date;
}

interface ChatPanelProps {
  onImageGenerated?: (imageUrl: string, prompt: string) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

export default function ChatPanel({ onImageGenerated, onGeneratingChange }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { createImage, isLoading, error } = useReveApi();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Notify parent of loading state changes
  useEffect(() => {
    onGeneratingChange?.(isLoading);
  }, [isLoading, onGeneratingChange]);

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    // Track current prompt for when image completes
    setCurrentPrompt(prompt);

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Call Reve API
    const result = await createImage({ prompt });

    if (result) {
      const imageUrl = base64ToDataUrl(result.image);

      // Add assistant response with generated image
      const assistantMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: 'Here is your generated image:',
        imageUrl,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Notify parent component about the new image with prompt
      onImageGenerated?.(imageUrl, prompt);
    } else if (error) {
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit(inputValue.trim());
        setInputValue('');
        // Reset textarea height
        e.currentTarget.style.height = 'auto';
      }
    }
  };

  return (
    <div className="bg-white w-[483px] h-screen flex flex-col justify-between p-4 flex-shrink-0 overflow-hidden">
      {/* Top section */}
      <div className="flex flex-col gap-4 w-full flex-1 overflow-hidden">
        {/* Logo */}
        <div className="flex flex-col items-start p-[10px] h-[43px] w-full flex-shrink-0">
          <img
            src="/images/reve.svg"
            alt="Reve"
            className="h-[16px] w-auto"
          />
        </div>

        {/* Messages area */}
        <div className="flex flex-col gap-4 w-full flex-1 overflow-y-auto">
          {/* Date */}
          <div className="flex items-center justify-center w-full">
            <p className="text-base text-black/50 font-normal">
              February 4, 2026
            </p>
          </div>

          {/* User message */}
          <div className="flex flex-col items-end justify-center w-full">
            <div className="bg-[#f0f0f0] rounded-[24px] px-6 py-5">
              <p className="text-base text-black font-medium leading-[1.7]">
                Render me the Mobius house in a dark lush terrain with deciduous trees, with a light blue sky
              </p>
            </div>
          </div>

          {/* AI response */}
          <div className="flex items-center px-4 w-full">
            <p className="text-base text-black font-normal leading-[26px]">
              I&apos;ll render you the Mobius house in your desired location. Are there types of objects that i&apos;m missing?
            </p>
          </div>

          {/* New messages */}
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex flex-col items-end justify-center w-full">
                  <div className="bg-[#f0f0f0] rounded-[24px] px-6 py-5 max-w-[90%]">
                    <p className="text-base text-black font-medium leading-[1.7]">
                      {message.content}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start px-4 w-full gap-3">
                  <p className="text-base text-black font-normal leading-[26px]">
                    {message.content}
                  </p>
                  {message.imageUrl && (
                    <div className="relative w-full max-w-[400px] aspect-[3/2] rounded-lg overflow-hidden">
                      <img
                        src={message.imageUrl}
                        alt="Generated image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center px-4 w-full">
              <video
                src="/loading/papillon_generating_on_off.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-[45px] h-[45px]"
              />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex flex-col items-start p-[10px] w-full">
        <div className="bg-[#f0f0f0] border border-[#d9d9d9] rounded-[32px] px-[21px] py-6 w-full flex items-end justify-between">
          <div className="flex flex-col gap-6 items-start flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask Reve"
              rows={1}
              className="text-base text-black font-normal bg-transparent outline-none w-full placeholder:text-black/60 resize-none overflow-hidden"
            />
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8">
                <Image
                  src="/images/attachment-1.svg"
                  alt="Attachment"
                  width={32}
                  height={32}
                />
              </div>
              <div className="w-8 h-8">
                <Image
                  src="/images/attachment-2.svg"
                  alt="Mention"
                  width={32}
                  height={32}
                />
              </div>
              <div className="w-8 h-8">
                <Image
                  src="/images/attachment-3.svg"
                  alt="Command"
                  width={32}
                  height={32}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-base text-black font-medium">
              Auto
            </p>
            <div className="w-8 h-8">
              <Image
                src="/images/auto-icon.svg"
                alt="Auto mode"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
