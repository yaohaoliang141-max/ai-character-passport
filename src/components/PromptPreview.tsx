import { useState } from 'react';
import { Character } from '../store/useCharacterStore';
import { TargetPlatform, translatePrompt } from '../utils/promptTranslator';
import { Copy, CheckCircle2 } from 'lucide-react';

interface Props {
  character: Character;
}

export const PromptPreview = ({ character }: Props) => {
  const [platform, setPlatform] = useState<TargetPlatform>('ComfyUI Tags');
  const [copied, setCopied] = useState(false);

  const platforms: TargetPlatform[] = ['Natural Language', 'ComfyUI Tags', 'JSON'];
  
  const generatedPrompt = translatePrompt(character, platform);

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Target Platform</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value as TargetPlatform)}
          className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow appearance-none"
        >
          {platforms.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex flex-col min-h-[200px] relative">
        <label className="block text-sm font-medium text-foreground mb-1">Generated Prompt</label>
        <div className="relative flex-1 bg-background border border-border rounded-md p-4 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-foreground break-words">
            {generatedPrompt || <span className="text-muted-foreground italic">Fill out character details to see preview...</span>}
          </pre>
        </div>
        
        <button
          onClick={handleCopy}
          disabled={!generatedPrompt}
          className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
