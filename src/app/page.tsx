"use client";

import { InputPanel } from '@/components/InputPanel';
import { StoryboardTimeline } from '@/components/StoryboardTimeline';
import { SettingsModal } from '@/components/SettingsModal';
import { Film } from 'lucide-react';

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col bg-[#fbfbfd] overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 px-8 flex items-center shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-3 w-full max-w-7xl mx-auto">
          <div className="bg-blue-600 p-2 rounded-xl shadow-sm">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-tight">
              AI 剧本分镜架构师
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full max-w-7xl mx-auto">
        {/* Left Column: Input Panel (1/3 width on desktop) */}
        <section className="w-full md:w-[420px] lg:w-[480px] shrink-0 p-6 md:p-8 overflow-hidden flex flex-col">
          <InputPanel />
        </section>

        {/* Right Column: Timeline (2/3 width on desktop) */}
        <section className="flex-1 p-6 md:p-8 overflow-hidden relative">
          <div className="relative h-full bg-white rounded-3xl shadow-apple border border-neutral-100 overflow-hidden">
            <StoryboardTimeline />
          </div>
        </section>
      </div>

      <SettingsModal />
    </main>
  );
}
