import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import { Zap, Layers, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProjectSlider from '../components/ProjectSlider';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs for certificates carousel
  const certificatesCarouselRef = useRef(null);
  const [isDraggingCerts, setIsDraggingCerts] = useState(false);
  const [startXCerts, setStartXCerts] = useState(0);
  const [scrollLeftCerts, setScrollLeftCerts] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch projects
      const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);

      // Fetch certificates
      const certsQuery = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
      const certsSnapshot = await getDocs(certsQuery);
      const certsData = certsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Organize projects by category
  const selectedProjects = projects.filter(p => p.featured || p.isSelected).slice(0, 8);
  const workProjects = projects.filter(p => p.category === 'work').slice(0, 8);
  const otherProjects = projects.filter(p =>
    p.category !== 'work' && !p.featured && !p.isSelected
  ).slice(0, 8);

  // If no selected projects, use first 8 projects
  const displaySelectedProjects = selectedProjects.length > 0
    ? selectedProjects
    : projects.slice(0, 8);

  // Scroll functions for certificates carousel
  const scrollCertificates = (direction) => {
    if (certificatesCarouselRef.current) {
      const scrollAmount = 400;
      certificatesCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Drag handlers for certificates
  const handleMouseDownCerts = (e) => {
    setIsDraggingCerts(true);
    setStartXCerts(e.pageX - certificatesCarouselRef.current.offsetLeft);
    setScrollLeftCerts(certificatesCarouselRef.current.scrollLeft);
  };

  const handleMouseMoveCerts = (e) => {
    if (!isDraggingCerts) return;
    e.preventDefault();
    const x = e.pageX - certificatesCarouselRef.current.offsetLeft;
    const walk = (x - startXCerts) * 2;
    certificatesCarouselRef.current.scrollLeft = scrollLeftCerts - walk;
  };

  const handleMouseUpCerts = () => {
    setIsDraggingCerts(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 relative z-0">
      {/* Simple Banner Header */}
      <div className="bg-gray-900 py-16 mb-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Projects & Works
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A showcase of quality assurance excellence across various projects
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              className="relative w-16 h-16 mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
              <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full" />
            </motion.div>
            <p className="text-gray-600 font-medium mt-4">Loading amazing projects...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Selected Projects Section */}
            {displaySelectedProjects.length > 0 && (
              <ProjectSlider
                title="Selected Projects"
                projects={displaySelectedProjects}
                category="selected"
                icon={Zap}
              />
            )}



            {/* Other Projects Section */}
            {otherProjects.length > 0 && (
              <ProjectSlider
                title="Other Projects"
                projects={otherProjects}
                category="other"
                icon={Layers}
              />
            )}

            {/* Certificates & Achievements Section */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-gray-900 border border-gray-800 shadow-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Certificates & Achievements</h2>
                </div>

                {/* Show More Button for Certificates */}
                {certificates.length > 6 && (
                  <motion.button
                    onClick={() => window.location.href = '/certificates'}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 font-medium"
                    whileHover={{ scale: 1.05, x: 4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Show More</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {certificates.length > 0 ? (
                <div className="relative group">
                  {/* Left Arrow Button */}
                  <motion.button
                    onClick={() => scrollCertificates('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </motion.button>

                  {/* Certificates Carousel Container */}
                  <div
                    ref={certificatesCarouselRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth px-2 py-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDownCerts}
                    onMouseMove={handleMouseMoveCerts}
                    onMouseUp={handleMouseUpCerts}
                    onMouseLeave={handleMouseUpCerts}
                  >
                    {certificates.map((certificate, index) => (
                      <CertificateCard
                        key={certificate.id}
                        certificate={certificate}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Right Arrow Button */}
                  <motion.button
                    onClick={() => scrollCertificates('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No certificates yet. Add certificates from admin dashboard.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Certificate Card Component (Keep existing design)
function CertificateCard({ certificate, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-96 bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Certificate Image */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
        {certificate.image ? (
          <>
            <motion.img
              src={certificate.image}
              alt={certificate.title || 'Certificate'}
              className="w-full h-full object-cover"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* Overlay on Hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-purple-900/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Award className="w-16 h-16 text-purple-300" />
          </div>
        )}

        {/* Award Badge */}
        <motion.div
          className="absolute top-3 right-3 p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
        >
          <Award className="w-5 h-5 text-white" />
        </motion.div>

        {/* View Certificate Text on Hover */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-2 bg-white rounded-full shadow-lg">
            <span className="text-gray-800 font-semibold text-sm">View Certificate</span>
          </div>
        </motion.div>
      </div>

      {/* Certificate Info */}
      <div className="p-4">
        <motion.h3
          className="text-lg font-bold text-gray-800 mb-2 line-clamp-2"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {certificate.title || 'Certificate'}
        </motion.h3>

        {certificate.issuer && (
          <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-500" />
            {certificate.issuer}
          </p>
        )}

        {certificate.date && (
          <p className="text-gray-500 text-xs">
            {new Date(certificate.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}
          </p>
        )}

        {certificate.description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {certificate.description}
          </p>
        )}
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
