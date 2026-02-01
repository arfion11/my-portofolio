import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function MinimalProjectCard({ project, index = 0 }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/portfolio/${project.id}`);
    };

    return (
        <motion.div
            className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group"
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.1,
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Project Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100">
                {project.images?.[0] ? (
                    <motion.img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                )}

                {/* Subtle Overlay on Hover */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Project Title */}
                <motion.h3
                    className="text-xl font-bold text-gray-800 mb-2 line-clamp-2"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                >
                    {project.title}
                </motion.h3>

                {/* Project Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {project.description || 'No description available'}
                </p>
            </div>

            {/* Hover Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 opacity-0 pointer-events-none"
                whileHover={{ opacity: 0.05 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}
