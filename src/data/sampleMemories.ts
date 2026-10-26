import { Memory, AltarItem } from '../types/memory';

// Elegant embedded SVG silhouettes & vintage portraits so no external image requests are ever made
export const SAMPLE_PORTRAITS = {
  abuelaSofia: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400">
      <defs>
        <radialGradient id="vbg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#3A2D23" />
          <stop offset="100%" stop-color="#14100D" />
        </radialGradient>
      </defs>
      <rect width="320" height="400" fill="url(#vbg)"/>
      <circle cx="160" cy="140" r="65" fill="#E8D7C3" opacity="0.9" />
      <!-- Silver braided hair -->
      <path d="M95 140 Q160 50 225 140 Q225 90 160 70 Q95 90 95 140 Z" fill="#C2B8A8" />
      <path d="M120 185 Q160 210 200 185" stroke="#9C826A" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- Rebozo Shawl -->
      <path d="M70 260 Q160 210 250 260 L280 400 L40 400 Z" fill="#753518" opacity="0.95" />
      <path d="M110 250 Q160 280 210 250" stroke="#F4B75E" stroke-width="2" stroke-dasharray="6 6" fill="none" />
      <text x="160" y="375" text-anchor="middle" fill="#F2E8D8" font-family="serif" font-size="14" letter-spacing="3" opacity="0.8">ABUELA SOFÍA · 1938–2021</text>
    </svg>
  `)}`,
  barnabyDog: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400">
      <defs>
        <radialGradient id="dbg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#2E281F" />
          <stop offset="100%" stop-color="#110E0B" />
        </radialGradient>
      </defs>
      <rect width="320" height="400" fill="url(#dbg)"/>
      <!-- Golden retriever silhouette with warm lighting -->
      <circle cx="160" cy="150" r="70" fill="#D49E58" opacity="0.9" />
      <path d="M100 130 C90 190 110 220 130 200" fill="#9E6E32" />
      <path d="M220 130 C230 190 210 220 190 200" fill="#9E6E32" />
      <ellipse cx="160" cy="180" rx="35" ry="25" fill="#E8BE78" />
      <circle cx="160" cy="175" r="10" fill="#2A1B0E" />
      <!-- Maple leaf accent -->
      <path d="M160 290 Q175 270 195 285 Q180 300 160 290 Z" fill="#E87932" opacity="0.8" />
      <text x="160" y="375" text-anchor="middle" fill="#F2E8D8" font-family="serif" font-size="14" letter-spacing="3" opacity="0.8">BARNABY · THE GOOD BOY</text>
    </svg>
  `)}`,
  mateoMusician: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400" width="320" height="400">
      <defs>
        <radialGradient id="mbg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#24212E" />
          <stop offset="100%" stop-color="#0E0D14" />
        </radialGradient>
      </defs>
      <rect width="320" height="400" fill="url(#mbg)"/>
      <circle cx="160" cy="130" r="55" fill="#D1C4B4" opacity="0.85" />
      <!-- Fedora hat -->
      <path d="M90 110 Q160 85 230 110 Q210 70 160 65 Q110 70 90 110 Z" fill="#1C1A24" />
      <!-- Guitar outline -->
      <ellipse cx="160" cy="280" rx="60" ry="75" fill="#87532A" opacity="0.9" />
      <circle cx="160" cy="250" r="18" fill="#15120F" />
      <path d="M160 175 L160 240" stroke="#B89A61" stroke-width="4" />
      <text x="160" y="375" text-anchor="middle" fill="#F2E8D8" font-family="serif" font-size="14" letter-spacing="3" opacity="0.8">MATEO · 1944–2018</text>
    </svg>
  `)}`
};

export const INITIAL_FICTIONAL_MEMORIES: Memory[] = [
  {
    id: 'fictional-sample-1',
    personName: 'Sofía Elena Morales',
    relationship: 'Grandmother (Abuela)',
    birthDate: '1938-04-12',
    remembranceDate: '2021-11-03',
    title: 'The Scent of Anise and Pan de Muerto',
    story: 'Every November, the kitchen smelled of roasted orange peel, warm butter, and crushed star anise. Abuela never measured anything with spoons; she measured with the palm of her hand. She said that kneading dough was the only honest way to say thank you to the earth. She kept all her needles in an old Danish butter cookie tin and had a laugh that could quiet an entire room of arguing cousins.',
    favoriteFood: 'Pan de muerto dipped in Mexican hot chocolate with extra cinnamon',
    favoriteSong: 'Sabor a Mí (Trio Los Panchos)',
    favoritePlace: 'Her porch garden overlooking the flowering bougainvillea in Oaxaca',
    sayings: '“No te preocupes por lo que no tiene remedio, y si lo tiene, ¿para qué te preocupas?” (Don’t worry about what has no remedy, and if it has one, why worry?)',
    photoUrl: SAMPLE_PORTRAITS.abuelaSofia,
    tags: ['Family', 'Tradition', 'Cooking', 'Oaxaca'],
    isFavorite: true,
    onAltar: true,
    altarDedication: 'Para nuestra reina de la cocina y el corazón',
    altarCandleType: 'tall',
    isFictionalSample: true,
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    writings: [
      {
        id: 'writing-sample-1',
        memoryId: 'fictional-sample-1',
        mode: 'remembrance',
        tone: 'tender',
        prompt: 'First-person remembrance focusing on kneading dough at dawn.',
        content: 'If you listen closely when the dawn turns the window glass the color of warm milk, you can still hear the rhythmic thud of the wooden board on the counter. The flour would rise like quiet smoke in the slant of early sunlight. I never needed clocks; my hands knew when the dough was resting, just as they knew when one of you needed to sit quietly on the wooden stool beside me without speaking a single word.',
        createdAt: '2026-10-02T14:30:00.000Z',
        modelUsed: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'
      }
    ]
  },
  {
    id: 'fictional-sample-2',
    personName: 'Barnaby',
    relationship: 'Beloved Golden Retriever',
    birthDate: '2012-05-18',
    remembranceDate: '2025-08-14',
    title: 'Guardian of the Front Porch',
    story: 'Barnaby was eighty pounds of pure golden loyalty. Whenever anyone opened a string cheese wrapper, he would appear from another floor of the house in less than two seconds without making a sound. In October, he would bury tennis balls in the pile of raked oak leaves and look genuinely astonished every time we found them again. He slept with his chin pressed firmly across my sneakers so I could never sneak out without giving him a scratch behind the ears.',
    favoriteFood: 'Baby carrots and the rind of sharp cheddar',
    favoriteSong: 'The squeak of the red rubber duck at 7 AM',
    favoritePlace: 'The sunny rectangle of light on the living room rug that moved throughout the day',
    sayings: 'A gentle heavy sigh when he finally curled into his bed after checking all doors.',
    photoUrl: SAMPLE_PORTRAITS.barnabyDog,
    tags: ['Pets', 'Companions', 'Autumn', 'Dogs'],
    isFavorite: true,
    onAltar: true,
    altarDedication: 'The gentlest soul who taught us what unconditional devotion looks like',
    altarCandleType: 'tea',
    isFictionalSample: true,
    createdAt: '2026-10-05T09:00:00.000Z',
    updatedAt: '2026-10-05T09:00:00.000Z',
    writings: [
      {
        id: 'writing-sample-2',
        memoryId: 'fictional-sample-2',
        mode: 'poem',
        tone: 'poetic',
        prompt: 'Poem preserving the golden rectangle of sunlight.',
        content: 'Across the wooden floor the amber square would creep,\nAnd there you made your kingdom, between waking and deep sleep.\nA nose that knew each traveler before they touched the latch,\nA soft, contented sigh whenever given half a scratch.\nThe leaves still fall in golden mounds upon the quiet lawn;\nThe house remembers where you lay, though eighty pounds are gone.',
        createdAt: '2026-10-06T10:15:00.000Z',
        modelUsed: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'
      }
    ]
  },
  {
    id: 'fictional-sample-3',
    personName: 'Mateo Navarro',
    relationship: 'Uncle & Jazz Guitarist',
    birthDate: '1944-09-02',
    remembranceDate: '2018-03-19',
    title: 'The Chords He Left in the Rain',
    story: 'Tío Mateo owned three suits and seven guitars. He played late sessions at basement clubs where the walls sweat and the smoke smelled of cloves and wet asphalt. He taught me that in music, the note you don’t play carries just as much truth as the note you do. His fingers had calluses like old pennies, but his vibrato on a bossa nova ballad would make the toughest bartenders pause mid-wipe and look up at the ceiling.',
    favoriteFood: 'Café de olla with piloncillo and warm churros at midnight',
    favoriteSong: 'Round Midnight (Thelonious Monk)',
    favoritePlace: 'The fire escape outside his 4th-floor apartment overlooking the rainy avenue',
    sayings: '“If your song doesn’t tell a secret, why bother waking the strings?”',
    photoUrl: SAMPLE_PORTRAITS.mateoMusician,
    tags: ['Music', 'Jazz', 'Memories', 'Mentors'],
    isFavorite: false,
    onAltar: true,
    altarDedication: 'Still tuning the silence between the chords',
    altarCandleType: 'glass',
    isFictionalSample: true,
    createdAt: '2026-10-10T16:00:00.000Z',
    updatedAt: '2026-10-10T16:00:00.000Z',
    writings: []
  }
];

export const INITIAL_ALTAR_ITEMS: AltarItem[] = [
  {
    id: 'altar-item-1',
    memoryId: 'fictional-sample-1',
    type: 'photo',
    tier: 1, // top tier
    posX: 50,
    photoUrl: SAMPLE_PORTRAITS.abuelaSofia,
    personName: 'Sofía Elena Morales'
  },
  {
    id: 'altar-item-2',
    memoryId: 'fictional-sample-2',
    type: 'photo',
    tier: 2, // middle tier
    posX: 32,
    photoUrl: SAMPLE_PORTRAITS.barnabyDog,
    personName: 'Barnaby'
  },
  {
    id: 'altar-item-3',
    memoryId: 'fictional-sample-3',
    type: 'photo',
    tier: 2, // middle tier
    posX: 68,
    photoUrl: SAMPLE_PORTRAITS.mateoMusician,
    personName: 'Mateo Navarro'
  },
  {
    id: 'altar-candle-1',
    type: 'candle',
    tier: 1,
    posX: 25,
    isLit: true
  },
  {
    id: 'altar-candle-2',
    type: 'candle',
    tier: 1,
    posX: 75,
    isLit: true
  },
  {
    id: 'altar-marigold-1',
    type: 'marigold',
    tier: 2,
    posX: 18
  },
  {
    id: 'altar-marigold-2',
    type: 'marigold',
    tier: 2,
    posX: 50
  },
  {
    id: 'altar-marigold-3',
    type: 'marigold',
    tier: 2,
    posX: 82
  },
  {
    id: 'altar-candle-3',
    type: 'candle',
    tier: 3,
    posX: 15,
    isLit: true
  },
  {
    id: 'altar-candle-4',
    type: 'candle',
    tier: 3,
    posX: 85,
    isLit: true
  },
  {
    id: 'altar-bread-1',
    type: 'bread',
    tier: 3,
    posX: 40
  },
  {
    id: 'altar-dedication-1',
    type: 'dedication',
    tier: 3,
    posX: 60,
    customText: 'A light left burning for the stories we refuse to lose.'
  }
];
