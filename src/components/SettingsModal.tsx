import { useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { Settings, X } from 'lucide-react';

export const SettingsModal = () => {
  const { apiKey, baseUrl, model, setSettings } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-white border border-neutral-200 shadow-apple hover:shadow-apple-hover text-neutral-700 hover:text-blue-600 px-5 py-3.5 rounded-full transition-all duration-300 z-40 group flex items-center justify-center gap-2"
        title="配置大模型 API"
      >
        <Settings size={26} className="group-hover:rotate-45 transition-transform duration-300" />
        <span className="font-bold text-[16px]">API 配置</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-3xl w-full max-w-md shadow-apple-hover border border-neutral-100 overflow-hidden transform animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-neutral-100/80 bg-neutral-50/50">
              <div className="flex items-center gap-3 text-neutral-900">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                  <Settings size={20} />
                </div>
                <h3 className="text-xl font-bold tracking-tight">大模型 API 配置</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 text-blue-800 text-[13px] px-4 py-3 rounded-xl border border-blue-100/50 leading-relaxed">
                <span className="font-semibold block mb-1">原生支持任何兼容 OpenAI 格式的 API。</span>
                支持如 DeepSeek (深度求索)、Qwen (通义千问)、MiniMax、Kimi 等国内大模型，以及 GPT-4o / Claude。仅需填入对应的 Base URL 即可。
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2 tracking-wide">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={e => setSettings({ apiKey: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2 tracking-wide">Base URL</label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={e => setSettings({ baseUrl: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="如: https://api.deepseek.com/v1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2 tracking-wide">Model <span className="text-neutral-400 font-normal ml-1">(建议使用具备视觉能力的模型)</span></label>
                <input
                  type="text"
                  value={model}
                  onChange={e => setSettings({ model: e.target.value })}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-[15px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  placeholder="如: deepseek-chat, qwen-vl-max"
                />
              </div>
            </div>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-neutral-900 text-white rounded-xl text-[15px] font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all shadow-md"
              >
                保存并关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
