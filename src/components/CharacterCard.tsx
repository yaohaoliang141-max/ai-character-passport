import { Character } from '../store/useCharacterStore';
import { Trash2, Edit } from 'lucide-react';
import Image from 'next/image';

interface Props {
  character: Character;
  onEdit: (char: Character) => void;
  onDelete: (id: string) => void;
}

export const CharacterCard = ({ character, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300 group flex flex-col">
      <div className="relative w-full aspect-square bg-muted">
        {character.referenceImage ? (
          <img
            src={character.referenceImage}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(character)}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(character.id)}
            className="p-2 bg-background/80 backdrop-blur-sm rounded-md hover:bg-red-500 hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{character.name || 'Unnamed Character'}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex-1">
          {character.basePrompt || 'No description provided.'}
        </p>
      </div>
    </div>
  );
};
