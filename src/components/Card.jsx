import { motion } from 'framer-motion';
import { cardHover } from '../utils/animations';

export default function Card({ title, description, image, tags, onClick, delay = 0 }) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group"
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
      {/* Image */}
      {image && (
        <div className="overflow-hidden h-48 relative">
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100"
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        <motion.h3
          className="text-xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
        >
          {title}
        </motion.h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <motion.span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: delay + (index * 0.05),
                  duration: 0.3,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  transition: { duration: 0.2 }
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
