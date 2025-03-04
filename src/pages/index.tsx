import React, { useState, useEffect } from 'react';
import SearchFilter from '@/components/SearchFilter';
import JobCard from '@/components/JobCard';
import jobData from '@/data/jobSearchData.json';
import { JobData, filterJobs } from '@/utils/jobUtils';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>(jobData);
  const [selectedFilters, setSelectedFilters] = useState({
    regions: [] as string[],
    industries: [] as string[],
    experienceLevels: [] as string[],
  });

  // Initialize available filter options
  const regions: string[] = Array.from(
    new Set(
      jobData
        .map((job) => job.specs?.region)
        .filter((region): region is string => Boolean(region))
    )
  );

  const industries: string[] = Array.from(
    new Set(
      jobData
        .map((job) => job.specs?.industry)
        .filter((industry): industry is string => Boolean(industry))
    )
  );

  const experienceLevels: string[] = Array.from(
    new Set(
      jobData
        .map((job) => job.specs?.experienceLevel)
        .filter(
          (experienceLevel): experienceLevel is string =>
            Boolean(experienceLevel)
        )
    )
  );

  // Update filtered jobs whenever search term or filters change
  useEffect(() => {
    const filtered = filterJobs(jobData, searchTerm, selectedFilters);
    setFilteredJobs(filtered);
  }, [searchTerm, selectedFilters]);

  const handleFilterChange = (
    filterType: 'regions' | 'industries' | 'experienceLevels',
    values: string[]
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: values,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-blue-800">Small Giants Job Board</h1>
          <p className="text-gray-600 mt-2">
            Find opportunities with companies that value purpose, people, and profit
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Search Jobs</h2>
              
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search by job title or keyword"
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <SearchFilter
                regions={regions}
                industries={industries}
                experienceLevels={experienceLevels}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Job listings */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              {filteredJobs.length} Jobs Found
            </h2>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.jobId} 
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find more opportunities.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
