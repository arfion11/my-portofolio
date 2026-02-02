import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        delay: delay,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
        layout: { duration: 0.3 }
      }}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {image ? (
          <motion.div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-2">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg leading-tight">
            {title}
          </h3>

          {/* Subtle line indicator */}
          <motion.div
            className="h-1 bg-blue-500 rounded-full mt-3"
            initial={{ width: 0, opacity: 0 }}
            whileHover={{ width: "40%", opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
}
