import LeftSidebar from '@/components/LeftSidebar';
import ChatPanel from '@/components/ChatPanel';
import Canvas from '@/components/Canvas';

export default function Home() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <LeftSidebar />
      <ChatPanel />
      <Canvas />
    </div>
  );
}
