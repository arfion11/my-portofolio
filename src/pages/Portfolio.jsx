import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/Card';
import { pageVariants, staggerContainer, staggerItem } from '../utils/animations';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'manual', label: 'Manual Testing' },
    { id: 'automation', label: 'Automation' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-600">
            Projects I've tested and ensured quality for
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex justify-center mb-8 space-x-4 flex-wrap gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-6 py-2 rounded-lg font-semibold ${
                filter === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
              </motion.div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </motion.div>
          ) : projects.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-white rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600 mb-4">No projects yet</p>
              <p className="text-sm text-gray-500">
                Add your first project from the admin dashboard
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={filter}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              exit={{ opacity: 0 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  layout
                >
                  <Card
                    title={project.title}
                    description={project.description}
                    image={project.images?.[0]}
                    tags={project.tools}
                    delay={index * 0.05}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
