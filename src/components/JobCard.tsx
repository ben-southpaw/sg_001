import React from 'react';
import Link from 'next/link';
import { JobData } from '@/utils/jobUtils';

interface JobCardProps {
	job: JobData;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
	const introTeaser = job.intro
		? job.intro.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 100) + '...'
		: '';

	const formatDate = (timestamp: number | null): string => {
		if (!timestamp) return 'Date not available';

		// Need to multiply by 1000 because our timestamps are in seconds not milliseconds
		const date = new Date(timestamp * 1000);

		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'long' });
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	};

	const jobDate = job.date?.timestamp?.[0]
		? formatDate(job.date.timestamp[0])
		: 'Date not available';

	return (
		<Link
			href={`/jobs/${job.jobId}`}
			className="block no-underline text-inherit group h-full"
		>
			<div
				className="relative h-full overflow-hidden border border-gray-300 rounded-lg p-6 bg-white
                    shadow-[3px_2px_10px_-5px_rgba(0,0,0,0.51)]
                    transition-all duration-500 ease-in-out
                    hover:shadow-[0_0_0.8vw_rgba(0,0,0,0.25)] 
                    group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-blue-50"
			>
				<h3 className="text-xl font-semibold text-blue-700 group-hover:text-blue-800 transition-colors duration-300">
					{job.title}
				</h3>

				<div className="mt-3 flex flex-wrap gap-2">
					{job.specs?.city && (
						<span
							className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700
                          transition-all duration-300 ease-in-out
                          group-hover:bg-blue-100 group-hover:text-blue-800 group-hover:shadow-sm"
						>
							{job.specs?.city}
						</span>
					)}
					{job.specs?.region && (
						<span
							className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700
                          transition-all duration-300 ease-in-out
                          group-hover:bg-blue-100 group-hover:text-blue-800 group-hover:shadow-sm"
						>
							{job.specs?.region}
						</span>
					)}
					{job.specs?.industry && (
						<span
							className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700
                          transition-all duration-300 ease-in-out
                          group-hover:bg-blue-100 group-hover:text-blue-800 group-hover:shadow-sm"
						>
							{job.specs?.industry}
						</span>
					)}
					{job.specs?.experienceLevel && (
						<span
							className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700
                          transition-all duration-300 ease-in-out
                          group-hover:bg-blue-100 group-hover:text-blue-800 group-hover:shadow-sm"
						>
							{job.specs?.experienceLevel}
						</span>
					)}
				</div>

				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
					<p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 flex-1">
						{introTeaser}
					</p>
					<span
						className="text-sm text-gray-500 whitespace-nowrap group-hover:text-blue-600 transition-colors duration-300 
                        border-t sm:border-t-0 sm:border-l border-gray-200 group-hover:border-blue-200 
                        pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto"
					>
						{jobDate}
					</span>
				</div>

				{/* Apply now indicator that appears on hover */}
				<div className="flex justify-end mt-3 overflow-hidden">
					<span
						className="text-sm font-medium text-blue-600 transform translate-y-8 opacity-0 
                        group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out
                        flex items-center"
					>
						View job
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 ml-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</span>
				</div>
			</div>
		</Link>
	);
};

export default JobCard;
