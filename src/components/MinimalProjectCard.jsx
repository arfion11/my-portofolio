import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function MinimalProjectCard({ project, index = 0 }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/portfolio/${project.id}`);
    };

    return (
        <motion.div
            className="flex-shrink-0 w-96 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            {/* Project Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100">
                {project.images?.[0] ? (
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-300 ease-out group-hover:scale-105"
                        style={{
                            backgroundImage: `url(${project.images[0]})`,
                            willChange: 'transform'
                        }}
                    >
                        {/* Subtle gradient overlay - only visible on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {project.description || 'No description available'}
                </p>
            </div>
        </motion.div>
    );
}
