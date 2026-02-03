
export interface Reflection {
  id: string;
  text: string;
  vibe: string;
  timestamp: number;
  gradient: string;
}

/* Postcard interface for generated creative outputs */
export interface Postcard {
  imageUrl: string;
  destination: string;
  message: string;
}

export const VIBES = [
  { name: 'Serenity', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Vitality', color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)' },
  { name: 'Focus', color: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },
  { name: 'Ethereal', color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { name: 'Grounded', color: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)' },
  { name: 'Midnight', color: 'linear-gradient(135deg, #09203f 0%, #537895 100%)' },
  { name: 'Sunset', color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { name: 'Bloom', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }
];
