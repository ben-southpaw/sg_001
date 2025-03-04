import React, { useState, useRef } from 'react';
import ApplyForm from '@/components/ApplyForm';
import { JobData } from '@/utils/jobUtils';

interface JobDetailsClientProps {
  job: JobData;
}

const JobDetailsClient: React.FC<JobDetailsClientProps> = ({ job }) => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  
  const handleApplyClick = () => {
    setShowApplyForm(true);
    // Scroll to form after it renders
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  return (
    <div>
      {!showApplyForm ? (
        <button
          onClick={handleApplyClick}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200"
        >
          Apply for this position
        </button>
      ) : (
        <div ref={formRef}>
          <ApplyForm jobId={job.jobId} jobTitle={job.title} />
        </div>
      )}
    </div>
  );
};

export default JobDetailsClient;
