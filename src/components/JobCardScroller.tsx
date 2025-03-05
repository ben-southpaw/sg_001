import React, { useRef } from 'react';
import { JobData } from '@/utils/jobUtils';
import JobCard from './JobCard';

interface JobCardScrollerProps {
	jobs: JobData[];
	currentIndex?: number;
}

const JobCardScroller: React.FC<JobCardScrollerProps> = ({ jobs, currentIndex = 0 }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	if (jobs.length === 0) {
		return null;
	}

	return (
		<div
			ref={containerRef}
			className="w-full h-full flex items-center justify-center overflow-hidden"
			style={{ touchAction: 'none' }} // Prevent default touch actions
		>
			<div className="w-full h-full transform transition-all duration-500 ease-in-out">
				<JobCard job={jobs[currentIndex]} />
			</div>
		</div>
	);
};

export default JobCardScroller;
