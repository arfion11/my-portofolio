import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MinimalProjectCard from './MinimalProjectCard';

export default function ProjectSlider({ title, projects, category, icon: Icon }) {
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Scroll functions
    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400;
            sliderRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleShowMore = () => {
        navigate(`/portfolio/category/${category}`);
    };

    if (!projects || projects.length === 0) {
        return null; // Don't render section if no projects
    }

    return (
        <div className="mb-16">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="p-3 rounded-full bg-blue-600 border border-blue-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                </div>

                {/* Show More Button - Show if there are 4+ projects */}
                {projects.length >= 4 && (
                    <motion.button
                        onClick={handleShowMore}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 font-medium"
                        whileHover={{ scale: 1.05, x: 4 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Show More</span>
                        <ArrowRight className="w-4 h-4" />
                    </motion.button>
                )}
            </div>

            {/* Slider Container */}
            <div className="relative group">
                {/* Left Arrow Button */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                        onClick={() => scroll('left')}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl"
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </motion.button>
                </div>

                {/* Projects Slider */}
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth px-2 py-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {projects.slice(0, 8).map((project, index) => (
                        <MinimalProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>

                {/* Right Arrow Button */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                        onClick={() => scroll('right')}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl"
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
