import { GenerationMode, GenerationTone, Memory } from '../../types/memory';

export const SYSTEM_ETHICS_INSTRUCTIONS = `You are a respectful, quiet literary memorial writer and poetic archivist.
Your purpose is to transform provided family memories, cherished moments, and personal recollections into gentle, beautifully composed creative literature.

CRITICAL ETHICAL RULES:
1. Grounded Remembrance: Strictly preserve the factual details, names, places, foods, songs, and sayings provided by the user. Never invent unmentioned family tragedies, contradictory facts, or false historical claims.
2. Honest Creative Representation: You are a creative literary instrument, NEVER a medium, spirit, or ghost. You must NEVER claim to speak from beyond the grave as an actual spirit, nor claim that the deceased is actively talking through you.
3. No Manipulative Predictions: Do not make supernatural prophecies, frightening warnings, guilt-inducing statements, or claims of magical communication.
4. Literary First-Person: When the requested format is a first-person remembrance, frame it purely as a poetic, nostalgic literary tribute honoring their memory, retaining warmth and emotional resonance.
5. Tone and Respect: Always treat human grief, love, and remembrance with dignity, tenderness, and gentle reverence. Avoid sensationalism or generic AI clichés.`;

export function buildPromptForMemory(
  memory: Partial<Memory>,
  mode: GenerationMode,
  tone: GenerationTone,
  customFocus?: string
): { system: string; user: string } {
  const modeDescriptions: Record<GenerationMode, string> = {
    remembrance:
      'A gentle first-person remembrance honoring the subject, written as an evocative personal monologue reflecting on the cherished moments.',
    letter:
      'A warm, tender letter addressed from the storyteller to the subject, speaking the quiet words of love, gratitude, and what remains.',
    ghost_story:
      'A quiet, atmospheric gothic fireside story (in the tradition of gentle autumn folklore) weaving the provided details into a timeless tale of presence and memory.',
    poem:
      'An evocative poem (4 to 6 stanzas) weaving the sensory details, favorite songs, places, and memorable sayings into resonant verse.',
    family_history:
      'An archival family-history chronicle suitable for future generations to read, capturing the character, atmosphere, and enduring legacy of this life.',
  };

  const toneInstructions: Record<GenerationTone, string> = {
    tender: 'Deeply gentle, compassionate, soft-spoken, and affectionate.',
    nostalgic: 'Warmly reflective, rich with sensory vintage textures, autumn warmth, and wistful fondness.',
    hopeful: 'Uplifting, focusing on the light left behind, resilience, and enduring joy.',
    mysterious: 'Quietly atmospheric, layered with twilight shadows, autumn winds, and candlelight.',
    poetic: 'Lyrical, rhythmic, rich in metaphor and tactile resonance.',
  };

  const detailsList: string[] = [];
  if (memory.personName) detailsList.push(`Subject: ${memory.personName}`);
  if (memory.relationship) detailsList.push(`Relationship: ${memory.relationship}`);
  if (memory.birthDate || memory.remembranceDate) {
    detailsList.push(
      `Dates: ${memory.birthDate || 'Unknown'} to ${memory.remembranceDate || 'Present in memory'}`
    );
  }
  if (memory.title) detailsList.push(`Memory Title: ${memory.title}`);
  if (memory.story) detailsList.push(`Core Story & Details:\n"${memory.story}"`);
  if (memory.favoriteFood) detailsList.push(`Favorite Food / Recipe: ${memory.favoriteFood}`);
  if (memory.favoriteSong) detailsList.push(`Favorite Song / Music: ${memory.favoriteSong}`);
  if (memory.favoritePlace) detailsList.push(`Favorite Place: ${memory.favoritePlace}`);
  if (memory.sayings) detailsList.push(`Memorable Sayings / Words: "${memory.sayings}"`);
  if (customFocus) detailsList.push(`Specific Artistic Focus Requested: "${customFocus}"`);

  const userPrompt = `Please compose: ${modeDescriptions[mode]}

Tone: ${toneInstructions[tone]}

Here are the sacred details provided by the storyteller:
----------------------------------------
${detailsList.join('\n')}
----------------------------------------

Please write the passage with care. Do not output conversational filler or system meta-talk. Lead directly into the writing.`;

  return {
    system: SYSTEM_ETHICS_INSTRUCTIONS,
    user: userPrompt,
  };
}
