import { useState, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCharacterStore } from '../store/useCharacterStore';
import { useStoryboardStore, Shot } from '../store/useStoryboardStore';
import { Settings, Sparkles, FileText, Video, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { extractFramesFromVideo, Frame } from '../utils/videoExtractor';

export const InputPanel = () => {
  const { apiKey, baseUrl, model, setSettings } = useSettingsStore();
  const { characters } = useCharacterStore();
  const { setShots, setIsGenerating, isGenerating, clearShots } = useStoryboardStore();
  
  const [activeTab, setActiveTab] = useState<'text' | 'video'>('video');
  const [script, setScript] = useState('');
  const [selectedCharId, setSelectedCharId] = useState('');
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [framesPreview, setFramesPreview] = useState<Frame[]>([]);
  const [extracting, setExtracting] = useState(false);
  
  const videoInputRef = useRef<HTMLInputElement>(null);
  const charImageInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setExtracting(true);
      setError('');
      try {
        const frames = await extractFramesFromVideo(file, 20);
        setFramesPreview(frames);
      } catch (err) {
        setError('从视频提取关键帧失败。');
      } finally {
        setExtracting(false);
      }
    }
  };

  const handleCharImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCharacterImage(reader.result as string);
        setSelectedCharId(''); // Clear dropdown if custom image is uploaded
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCharSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCharId(e.target.value);
    if (e.target.value) {
      setCharacterImage(null); // Clear custom image if dropdown is used
    }
  };

  const handleGenerate = async () => {
    if (activeTab === 'text' && !script.trim()) {
      setError('请输入一段剧本或故事大纲。');
      return;
    }
    if (activeTab === 'video' && framesPreview.length === 0) {
      setError('请上传一段参考视频并等待关键帧提取完成。');
      return;
    }
    if (!apiKey) {
      setError('请在下方配置您的大模型 API Key。');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    clearShots();

    const character = characters.find(c => c.id === selectedCharId) || null;
    // If a saved character is selected, prioritize its saved referenceImage for the prompt
    const finalCharacterImage = character?.referenceImage || characterImage;

    try {
      const payload = {
        script: activeTab === 'text' ? script : undefined,
        frames: activeTab === 'video' ? framesPreview : undefined,
        character,
        characterImage: finalCharacterImage,
        settings: { apiKey, baseUrl, model }
      };

      const res = await fetch('/api/generate-shots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '生成分镜失败。请检查 API Key、Base URL 或 模型名称是否正确。');
      }
      
      const shotsWithIds = data.shots.map((s: any) => ({
        ...s,
        id: crypto.randomUUID()
      })) as Shot[];
      
      setShots(shotsWithIds);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成过程中发生未知错误。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8 bg-white border border-neutral-100/80 rounded-3xl p-8 shadow-apple overflow-y-auto scrollbar-hide">
      <div>
        <h2 className="text-3xl font-bold text-neutral-900 flex items-center gap-2 tracking-tight">
          <Sparkles className="text-blue-600 w-6 h-6" />
          创作输入源
        </h2>
      </div>

      {/* Target Character Section */}
      <div className="space-y-4">
        <div>
           <label className="block text-[15px] font-semibold text-neutral-900 mb-2 tracking-tight">目标角色替换 (可选)</label>
           <p className="text-[13px] text-neutral-500 mb-3 leading-relaxed">提供一个角色，AI 将在分镜中把画面主角逻辑替换为您提供的角色。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: Dropdown */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col justify-center">
            <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2">选项 1: 从角色库选择</label>
            <select
              value={selectedCharId}
              onChange={handleCharSelectChange}
              className="w-full bg-white hover:bg-neutral-50 cursor-pointer border border-neutral-200 rounded-xl px-3 py-2 text-[14px] text-neutral-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none appearance-none"
            >
              <option value="">-- 不使用 / 临时上传 --</option>
              {characters.map(char => (
                <option key={char.id} value={char.id}>{char.name}</option>
              ))}
            </select>
          </div>

          {/* Option 2: Upload Image */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col justify-center relative">
            <label className="block text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-2">选项 2: 临时上传角色图</label>
            {characterImage ? (
              <div className="relative w-full h-12 flex items-center justify-between bg-white border border-neutral-200 rounded-xl px-3">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img src={characterImage} className="w-8 h-8 object-cover rounded-md border border-neutral-100" alt="Character" />
                  <span className="text-[13px] text-neutral-600 truncate">已加载临时图片</span>
                </div>
                <button onClick={() => setCharacterImage(null)} className="p-1 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => charImageInputRef.current?.click()}
                className="w-full h-12 flex items-center justify-center gap-2 bg-white border border-neutral-200 border-dashed rounded-xl text-[14px] text-neutral-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
              >
                <ImageIcon size={16} /> 上传一张图片
              </button>
            )}
            <input type="file" accept="image/*" className="hidden" ref={charImageInputRef} onChange={handleCharImageSelect} />
          </div>
        </div>
      </div>



      {/* Tabs */}
      <div className="flex border-b border-neutral-200/80 mt-2">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-3 text-[15px] font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'video' ? 'border-blue-600 text-blue-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <Video size={18} /> 参考视频提取
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-3 text-[15px] font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${activeTab === 'text' ? 'border-blue-600 text-blue-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
        >
          <FileText size={18} /> 纯文本剧本解析
        </button>
      </div>

      {/* Input Content */}
      <div className="flex-1 flex flex-col min-h-[280px] overflow-hidden">
        {activeTab === 'text' ? (
          <textarea
            value={script}
            onChange={e => setScript(e.target.value)}
            placeholder="在此粘贴您的故事大纲或小说片段..."
            className="w-full h-full bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-[15px] text-neutral-900 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none leading-relaxed outline-none"
          />
        ) : (
          <div className="flex-1 flex flex-col gap-5">
             <div 
                className="w-full h-36 border-2 border-neutral-200 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/30 transition-colors bg-neutral-50/50"
                onClick={() => videoInputRef.current?.click()}
              >
                <UploadCloud className="w-10 h-10 text-blue-500 mb-3" />
                <span className="text-[15px] font-semibold text-neutral-900">选择要提取分镜的参考长视频</span>
                <span className="text-[13px] text-neutral-500 mt-1">将在本地安全提取最多 20 张关键帧</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={videoInputRef}
                  onChange={handleVideoSelect}
                />
              </div>

              {extracting && (
                <div className="flex items-center justify-center gap-3 text-[15px] font-medium text-blue-600 bg-blue-50 py-4 rounded-xl">
                  <div className="w-5 h-5 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  正在提取视频关键帧...
                </div>
              )}

              {!extracting && framesPreview.length > 0 && (
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  <p className="text-[13px] font-semibold text-neutral-500 mb-3 uppercase tracking-wider">已提取 {framesPreview.length} 张画面帧</p>
                  <div className="grid grid-cols-4 gap-3">
                    {framesPreview.map((frame, i) => (
                      <div key={i} className="aspect-video bg-neutral-100 rounded-lg overflow-hidden relative border border-neutral-200/60 shadow-sm">
                        <img src={frame.dataUrl} className="w-full h-full object-cover" alt={`Frame ${i}`} />
                        <div className="absolute bottom-1 right-1 bg-neutral-900/70 backdrop-blur-md rounded text-white text-[10px] px-1.5 py-0.5 font-medium">
                          {frame.time.toFixed(1)}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {error && <div className="text-[#ff3b30] text-[15px] font-medium p-4 bg-[#ff3b30]/10 rounded-xl border border-[#ff3b30]/20 shrink-0">{error}</div>}

      <button
        onClick={handleGenerate}
        disabled={isGenerating || extracting}
        className="w-full py-4 bg-blue-600 text-white rounded-xl text-[17px] font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 shrink-0"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            AI 正在解析生成中...
          </>
        ) : (
          '一键解析生成分镜'
        )}
      </button>
    </div>
  );
};
