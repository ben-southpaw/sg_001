import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface CardCarouselProps {
	scrollPosition?: number;
	children?: React.ReactNode;
}

const CardCarousel: React.FC<CardCarouselProps> = ({
	scrollPosition = 0,
	children,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const lastScrollPositionRef = useRef<number>(0);
	const timeRef = useRef<number>(0.4);
	const loopRef = useRef<gsap.core.Timeline | null>(null);
	const lastScrollY = useRef<number>(0);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
		loopRef.current = buildSeamlessLoop(cards, 0.33, cardAnimation);
		loopRef.current.time(timeRef.current);

		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 }
		);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (loopRef.current) {
				loopRef.current.kill();
			}
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (scrollPosition !== lastScrollPositionRef.current) {
			const direction = scrollPosition > lastScrollPositionRef.current ? 1 : -1;
			const moveAmount = direction * 0.15;
			movePlayhead(moveAmount);
			lastScrollPositionRef.current = scrollPosition;
		}
	}, [scrollPosition]);

	useEffect(() => {
		if (!containerRef.current) return;
	}, []);

	const cardAnimation = (card: HTMLDivElement) => {
		const start = { y: '-10vh', scale: 0.85, zIndex: 0, opacity: 1 };
		return gsap
			.timeline()
			.fromTo(card, start, {
				y: 0,
				scale: 1,
				opacity: 1,
				zIndex: 100,
				ease: 'none',
				duration: 1,
				immediateRender: false,
			})
			.fromTo(
				card,
				{ opacity: 1 },
				{
					opacity: 0.3,
					duration: 0.5,
					ease: 'power2.inOut',
					immediateRender: false,
				}
			)
			.set(card, start);
	};

	const movePlayhead = (amount: number) => {
		if (!loopRef.current) return;

		timeRef.current += amount;
		if (timeRef.current < 0) {
			loopRef.current.totalTime(
				loopRef.current.totalTime() + loopRef.current.duration() * 100
			);
			timeRef.current += loopRef.current.duration() * 100;
		}

		gsap.to(loopRef.current, {
			totalTime: timeRef.current,
			duration: 0.5,
			overwrite: true,
		});
	};

	const buildSeamlessLoop = (
		items: HTMLDivElement[],
		spacing: number,
		animateFunc: (item: HTMLDivElement) => gsap.core.Timeline
	) => {
		const rawSequence = gsap.timeline({ paused: true });

		const seamlessLoop = gsap.timeline({
			paused: true,
			repeat: -1,
			onRepeat() {
				if (this._time === this._dur) {
					this._tTime += this._dur - 0.01;
				}
			},
			onReverseComplete() {
				this.totalTime(this.rawTime() + this.duration() * 100);
			},
		});

		const cycleDuration = spacing * items.length;
		let dur: number | undefined;

		const allItems = [...items, ...items, ...items, ...items];
		allItems.forEach((item, i) => {
			const anim = animateFunc(items[i % items.length]);
			rawSequence.add(anim, i * spacing);
			if (!dur) dur = anim.duration();
		});

		seamlessLoop.fromTo(
			rawSequence,
			{
				time: cycleDuration + (dur || 0) / 2,
			},
			{
				time: '+=' + cycleDuration,
				duration: cycleDuration,
				ease: 'none',
			}
		);

		return seamlessLoop;
	};

	return (
		<div className="relative w-full h-full flex items-center justify-center my-8">
			<div
				ref={containerRef}
				id="card-container"
				className="relative w-[60vw] h-[55vh] flex items-center justify-center cursor-pointer"
				style={{ touchAction: 'none' }}
			>
				{Array.from({ length: 10 }).map((_, index) => {
					const colors = [
						'bg-gray-200',
						'bg-gray-300',
						'bg-gray-400',
						'bg-gray-500',
						'bg-gray-400',
						'bg-gray-500',
						'bg-gray-400',
						'bg-gray-300',
						'bg-gray-200',
						'bg-gray-300',
					];

					return (
						<div
							key={`card-${index + 1}`}
							ref={(el) => (cardsRef.current[index] = el)}
							id={`card${index + 1}`}
							className={`card absolute w-[100%] h-[35vh] rounded-lg shadow-[3px_2px_10px_-5px_rgba(0,0,0,0.51)] ${colors[index]}`}
						></div>
					);
				})}

				{children && (
					<div className="absolute top-[10vh] left-0 w-full h-[35vh] z-[150] pointer-events-auto">
						{children}
					</div>
				)}
			</div>
		</div>
	);
};

export default CardCarousel;
