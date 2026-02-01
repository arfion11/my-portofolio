import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { cardHover } from '../utils/animations';

export default function Card({ title, image, projectId, delay = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (projectId) {
      navigate(`/portfolio/${projectId}`);
    }
  };

  return (
    <motion.div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group relative"
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      style={{
        willChange: 'transform, box-shadow',
      }}
      transition={{
        delay: delay,
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
    >
      {/* Image Container - Always Rendered */}
      <div className="overflow-hidden h-64 relative">
        {image ? (
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
        ) : (
          // Fallback gradient background when no image
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <motion.h3
            className="text-2xl font-bold text-white drop-shadow-lg"
            initial={{ y: 10, opacity: 0.9 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>
        </div>

        {/* Hover Effect - View Details */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-blue-600/0 group-hover:bg-blue-600/20"
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="opacity-0 group-hover:opacity-100 bg-white px-6 py-3 rounded-full font-semibold text-gray-800 shadow-xl"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            View Details
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
