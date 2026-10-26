import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Heart, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Memory } from '../../types/memory';
import { SAMPLE_PORTRAITS } from '../../data/sampleMemories';

interface MemoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: Memory) => Promise<void>;
  initialMemory?: Memory | null;
}

export const MemoryFormModal: React.FC<MemoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMemory,
}) => {
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [remembranceDate, setRemembranceDate] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [favoriteFood, setFavoriteFood] = useState('');
  const [favoriteSong, setFavoriteSong] = useState('');
  const [favoritePlace, setFavoritePlace] = useState('');
  const [sayings, setSayings] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [onAltar, setOnAltar] = useState(true);
  const [altarDedication, setAltarDedication] = useState('');
  const [altarCandleType, setAltarCandleType] = useState<'tall' | 'tea' | 'glass'>('tall');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialMemory) {
      setPersonName(initialMemory.personName || '');
      setRelationship(initialMemory.relationship || '');
      setBirthDate(initialMemory.birthDate || '');
      setRemembranceDate(initialMemory.remembranceDate || '');
      setTitle(initialMemory.title || '');
      setStory(initialMemory.story || '');
      setFavoriteFood(initialMemory.favoriteFood || '');
      setFavoriteSong(initialMemory.favoriteSong || '');
      setFavoritePlace(initialMemory.favoritePlace || '');
      setSayings(initialMemory.sayings || '');
      setPhotoUrl(initialMemory.photoUrl);
      setTags(initialMemory.tags || []);
      setTagsInput((initialMemory.tags || []).join(', '));
      setOnAltar(initialMemory.onAltar ?? true);
      setAltarDedication(initialMemory.altarDedication || '');
      setAltarCandleType(initialMemory.altarCandleType || 'tall');
    } else {
      // Clean slate
      setPersonName('');
      setRelationship('');
      setBirthDate('');
      setRemembranceDate('');
      setTitle('');
      setStory('');
      setFavoriteFood('');
      setFavoriteSong('');
      setFavoritePlace('');
      setSayings('');
      setPhotoUrl(undefined);
      setTags(['Remembrance']);
      setTagsInput('Remembrance');
      setOnAltar(true);
      setAltarDedication('');
      setAltarCandleType('tall');
    }
    setErrors({});
  }, [initialMemory, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Please select a valid image file (JPEG, PNG, WebP).' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be under 5MB for local browser storage.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleTagsChange = (val: string) => {
    setTagsInput(val);
    const parsed = val
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setTags(parsed);
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!personName.trim()) {
      err.personName = 'Please enter a name or beloved subject.';
    }
    if (!title.trim()) {
      err.title = 'Please provide a title for this memory.';
    }
    if (!story.trim()) {
      err.story = 'Please record a memory in your own words.';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const memoryToSave: Memory = {
        id: initialMemory?.id || `memory-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        personName: personName.trim(),
        relationship: relationship.trim() || undefined,
        birthDate: birthDate.trim() || undefined,
        remembranceDate: remembranceDate.trim() || undefined,
        title: title.trim(),
        story: story.trim(),
        favoriteFood: favoriteFood.trim() || undefined,
        favoriteSong: favoriteSong.trim() || undefined,
        favoritePlace: favoritePlace.trim() || undefined,
        sayings: sayings.trim() || undefined,
        photoUrl: photoUrl || undefined,
        tags: tags.length > 0 ? tags : ['Remembrance'],
        isFavorite: initialMemory?.isFavorite ?? false,
        onAltar,
        altarDedication: altarDedication.trim() || undefined,
        altarCandleType,
        isFictionalSample: initialMemory?.isFictionalSample ?? false,
        writings: initialMemory?.writings || [],
        createdAt: initialMemory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(memoryToSave);
      onClose();
    } catch (err) {
      console.error('Failed to save memory:', err);
      setErrors((prev) => ({ ...prev, submit: 'Failed to write to local storage. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-3xl my-8 bg-[#15120F] border border-[#B89A61]/30 rounded-xl shadow-2xl text-[#F2E8D8] overflow-hidden">
        {/* Header banner */}
        <div className="px-6 py-5 border-b border-[rgba(242,232,216,0.08)] flex items-center justify-between bg-[#191512]">
          <div>
            <h2 id="modal-title" className="font-serif text-2xl font-normal text-[#F2E8D8]">
              {initialMemory ? 'Edit Memory' : 'Preserve a Memory'}
            </h2>
            <p className="text-xs text-[#A39686] mt-0.5">
              Saved strictly on this device. Never uploaded to external servers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A39686] hover:text-[#F2E8D8] rounded-md hover:bg-[#25201A] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errors.submit && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-md">
              {errors.submit}
            </div>
          )}

          {/* Core Subject Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="personName" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Name of Person, Pet, or Subject *
              </label>
              <input
                id="personName"
                type="text"
                required
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="e.g. Abuela Sofía, Barnaby, Mateo"
                className={`w-full px-3 py-2 text-sm bg-[#1C1814] border ${
                  errors.personName ? 'border-red-500' : 'border-[#382E24]'
                } rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]`}
              />
              {errors.personName && (
                <span className="text-xs text-red-400 mt-1 block">{errors.personName}</span>
              )}
            </div>

            <div>
              <label htmlFor="relationship" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Relationship or Description (optional)
              </label>
              <input
                id="relationship"
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Beloved Grandmother, Childhood Companion"
                className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Birth Date (optional)
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>

            <div>
              <label htmlFor="remembranceDate" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Remembrance / Passing Date (optional)
              </label>
              <input
                id="remembranceDate"
                type="date"
                value={remembranceDate}
                onChange={(e) => setRemembranceDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>
          </div>

          {/* Memory Title & Story */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Memory Title *
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Scent of Orange Blossoms at Dawn"
                className={`w-full px-3 py-2 text-sm bg-[#1C1814] border ${
                  errors.title ? 'border-red-500' : 'border-[#382E24]'
                } rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]`}
              />
              {errors.title && <span className="text-xs text-red-400 mt-1 block">{errors.title}</span>}
            </div>

            <div>
              <label htmlFor="story" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Memory in Your Own Words *
              </label>
              <textarea
                id="story"
                rows={5}
                required
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Describe how they walked into a room, a quiet morning together, an unhurried conversation, or the small habits that made them irreplaceable..."
                className={`w-full px-3 py-2 text-sm bg-[#1C1814] border ${
                  errors.story ? 'border-red-500' : 'border-[#382E24]'
                } rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E] leading-relaxed`}
              />
              {errors.story && <span className="text-xs text-red-400 mt-1 block">{errors.story}</span>}
            </div>
          </div>

          {/* Photo upload section */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
              Photograph / Portrait Keepsake
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="relative w-32 h-40 rounded-lg bg-[#191512] border border-[#382E24] overflow-hidden flex items-center justify-center shrink-0">
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt={personName || 'Memory portrait'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl(undefined)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-red-400 rounded-md transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2 text-[#736555]">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[11px] block">No Photo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-xs text-[#A39686]">
                  Upload a photo from your computer or phone. Images remain stored solely in your local browser IndexedDB.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#F2E8D8] bg-[#1F1B16] border border-[#382E24] rounded-md hover:border-[#F4B75E] transition-colors">
                    <Upload className="w-3.5 h-3.5 text-[#F4B75E]" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preset illustration shortcuts */}
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(SAMPLE_PORTRAITS.abuelaSofia)}
                    className="px-2.5 py-1 text-[11px] text-[#A39686] hover:text-[#F2E8D8] bg-[#1C1814] rounded border border-[#2B231C] hover:border-[#B89A61]"
                  >
                    Use Vintage Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(SAMPLE_PORTRAITS.barnabyDog)}
                    className="px-2.5 py-1 text-[11px] text-[#A39686] hover:text-[#F2E8D8] bg-[#1C1814] rounded border border-[#2B231C] hover:border-[#B89A61]"
                  >
                    Use Pet Silhouette
                  </button>
                </div>
                {errors.photo && <span className="text-xs text-red-400 block">{errors.photo}</span>}
              </div>
            </div>
          </div>

          {/* Sensory Touchstones: Food, Song, Place, Sayings */}
          <div className="border-t border-[rgba(242,232,216,0.08)] pt-4">
            <h3 className="font-serif text-lg font-medium text-[#F4B75E] mb-3">
              Sensory Touchstones
            </h3>
            <p className="text-xs text-[#A39686] mb-4">
              These personal details anchor your memory and help the local storytelling model craft evocative, faithful passages.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="food" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                  Favorite Food or Recipe
                </label>
                <input
                  id="food"
                  type="text"
                  value={favoriteFood}
                  onChange={(e) => setFavoriteFood(e.target.value)}
                  placeholder="e.g. Pan de muerto with hot chocolate, roast chicken"
                  className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
                />
              </div>

              <div>
                <label htmlFor="song" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                  Favorite Song or Music
                </label>
                <input
                  id="song"
                  type="text"
                  value={favoriteSong}
                  onChange={(e) => setFavoriteSong(e.target.value)}
                  placeholder="e.g. Sabor a Mí, Moonlight Sonata, 70s rock"
                  className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
                />
              </div>

              <div>
                <label htmlFor="place" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                  Favorite Place or Haven
                </label>
                <input
                  id="place"
                  type="text"
                  value={favoritePlace}
                  onChange={(e) => setFavoritePlace(e.target.value)}
                  placeholder="e.g. The wooden porch swing, seaside cabin"
                  className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
                />
              </div>

              <div>
                <label htmlFor="sayings" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                  Memorable Sayings / Words
                </label>
                <input
                  id="sayings"
                  type="text"
                  value={sayings}
                  onChange={(e) => setSayings(e.target.value)}
                  placeholder="e.g. 'Leave the door unlocked until everyone is in'"
                  className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
                />
              </div>
            </div>
          </div>

          {/* Tags & Altar Settings */}
          <div className="border-t border-[rgba(242,232,216,0.08)] pt-4 space-y-4">
            <div>
              <label htmlFor="tags" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                type="text"
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Family, Autumn, Music, Cooking, Mentors"
                className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
              />
            </div>

            <div className="p-4 rounded-lg bg-[#1C1814] border border-[#382E24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-medium text-[#F2E8D8] block">Place on Digital Ofrenda</span>
                <span className="text-xs text-[#A39686]">
                  Displays this memory frame with candlelight on the remembrance altar.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={onAltar}
                  onChange={(e) => setOnAltar(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#2B241E] peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E87932]" />
              </label>
            </div>

            {onAltar && (
              <div>
                <label htmlFor="altarDedication" className="block text-xs uppercase tracking-wider text-[#B89A61] mb-1">
                  Altar Dedication Card (optional)
                </label>
                <input
                  id="altarDedication"
                  type="text"
                  value={altarDedication}
                  onChange={(e) => setAltarDedication(e.target.value)}
                  placeholder="e.g. Always at the center of the kitchen and our hearts"
                  className="w-full px-3 py-2 text-sm bg-[#1C1814] border border-[#382E24] rounded-md text-[#F2E8D8] placeholder-[#736555] focus:outline-hidden focus:border-[#F4B75E]"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[rgba(242,232,216,0.08)] pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-[#A39686] hover:text-[#F2E8D8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs sm:text-sm font-medium text-[#090807] bg-[#F4B75E] rounded-lg hover:bg-[#F2E8D8] disabled:opacity-50 transition-all shadow-md font-semibold"
            >
              {isSubmitting ? 'Preserving...' : initialMemory ? 'Update Memory' : 'Save to Archive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
