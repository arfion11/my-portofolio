import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
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

  // Function to convert URLs in text to clickable links
  const renderDescriptionWithLinks = (text) => {
    if (!text) return '';

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with anchor tags
    const htmlText = text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline break-all">${url}</a>`;
    });

    // Replace line breaks with <br> tags
    return htmlText.replace(/\n/g, '<br>');
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 relative z-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] py-12 mb-12 border-b border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.button
            variants={itemVariants}
            onClick={() => navigate('/portfolio')}
            className="flex items-center gap-2 text-blue-200 hover:text-white mb-6 group transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Back to Portfolio</span>
          </motion.button>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            variants={itemVariants}
          >
            Project Detail
          </motion.h1>
          <p className="text-blue-100/70">Exploring the technical details and results of this project</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}

        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="relative bg-gray-100"
            variants={imageVariants}
          >
            {project.images && project.images.length > 0 ? (
              <motion.img
                src={project.images[selectedImage]}
                alt={project.title}
                className="w-full h-auto object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
                crossOrigin="anonymous"
                onError={(e) => {
                  console.error('Image failed to load:', project.images[selectedImage]);
                }}
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <ExternalLink className="w-20 h-20 text-gray-400" />
              </div>
            )}
          </motion.div>

          {/* Image Thumbnails */}
          {project.images && project.images.length > 1 && (
            <motion.div className="p-6 border-b border-gray-100" variants={itemVariants}>
              <div className="flex gap-3 overflow-x-auto">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${selectedImage === index
                      ? 'border-blue-500 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <img src={image} alt={`${project.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Project Info */}
          <div className="p-8">
            {/* Title */}
            <motion.h1
              className="text-4xl font-bold text-gray-800 mb-4"
              variants={itemVariants}
            >
              {project.title}
            </motion.h1>

            {/* Meta Info */}
            <motion.div
              className="flex flex-wrap gap-6 mb-6"
              variants={itemVariants}
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
              {(project.projectDate || project.createdAt) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">
                    {project.projectDate
                      ? new Date(project.projectDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                      : new Date(project.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })
                    }
                  </span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              className="prose prose-lg max-w-none"
              variants={itemVariants}
            >
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderDescriptionWithLinks(project.description) }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Portfolio Button */}

      </div>
    </motion.div>
  );
}
