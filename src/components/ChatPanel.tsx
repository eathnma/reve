'use client';

import Image from 'next/image';

export default function ChatPanel() {
  return (
    <div className="bg-white w-[483px] h-screen flex flex-col justify-between p-4 flex-shrink-0 overflow-hidden">
      {/* Top section */}
      <div className="flex flex-col gap-4 w-full">
        {/* Logo */}
        <div className="flex flex-col items-start p-[10px] h-[43px] w-full">
          <img
            src="/images/reve.svg"
            alt="Reve"
            className="h-[16px] w-auto"
          />
        </div>

        {/* Messages area */}
        <div className="flex flex-col gap-4 w-full">
          {/* Date */}
          <div className="flex items-center justify-center w-full">
            <p className="text-base text-black/50 font-normal">
              February 4, 2026
            </p>
          </div>

          {/* User message */}
          <div className="flex flex-col items-end justify-center w-full">
            <div className="bg-[#f0f0f0] rounded-[50px] px-6 py-5">
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
        </div>
      </div>

      {/* Input bar */}
      <div className="flex flex-col items-start p-[10px] w-full">
        <div className="bg-[#f0f0f0] border border-[#d9d9d9] rounded-[32px] px-[21px] py-6 w-full flex items-end justify-between">
          <div className="flex flex-col gap-6 items-start">
            <p className="text-base text-black/60 font-normal">
              Ask Reve
            </p>
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
