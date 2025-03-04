/**
 * Utility functions for text processing
 */

/**
 * Normalizes text by converting to lowercase and replacing special characters
 * with their basic Latin equivalents. Useful for search functionality.
 * 
 * @param text - The text to normalize
 * @returns Normalized text string
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  
  let normalized = text.toLowerCase();
  
  // Replace characters with Latin equivalents
  const replacements: {[key: string]: string} = {
    'ä': 'a', 'á': 'a', 'à': 'a', 'â': 'a',
    'ë': 'e', 'é': 'e', 'è': 'e', 'ê': 'e',
    'ï': 'i', 'í': 'i', 'ì': 'i', 'î': 'i',
    'ö': 'o', 'ó': 'o', 'ò': 'o', 'ô': 'o',
    'ü': 'u', 'ú': 'u', 'ù': 'u', 'û': 'u',
    'ÿ': 'y', 'ý': 'y', 'ỳ': 'y',
    'ç': 'c', 'ñ': 'n', 'ß': 'ss',
    'œ': 'oe', 'æ': 'ae', 'ø': 'o', 'å': 'a',
  };
  
  for (const [special, basic] of Object.entries(replacements)) {
    normalized = normalized.replace(new RegExp(special, 'g'), basic);
  }
  
  return normalized;
}
