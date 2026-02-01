import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Briefcase, GraduationCap, Code2, ExternalLink, Calendar, User } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      work: { label: 'Work Project', color: 'from-blue-500 to-cyan-500', icon: Briefcase },
      internship: { label: 'Internship Project', color: 'from-green-500 to-emerald-500', icon: Code2 },
      university: { label: 'University Project', color: 'from-orange-500 to-red-500', icon: GraduationCap },
      manual: { label: 'Manual Testing', color: 'from-blue-500 to-cyan-500', icon: Briefcase },
      automation: { label: 'Automation Testing', color: 'from-green-500 to-emerald-500', icon: Code2 },
    };
    return badges[category] || badges.work;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Loading project...</p>
        </motion.div>
      </div>
    );
  }

  if (!project) return null;

  const badge = getCategoryBadge(project.category);
  const BadgeIcon = badge.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative z-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/portfolio')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 group"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Portfolio</span>
        </motion.button>

        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Large Hero Image */}
          <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
            <AnimatePresence mode="wait">
              {project.images && project.images.length > 0 ? (
                <motion.img
                  key={selectedImage}
                  src={project.images[selectedImage]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ExternalLink className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </AnimatePresence>

            {/* Category Badge - Fixed position */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <motion.div
                className={`px-5 py-3 rounded-full bg-gradient-to-r ${badge.color} backdrop-blur-sm flex items-center gap-2 shadow-lg`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <BadgeIcon className="w-5 h-5 text-white" />
                <span className="text-white font-bold">{badge.label}</span>
              </motion.div>
            </div>
          </div>

          {/* Image Thumbnails */}
          {project.images && project.images.length > 1 && (
            <div className="p-6 border-b border-gray-100">
              <div className="flex gap-3 overflow-x-auto">
                {project.images.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={image} alt={`${project.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Project Info */}
          <div className="p-8">
            {/* Title */}
            <motion.h1
              className="text-4xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {project.title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              className="flex flex-wrap gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {project.role && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{project.role}</span>
                </div>
              )}
              {project.company && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-5 h-5" />
                  <span className="font-medium">{project.company}</span>
                </div>
              )}
              {project.createdAt && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {new Date(project.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              className="prose prose-lg max-w-none mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </motion.div>


          </div>
        </motion.div>

        {/* Back to Portfolio Button */}

      </div>
    </div>
  );
}

