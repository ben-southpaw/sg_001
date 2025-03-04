import React, { useState } from 'react';

interface ApplyFormProps {
	jobId?: string;
	jobTitle?: string;
}

// TODO: Create more detailed interface for form data

const ApplyForm: React.FC<ApplyFormProps> = ({ jobId, jobTitle }) => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		coverLetter: '',
	});

	// Simple success message instead of modal
	const [showSuccess, setShowSuccess] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// TODO: Implement file upload functionality
	// Ran out of time to implement this properly

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const dataToSubmit = {
			...formData,
			jobId,
			jobTitle,
		};

		//send the data to backend
		console.log('Form submitted:', dataToSubmit);

		setShowSuccess(true);

		// Reset form
		setFormData({ name: '', email: '', coverLetter: '' });

		// Hide success message after 3 seconds
		setTimeout(() => {
			setShowSuccess(false);
		}, 3000);
	};

	// Removed modal functionality - would implement with more time

	return (
		<div className="w-full">
			{showSuccess && (
				<div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
					<p className="font-medium">Application submitted successfully!</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Full Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Small Giants"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="ben@smallgiants.com"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="coverLetter"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Cover Letter (optional)
					</label>
					<textarea
						id="coverLetter"
						name="coverLetter"
						value={formData.coverLetter}
						onChange={handleChange}
						placeholder="Tell us why you're interested in this position... (optional)"
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
					/>
				</div>

				{/* TODO: Add file upload functionality for CV */}
				<button
					type="submit"
					className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
				>
					Submit Application
				</button>
			</form>
		</div>
	);
};

export default ApplyForm;
