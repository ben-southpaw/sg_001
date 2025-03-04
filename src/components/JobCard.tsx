import React from 'react';
import Link from 'next/link';
import { JobData } from '@/utils/jobUtils';

interface JobCardProps {
  job: JobData;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const introTeaser = job.intro
    ? job.intro.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 100) + "..."
    : "";
    
  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'Date not available';
    
    // Need to multiply by 1000 because our timestamps are in seconds not milliseconds
    const date = new Date(timestamp * 1000);
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  
  const jobDate = job.date?.timestamp?.[0] ? formatDate(job.date.timestamp[0]) : 'Date not available';

  return (
    <Link href={`/jobs/${job.jobId}`} className="block no-underline text-inherit">
      <div className="border border-gray-300 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow duration-200 fade-in-out">
        <h3 className="text-xl font-semibold text-blue-700">
          {job.title}
        </h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {job.specs?.city && (
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {job.specs?.city}
            </span>
          )}
          {job.specs?.region && (
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {job.specs?.region}
            </span>
          )}
          {job.specs?.industry && (
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {job.specs?.industry}
            </span>
          )}
          {job.specs?.experienceLevel && (
            <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              {job.specs?.experienceLevel}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">
            {introTeaser}
          </p>
          <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
            {jobDate}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
