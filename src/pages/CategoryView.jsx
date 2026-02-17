import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Layers, Briefcase, GraduationCap } from 'lucide-react';
import MinimalProjectCard from '../components/MinimalProjectCard';

export default function CategoryView() {
  const { category } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProjects = async () => {
      try {
        setLoading(true);
        let q;

        if (category === 'selected') {
          // Fetch featured/selected projects
          q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const allProjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

          // Filter for featured/selected
          const selected = allProjects.filter((p) => p.featured || p.isSelected);

          // If no selected projects found, fallback to showing recent projects (matching Portfolio.jsx)
          if (selected.length > 0) {
            setProjects(selected);
          } else {
            setProjects(allProjects.slice(0, 20));
          }
        } else if (category === 'other') {
          // Fetch projects that are not work and not selected
          q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const allProjects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProjects(
            allProjects.filter((p) => p.category !== 'work' && !p.featured && !p.isSelected)
          );
        } else {
          // Fetch by category (work, internship, university, etc.)
          q = query(
            collection(db, 'projects'),
            where('category', '==', category),
            orderBy('createdAt', 'desc')
          );
          const snapshot = await getDocs(q);
          setProjects(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProjects();
  }, [category]);

  const getCategoryInfo = () => {
    const categories = {
      selected: { title: 'Selected Projects', icon: Zap, color: 'text-gray-900' },
      work: { title: 'Work Projects', icon: Briefcase, color: 'text-gray-900' },
      other: { title: 'Other Projects', icon: Layers, color: 'text-gray-900' },
      internship: { title: 'Internship Projects', icon: Layers, color: 'text-gray-900' },
      university: { title: 'University Projects', icon: GraduationCap, color: 'text-gray-900' },
    };
    return categories[category] || categories.other;
  };

  const categoryInfo = getCategoryInfo();
  const Icon = categoryInfo.icon;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Banner Header */}
      <div className="bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] py-16 mb-12 border-b border-blue-500/20 relative overflow-hidden">
        {/* Subtle decorative elements for a premium feel */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <Link to="/portfolio">
            <motion.button
              className="flex items-center gap-2 text-blue-200 hover:text-white mb-8 font-medium transition-colors duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Portfolio
            </motion.button>
          </Link>

          {/* Title */}
          <div className="flex items-center gap-6">
            <motion.div
              className="p-4 rounded-full bg-blue-600/20 border border-blue-500/30 shadow-lg backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {categoryInfo.title}
              </h1>
              <p className="text-blue-100/70 text-lg">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="relative w-16 h-16 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full" />
            </motion.div>
            <p className="text-gray-600 font-medium mt-4">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-white rounded-3xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 text-xl font-semibold mb-2">No projects in this category</p>
            <p className="text-gray-500">Check back later for new projects!</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project, index) => (
              <motion.div key={project.id} className="flex justify-center" variants={itemVariants}>
                <MinimalProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
