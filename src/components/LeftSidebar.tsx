'use client';

export default function LeftSidebar() {
  return (
    <div className="bg-white h-screen w-[50px] flex-shrink-0 border-r-[0.5px] border-[#d9d9d9] relative">
      <div className="absolute flex flex-col gap-[24px] items-start left-[15px] top-[23px]">
        {/* Menu icon - 20x20 container */}
        <button className="relative w-5 h-5">
          <div className="absolute inset-[23.62%_9.43%]">
            <div className="absolute inset-[-6.63%_-4.31%]">
              <img src="/images/menu-icon.svg" alt="Menu" className="block w-full h-full" />
            </div>
          </div>
        </button>

        {/* House icon - 20x20 container */}
        <button className="relative w-5 h-5">
          <div className="absolute inset-[11.94%_14.62%]">
            <div className="absolute inset-[-4.6%_-4.95%]">
              <img src="/images/house-icon.svg" alt="Home" className="block w-full h-full" />
            </div>
          </div>
        </button>

        {/* Plus icon - 20x20 container */}
        <button className="relative w-5 h-5">
          <div className="absolute inset-[13.1%_13.66%]">
            <div className="absolute inset-[-4.74%_-4.82%]">
              <img src="/images/plus-icon.svg" alt="New" className="block w-full h-full" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
