import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import jobData from '@/data/jobSearchData.json';
import { JobData } from '@/utils/jobUtils';
import JobDetailsClient from '@/components/JobDetailsClient';

//generates all possible job pages at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = jobData.map((job) => ({
    params: { jobId: job.jobId },
  }));

  return {
    paths,
    fallback: false, // show 404 
  };
};

// data 4 each page at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const jobId = params?.jobId as string;
  const job = jobData.find((job) => job.jobId === jobId);

  if (!job) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      job,
    },
  };
};

interface JobDetailsPageProps {
  job: JobData;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ job }) => {

  const router = useRouter();

  if (router.isFallback) {
    return <div className="max-w-4xl mx-auto px-4 py-8">Loading...</div>;
  }

  const createMarkup = (htmlContent: string): { __html: string } => {
    return { __html: htmlContent || '' };
  };

  const formatDate = (timestamp: number | null): string => {
    if (!timestamp) return 'Date not available';
    
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const jobDate = job.date?.timestamp?.[0] ? formatDate(job.date.timestamp[0]) : 'Date not available';



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back
      </Link>

      <h1 className="text-3xl font-bold text-blue-800 mb-2">{job.title}</h1>
      <div className="text-gray-600 mb-4">Posted: {jobDate}</div>

      {job.specs && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Job Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {job.specs.city && (
              <div>
                <span className="font-medium">City:</span> {job.specs.city}
              </div>
            )}
            {job.specs.region && (
              <div>
                <span className="font-medium">Region:</span> {job.specs.region}
              </div>
            )}
            {job.specs.industry && (
              <div>
                <span className="font-medium">Industry:</span>{' '}
                {job.specs.industry}
              </div>
            )}
            {job.specs.experienceLevel && (
              <div>
                <span className="font-medium">Experience:</span>{' '}
                {job.specs.experienceLevel}
              </div>
            )}
            {job.specs.educationLevel && (
              <div>
                <span className="font-medium">Education:</span>{' '}
                {job.specs.educationLevel}
              </div>
            )}
            {job.specs.hoursPerWeek && (
              <div>
                <span className="font-medium">Hours per week:</span>{' '}
                {job.specs.hoursPerWeek}
              </div>
            )}
            {job.specs.function && (
              <div>
                <span className="font-medium">Function:</span>{' '}
                {job.specs.function}
              </div>
            )}
            {job.specs.functionGroup && (
              <div>
                <span className="font-medium">Function Group:</span>{' '}
                {job.specs.functionGroup}
              </div>
            )}
            {job.specs.sector && (
              <div>
                <span className="font-medium">Sector:</span> {job.specs.sector}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job introduction */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
        {job.intro && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={createMarkup(job.intro)}
          />
        )}
        
        {job.recruiter && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <span className="font-medium">Recruiter:</span> {job.recruiter}
          </div>
        )}
      </div>

      {/* Apply section - using client component for interactivity */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for this position</h2>
        <JobDetailsClient job={job} />
      </div>
    </div>
  );
};

export default JobDetailsPage;
