'use client';

import Image from 'next/image';

export default function LeftSidebar() {
  return (
    <div className="bg-white h-screen w-[50px] flex-shrink-0 border-r-[0.5px] border-[#d9d9d9]">
      <div className="flex flex-col gap-6 items-center pt-[23px] px-[15px]">
        <button className="w-5 h-5 flex items-center justify-center">
          <Image
            src="/images/menu-icon.svg"
            alt="Menu"
            width={20}
            height={20}
          />
        </button>
        <button className="w-5 h-5 flex items-center justify-center">
          <Image
            src="/images/house-icon.svg"
            alt="Home"
            width={20}
            height={20}
          />
        </button>
        <button className="w-5 h-5 flex items-center justify-center">
          <Image
            src="/images/plus-icon.svg"
            alt="New"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}
