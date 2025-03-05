import React, { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import jobData from '@/data/jobSearchData.json';
import { JobData } from '@/utils/jobUtils';
import JobDetailsClient from '@/components/JobDetailsClient';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = jobData.map((job) => ({
		params: { jobId: job.jobId },
	}));

	return {
		paths,
		fallback: false, // show 404
	};
};

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

		const date = new Date(timestamp * 1000); // Convert to milliseconds

		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'long' });
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	};

	const jobDate = job.date?.timestamp?.[0]
		? formatDate(job.date.timestamp[0])
		: 'Date not available';

	const PatagoniaHero = () => {
		return (
			<div className="relative w-full h-[400px] overflow-hidden rounded-lg mb-8">
				<Image
					src="/images/patagonia-hero.jpg"
					alt="Patagonia Store"
					fill
					style={{ objectFit: 'cover' }}
				/>

				<div className="absolute inset-0 bg-black bg-opacity-30"></div>
				<div className="absolute left-5 top-0 bottom-20 w-1/2 flex items-center justify-center">
					<div
						className="w-full h-full"
						style={{
							mixBlendMode: 'difference',
						}}
					>
						<DotLottieReact
							src="https://lottie.host/492a7988-57e0-4002-8f25-7fc7add0601e/7WMLySiYrX.lottie"
							loop
							autoplay
						/>
					</div>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
					<h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
					<div className="text-gray-200">Posted: {jobDate}</div>
				</div>
			</div>
		);
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<Link
				href="/"
				className="text-blue-600 hover:underline mb-6 inline-block"
			>
				&larr; Back
			</Link>

			{job.jobId === '2285' ? (
				<PatagoniaHero />
			) : (
				<>
					<h1 className="text-3xl font-bold text-blue-800 mb-2">{job.title}</h1>
					<div className="text-gray-600 mb-4">Posted: {jobDate}</div>
				</>
			)}

			{job.specs && job.jobId !== '2285' && (
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

			{job.jobId === '2285' && job.specs && (
				<div className="mb-8 bg-gray-900 text-white rounded-lg overflow-hidden relative">
					<div className="p-6">
						<h2 className="text-xl font-semibold mb-4 text-gray-100">
							Job Details
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{job.specs.city && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Location</p>
										<p className="font-medium">
											{job.specs.city}, {job.specs.region}
										</p>
									</div>
								</div>
							)}
							{job.specs.experienceLevel && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Experience</p>
										<p className="font-medium">{job.specs.experienceLevel}</p>
									</div>
								</div>
							)}
							{job.specs.hoursPerWeek && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Hours</p>
										<p className="font-medium">
											{job.specs.hoursPerWeek} hrs/week
										</p>
									</div>
								</div>
							)}
							{job.specs.languages && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Languages</p>
										<p className="font-medium">{job.specs.languages}</p>
									</div>
								</div>
							)}
						</div>
						<div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-6">
							{job.specs.sector && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Sector</p>
										<p className="font-medium">{job.specs.sector}</p>
									</div>
								</div>
							)}
							{job.specs.function && (
								<div className="flex items-center space-x-2">
									<span className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</span>
									<div>
										<p className="text-gray-400 text-sm">Role</p>
										<p className="font-medium">{job.specs.function}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Logo overlay with mix blend mode */}
					<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
						<div className="w-full h-full relative">
							<Image
								src="/images/logo.png"
								alt="Patagonia Logo"
								fill
								style={{
									objectFit: 'cover',
									opacity: 0.1,
									mixBlendMode: 'overlay',
								}}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Apply section - using client component for interactivity */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h2 className="text-xl font-semibold mb-4">Apply for this position</h2>
				<JobDetailsClient job={job} />
			</div>
		</div>
	);
};

export default JobDetailsPage;
