import { Character } from '../store/useCharacterStore';

export type TargetPlatform = 'Natural Language' | 'ComfyUI Tags' | 'JSON';

export const translatePrompt = (character: Character | null, platform: TargetPlatform): string => {
  if (!character) return '';

  const { name, basePrompt, appearanceTags, styleLighting } = character;

  switch (platform) {
    case 'Natural Language':
      return `This is ${name || 'a character'}. ${basePrompt} They have the following appearance: ${appearanceTags}. The image should be in the style of ${styleLighting}.`.trim();

    case 'ComfyUI Tags':
      // Split by commas, newlines, or spaces, filter out empties, trim, and rejoin with comma + space
      const allTags = [
        name,
        basePrompt,
        appearanceTags,
        styleLighting
      ]
        .filter(Boolean)
        .flatMap(str => str.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean))
        .join(', ');
        
      return allTags;

    case 'JSON':
      const jsonObj = {
        character: {
          name: name || undefined,
          base_prompt: basePrompt || undefined,
          appearance: appearanceTags ? appearanceTags.split(',').map(s => s.trim()) : [],
          style_and_lighting: styleLighting || undefined
        }
      };
      return JSON.stringify(jsonObj, null, 2);

    default:
      return '';
  }
};
