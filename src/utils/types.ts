/**
 * Shared type definitions for search and filtering functionality
 */

/**
 * Interface for search filters
 */
export interface SearchFilters {
  regions: string[];
  industries: string[];
  experienceLevels: string[];
  
  // TODO: Add searchInDescription option later
}
