import { useRef, useState } from 'react';
import { useStoryboardStore, Shot } from '../store/useStoryboardStore';
import { Clock, Copy, CheckCircle2, Video, UploadCloud } from 'lucide-react';

const ShotCard = ({ shot, index }: { shot: Shot; index: number }) => {
  const { updateShotVideo } = useStoryboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shot.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      updateShotVideo(shot.id, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateShotVideo(shot.id, file);
    }
  };

  return (
    <div className="relative pl-10 md:pl-0">
      {/* Timeline connector (Mobile) */}
      <div className="md:hidden absolute left-[19px] top-10 bottom-[-3rem] w-px bg-neutral-200 z-0" />
      {/* Timeline node */}
      <div className="absolute left-[7px] md:left-1/2 md:-translate-x-1/2 top-8 w-6 h-6 rounded-full bg-blue-600 border-4 border-white z-10 shadow-sm flex items-center justify-center">
      </div>

      <div className="md:flex md:w-full md:justify-between md:items-start group">
        
        {/* Left Side: Video Preview */}
        <div className="md:w-[46%] md:pr-10 md:text-right mt-2 md:mt-0 order-2 md:order-1">
          <div 
            className={`w-full aspect-video rounded-2xl overflow-hidden border transition-all duration-300 relative flex items-center justify-center bg-neutral-50 shadow-sm ${isDragOver ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-neutral-200 hover:border-neutral-300 hover:shadow-apple'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => !shot.videoUrl && fileInputRef.current?.click()}
          >
            {shot.videoUrl ? (
              <video 
                src={shot.videoUrl} 
                controls 
                autoPlay 
                loop 
                muted 
                className="w-full h-full object-cover bg-black"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-neutral-400 p-6 cursor-pointer hover:text-blue-500 transition-colors">
                <UploadCloud className="w-10 h-10 mb-3 opacity-50" />
                <span className="text-[15px] font-medium text-neutral-600">Drag & Drop generated video here</span>
                <span className="text-[13px] mt-1 text-neutral-400">or click to browse</span>
              </div>
            )}
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="md:w-[46%] md:pl-10 order-1 md:order-2 mt-4 md:mt-0">
          <div className="bg-white border border-neutral-100 rounded-[24px] p-6 shadow-apple hover:shadow-apple-hover transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
            
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-neutral-900 tracking-tight">分镜 {shot.shotNumber || index + 1}</span>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 bg-neutral-100/80 px-2.5 py-1 rounded-full"><Clock size={14}/> {shot.duration}</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest">画面提示词 (Prompt)</label>
                <button 
                  onClick={handleCopy}
                  className="text-neutral-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-[13px] font-medium bg-neutral-50 hover:bg-blue-50 px-3 py-1.5 rounded-full"
                >
                  {copied ? <CheckCircle2 size={14} className="text-[#34c759]" /> : <Copy size={14} />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <p className="text-[15px] text-neutral-800 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100 leading-relaxed font-normal selection:bg-blue-200">
                {shot.prompt}
              </p>
            </div>

            {shot.narration && (
              <div>
                <label className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2 block">配音 / 旁白</label>
                <div className="text-[16px] text-neutral-700 italic border-l-2 border-blue-200 pl-4 py-1 leading-relaxed bg-gradient-to-r from-blue-50/30 to-transparent rounded-r-lg">
                  "{shot.narration}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const StoryboardTimeline = () => {
  const { shots, isGenerating } = useStoryboardStore();

  if (isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white">
        <div className="w-16 h-16 border-[3px] border-neutral-100 border-t-blue-600 rounded-full animate-spin mb-6" />
        <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">正在构筑您的分镜世界...</h3>
        <p className="text-[15px] text-neutral-500 mt-3 max-w-md leading-relaxed">
          AI 正在分析输入内容、计算节奏，并智能地将角色特征注入到每一个镜头中。
        </p>
      </div>
    );
  }

  if (shots.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-white">
        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-neutral-100">
          <Video className="w-10 h-10 text-neutral-300" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-3 tracking-tight">故事板画布</h3>
        <p className="text-[15px] text-neutral-500 max-w-md leading-relaxed">
          您生成的分镜将会以交互式时间轴呈现于此。请在左侧配置您的创作输入源。
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-y-auto pr-2 pb-24 scroll-smooth scrollbar-hide">
      <div className="flex justify-between items-center mb-10 bg-white/90 backdrop-blur-md border-b border-neutral-100 p-6 sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">时间轴 <span className="text-neutral-400 font-normal ml-2">({shots.length} 个镜头)</span></h2>
      </div>

      <div className="space-y-16 md:space-y-32 pt-6 px-6">
        {shots.map((shot, index) => (
          <ShotCard key={shot.id} shot={shot} index={index} />
        ))}
      </div>
    </div>
  );
};
