import React, { useState, useEffect, useRef } from 'react';
import SearchFilter from '@/components/SearchFilter';
import JobCardScroller from '@/components/JobCardScroller';
import jobData from '@/data/jobSearchData.json';
import { JobData, filterJobs } from '@/utils/jobUtils';
import CardCarousel from '@/components/CardCarousel';

export default function Home() {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredJobs, setFilteredJobs] = useState<JobData[]>(jobData);
	const [selectedFilters, setSelectedFilters] = useState({
		regions: [] as string[],
		industries: [] as string[],
		experienceLevels: [] as string[],
	});
	
	// Shared scroll state
	const [scrollPosition, setScrollPosition] = useState(0);
	const [currentJobIndex, setCurrentJobIndex] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const lastTouchY = useRef<number>(0);
	const scrollThreshold = 50; // Amount of touch movement needed to change cards

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
				.filter((experienceLevel): experienceLevel is string =>
					Boolean(experienceLevel)
				)
		)
	);

	useEffect(() => {
		const filtered = filterJobs(jobData, searchTerm, selectedFilters);
		setFilteredJobs(filtered);
		setCurrentJobIndex(0);
	}, [searchTerm, selectedFilters]);
	
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleTouchStart = (e: TouchEvent) => {
			lastTouchY.current = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			e.preventDefault();
			const currentY = e.touches[0].clientY;
			const diff = lastTouchY.current - currentY;

			if (Math.abs(diff) > scrollThreshold) {
				// Update scroll position
				setScrollPosition(prev => {
					const newPosition = prev + diff * 0.005;
					return newPosition;
				});
				
				if (diff > 0) {
					setCurrentJobIndex(prev => {
						if (prev >= filteredJobs.length - 1) {
							return 0;
						} else {
							return prev + 1;
						}
					});
				} else if (diff < 0) {
					setCurrentJobIndex(prev => {
						if (prev <= 0) {
							return filteredJobs.length - 1;
						} else {
							return prev - 1;
						}
					});
				}
				lastTouchY.current = currentY;
			}
		};

		container.addEventListener('touchstart', handleTouchStart, { passive: false });
		container.addEventListener('touchmove', handleTouchMove, { passive: false });

		return () => {
			container.removeEventListener('touchstart', handleTouchStart);
			container.removeEventListener('touchmove', handleTouchMove);
		};
	}, [currentJobIndex, filteredJobs.length]);
	
	useEffect(() => {
		const handleScroll = (e: WheelEvent) => {
			e.preventDefault();
			
			const scrollDelta = e.deltaY;
			
			setScrollPosition(prev => {
				const newPosition = prev + scrollDelta * 0.01;
				return newPosition;
			});
			
			if (scrollDelta > 0) {
				setCurrentJobIndex(prev => {
					if (prev >= filteredJobs.length - 1) {
						return 0;
					} else {
						return prev + 1;
					}
				});
			} else if (scrollDelta < 0) {
				setCurrentJobIndex(prev => {
					if (prev <= 0) {
						return filteredJobs.length - 1;
					} else {
						return prev - 1;
					}
				});
			}
		};
		
		// Add keyboard navigation with infinite scrolling
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
				// Move to next job with loop-around
				setCurrentJobIndex(prev => {
					if (prev >= filteredJobs.length - 1) {
						return 0;
					} else {
						return prev + 1;
					}
				});
				setScrollPosition(prev => prev + 0.1);
			} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
				// Move to previous job with loop-around
				setCurrentJobIndex(prev => {
					if (prev <= 0) {
						return filteredJobs.length - 1;
					} else {
						return prev - 1;
					}
				});
				setScrollPosition(prev => prev - 0.1);
			}
		};
		
		// Add wheel event listener to the container
		const container = containerRef.current;
		if (container) {
			container.addEventListener('wheel', handleScroll, { passive: false });
		}
		
		// Add keyboard event listener
		window.addEventListener('keydown', handleKeyDown);
		
		// Cleanup
		return () => {
			if (container) {
				container.removeEventListener('wheel', handleScroll);
			}
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [currentJobIndex, filteredJobs.length]);

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
					<h1 className="text-3xl font-bold text-blue-800">
						Small Giants Job Board
					</h1>
					<p className="text-gray-600 mt-2">
						Find opportunities with companies that value purpose, people, and
						profit
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
						
						{/* CardCarousel with JobCardScroller as child */}
						{filteredJobs.length > 0 ? (
							<div 
								ref={containerRef}
								className="relative w-full"
							>
								<CardCarousel scrollPosition={scrollPosition}>
									<JobCardScroller 
										jobs={filteredJobs} 
										currentIndex={currentJobIndex} 
									/>
								</CardCarousel>
							</div>
						) : (
							<div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No jobs found
								</h3>
								<p className="text-gray-600">
									Try adjusting your search terms or filters to find more
									opportunities.
								</p>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
