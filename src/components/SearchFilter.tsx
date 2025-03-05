import React from 'react';

interface SearchFilterProps {
	regions: string[];
	industries: string[];
	experienceLevels: string[];
	selectedFilters: {
		regions: string[];
		industries: string[];
		experienceLevels: string[];
	};
	onFilterChange: (
		filterType: 'regions' | 'industries' | 'experienceLevels',
		values: string[]
	) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
	regions,
	industries,
	experienceLevels,
	selectedFilters,
	onFilterChange,
}) => {
	const FilterSection = ({
		title,
		items,
		filterType,
		selected,
	}: {
		title: string;
		items: string[];
		filterType: 'regions' | 'industries' | 'experienceLevels';
		selected: string[];
	}) => (
		<div className="mb-6">
			<h3 className="text-sm font-medium text-gray-700 mb-2 flex justify-between items-center">
				<span>{title}</span>
				<span className="text-xs text-gray-500">
					{selected.length} selected
				</span>
			</h3>
			<div className="max-h-40 overflow-y-auto space-y-1 pl-1">
				{items.length === 0 ? (
					<p className="text-gray-500 text-sm italic">No options available</p>
				) : (
					items.sort().map((item) => (
						<div key={item} className="flex items-center">
							<input
								type="checkbox"
								id={`${filterType}-${item}`}
								className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
								checked={selected.includes(item)}
								onChange={() => {
									const newValues = selected.includes(item)
										? selected.filter((v) => v !== item)
										: [...selected, item];
									onFilterChange(filterType, newValues);
								}}
							/>
							<label
								htmlFor={`${filterType}-${item}`}
								className="ml-2 block text-sm text-gray-700 truncate"
							>
								{item}
							</label>
						</div>
					))
				)}
			</div>
		</div>
	);

	const hasFilters =
		selectedFilters.regions.length > 0 ||
		selectedFilters.industries.length > 0 ||
		selectedFilters.experienceLevels.length > 0;

	return (
		<div>
			<div className="space-y-4">
				<FilterSection
					title="Filter by Region"
					items={regions}
					filterType="regions"
					selected={selectedFilters.regions}
				/>

				<FilterSection
					title="Filter by Industry"
					items={industries}
					filterType="industries"
					selected={selectedFilters.industries}
				/>

				<FilterSection
					title="Filter by Experience"
					items={experienceLevels}
					filterType="experienceLevels"
					selected={selectedFilters.experienceLevels}
				/>

				{hasFilters && (
					<button
						className=" text-sm text-blue-600 hover:text-blue-800 font-medium"
						onClick={() => {
							onFilterChange('regions', []);
							onFilterChange('industries', []);
							onFilterChange('experienceLevels', []);
						}}
					>
						Clear filters
					</button>
				)}
			</div>
		</div>
	);
};

export default SearchFilter;
