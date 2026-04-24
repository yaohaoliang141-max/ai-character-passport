import { useState, useRef, useEffect } from 'react';
import { Character, useCharacterStore } from '../store/useCharacterStore';
import { Upload, X } from 'lucide-react';
import { PromptPreview } from './PromptPreview';

interface Props {
  character?: Character | null;
  onClose: () => void;
}

export const CharacterForm = ({ character, onClose }: Props) => {
  const { addCharacter, updateCharacter } = useCharacterStore();
  const [formData, setFormData] = useState<Omit<Character, 'id' | 'createdAt'>>({
    name: '',
    basePrompt: '',
    appearanceTags: '',
    styleLighting: '',
    referenceImage: null,
  });

  useEffect(() => {
    if (character) {
      setFormData(character);
    }
  }, [character]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (character) {
      await updateCharacter(character.id, formData);
    } else {
      await addCharacter(formData);
    }
    onClose();
  };

  // Create a mock character object for live preview
  const livePreviewChar: Character = {
    ...formData,
    id: character?.id || 'preview-id',
    createdAt: character?.createdAt || Date.now(),
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto">
        
        {/* Form Section */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto max-h-[80vh]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">
              {character ? 'Edit Character' : 'New Character'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors hidden md:block md:invisible">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Reference Image</label>
              <div 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg cursor-pointer hover:border-primary/50 transition-colors relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.referenceImage ? (
                   <img src={formData.referenceImage} alt="Preview" className="max-h-48 rounded object-contain" />
                ) : (
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground justify-center">
                      <span>Upload a file</span>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Character Name</label>
              <input
                required
                type="text"
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Cyberpunk Hacker"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Base Prompt (Description)</label>
              <textarea
                required
                rows={3}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                value={formData.basePrompt}
                onChange={e => setFormData({ ...formData, basePrompt: e.target.value })}
                placeholder="e.g. A young female hacker with neon tattoos..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Appearance Tags</label>
              <textarea
                rows={2}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                value={formData.appearanceTags}
                onChange={e => setFormData({ ...formData, appearanceTags: e.target.value })}
                placeholder="e.g. short blue hair, glowing eyes, leather jacket"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Style & Lighting</label>
              <textarea
                rows={2}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow resize-none"
                value={formData.styleLighting}
                onChange={e => setFormData({ ...formData, styleLighting: e.target.value })}
                placeholder="e.g. Cinematic lighting, neon rim light, 8k resolution, highly detailed"
              />
            </div>
            
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md hover:bg-secondary text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Save Character
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-secondary/30 p-6 flex flex-col overflow-y-auto max-h-[80vh]">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-card-foreground">Live Translator</h3>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors md:hidden">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 flex flex-col h-full">
             <PromptPreview character={livePreviewChar} />
          </div>
        </div>

      </div>
    </div>
  );
};
