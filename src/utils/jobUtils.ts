/**
 * Utility functions for job data processing
 */

import { normalizeText } from './textUtils';
import { SearchFilters } from './types';

// TODO: Define more specific and comprehensive interface
// Using a simpler interface for now due to time constraints
export interface JobData {
  jobId: string;
  title: string;
  intro: string;
  industry?: string;
  recruiter?: string;
  date?: any; // Using any to simplify
  specs?: any; // Using any to simplify
  _normalized?: any; // Using any to simplify
}

/**
 * Creates a normalized version of a job for efficient searching
 * 
 * @param job - The job data to normalize
 * @returns The job data with added normalized properties
 */
export function normalizeJob(job: any): any {
  // Simplified normalization
  const normalizedSpecs: {[key: string]: string} = {};
  
  if (job.specs) {
    for (const key in job.specs) {
      const value = job.specs[key];
      if (value) normalizedSpecs[key] = normalizeText(String(value));
    }
  }
  
  return {
    ...job,
    _normalized: {
      title: normalizeText(job.title || ''),
      intro: normalizeText(job.intro || ''),
      specs: normalizedSpecs
    }
  };
}

/**
 * Applies filters to a job
 * 
 * @param job - The job to check against filters
 * @param filters - The filters to apply
 * @returns Boolean check
 */
export function applySpecFilters(job: any, filters: SearchFilters): boolean {
  // Check regions
  if (filters.regions.length > 0) {
    if (!job.specs || !job.specs.region || !filters.regions.includes(job.specs.region)) {
      return false;
    }
  }
  
  if (filters.industries.length > 0) {
    if (!job.specs || !job.specs.industry || !filters.industries.includes(job.specs.industry)) {
      return false;
    }
  }
  
  if (filters.experienceLevels.length > 0) {
    if (!job.specs || !job.specs.experienceLevel || !filters.experienceLevels.includes(job.specs.experienceLevel)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Filter jobs based on search term and filters
 * 
 * @param jobs - Array of jobs
 * @param searchTerm - Text to searchn
 * @param filters - Filter job specs
 * @returns Filtered jobs
 */
export function filterJobs(jobs: JobData[], searchTerm: string, filters: SearchFilters): JobData[] {
  const normalizedSearchTerm = normalizeText(searchTerm);
  
  return jobs.filter(job => {
    // Apply specs filters 
    if (!applySpecFilters(job, filters)) {
      return false;
    }
    
    // If no search term, include all jobs 
    if (!normalizedSearchTerm) {
      return true;
    }
    
    // Prepare job data for search if not already normalized
    const normalizedJob = job._normalized || normalizeJob(job)._normalized;
    
    // Check if search term is found in title or intro
    if (normalizedJob.title.includes(normalizedSearchTerm) || 
        normalizedJob.intro.includes(normalizedSearchTerm)) {
      return true;
    }
    
    return false;
  });
}
