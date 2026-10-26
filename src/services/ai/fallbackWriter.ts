import { GenerationMode, GenerationTone, Memory } from '../../types/memory';

/**
 * Clearly labeled non-AI template synthesizer.
 * Used when WebGPU is unavailable or when the user prefers an instant,
 * deterministic offline draft without waiting for large neural network weights.
 */
export function generateTemplateDraft(
  memory: Partial<Memory>,
  mode: GenerationMode,
  tone: GenerationTone
): { title: string; content: string; label: string } {
  const name = memory.personName?.trim() || 'A Cherished Soul';
  const rel = memory.relationship?.trim() ? ` (${memory.relationship})` : '';
  const food = memory.favoriteFood?.trim();
  const song = memory.favoriteSong?.trim();
  const place = memory.favoritePlace?.trim();
  const sayings = memory.sayings?.trim();
  const story = memory.story?.trim() || 'The quiet days and simple joys that bound our hearts together.';

  let draft = '';

  switch (mode) {
    case 'remembrance':
      draft = `If you look for me, do not look in the silence of cold stone. Look for me where the light falls longest across the afternoon floor.

${story}

${food ? `Whenever the scent of ${food} rises in the kitchen, know that I am smiling beside you.` : ''}
${song ? `And when you hear "${song}", let the melody carry the warmth of every quiet hour we shared.` : ''}
${place ? `I left a piece of my spirit in ${place}, waiting for the days you need to rest and remember.` : ''}

${sayings ? `Hold fast to what I always told you: "${sayings}".` : 'Keep the gentle memories close, and let the laughter outshine the grief.'}

Some things disappear from this earth, but what is loved never truly leaves. Keep a small candle lit, and walk forward in peace.`;
      break;

    case 'letter':
      draft = `Dearest ${name},

I sat down today in the quiet of this room to write down what the passing days can never erase.

${story}

${place ? `I found myself thinking of ${place}—how the world seemed to slow down whenever you were there.` : ''}
${food ? `I still cannot taste ${food} without hearing your voice across the table.` : ''}
${song ? `Yesterday, "${song}" came into my thoughts, and for a moment, the distance between then and now felt as thin as paper.` : ''}

${sayings ? `I still hear you saying: "${sayings}". You were right, as you so often were.` : 'Thank you for every quiet kindness and every lesson left unsaid.'}

The light you left burning is safe with me. Until we meet in the quiet stories, you remain deeply loved and fiercely remembered.

With all my love and reverence,
Forever yours.`;
      break;

    case 'ghost_story':
      draft = `They say that in November, when the autumn mist hangs low over the roofs and the marigold petals scatter like embers, the house remembers every step that ever walked upon its pine floors.

This was the realm of ${name}${rel}.

${story}

The neighbors used to say you could always tell when ${name} was near—${place ? `whether walking through ${place}` : 'even in the quiet corners of the porch'}, there was an unmistakable presence of warmth. ${song ? `Sometimes, right around twilight, a hum resembling "${song}" seemed to ride the cool October breeze.` : ''}

No frightening apparitions walk these halls; only the tender, protective presence of someone whose love was too deep to ever truly fade into the dark. ${food ? `A phantom scent of ${food} still lingers near the stove.` : ''} A light left burning, answering the autumn cold with enduring grace.`;
      break;

    case 'poem':
      draft = `Upon the quiet threshold where the shadows slowly lean,
We trace the golden contours of the days that we have seen.
${name}, in whose gentle eyes the autumn sunlight shone,
Whose steady heart became the hearth that made a house our home.

${story}

${place ? `In ${place} the leaves are turning, amber, bronze, and red,\n` : ''}${song ? `While in the silence of the room, "${song}" is quietly led.\n` : ''}${food ? `The fragrance of ${food} remains upon the evening air,\n` : ''}${sayings ? `And still your voice repeats the words: "${sayings}".\n` : ''}
No darkness takes what memory has gathered in its fold;
The candle burns, the marigold blooms in triumphant gold.
A story whispered to the stars, a spirit resting free,
Carried across the years to come in endless reverie.`;
      break;

    case 'family_history':
      draft = `AN ARCHIVAL RECORD OF REMEMBRANCE: ${name.toUpperCase()}

Subject: ${name}${rel}
Dates: ${memory.birthDate || 'Recorded in memory'} — ${memory.remembranceDate || 'Enduring in story'}
Title of Record: ${memory.title || 'A Life Well Lived'}

1. CHRONICLE AND CHARACTER
${story}

2. TRADITIONS AND MEANINGFUL KEEPSAKES
${food ? `• Culinary Heritage: Known for loving ${food}, often prepared and shared with family during celebrations.` : ''}
${place ? `• Cherished Sanctuary: ${place}, a location closely tied to significant family gatherings and personal solace.` : ''}
${song ? `• Enduring Melody: "${song}", a piece of music that came to symbolize their spirit and era.` : ''}
${sayings ? `• Words to Live By: "${sayings}"` : ''}

3. TESTAMENT FOR FUTURE GENERATIONS
This entry stands in the permanent private chronicle of our family. Let all who read these lines remember that ${name} lived with purpose, brought warmth to those around them, and left a light that will not be extinguished by the passage of time.`;
      break;
  }

  return {
    title: `${mode.replace('_', ' ').toUpperCase()} (${tone})`,
    content: draft.trim(),
    label: 'Locally Synthesized Template (Deterministic Non-AI Composition)',
  };
}
