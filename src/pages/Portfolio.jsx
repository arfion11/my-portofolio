import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layers, Award, ChevronLeft, ChevronRight, ArrowRight, X, Calendar, User } from 'lucide-react';
import ProjectSlider from '../components/ProjectSlider';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs for certificates carousel
  const certificatesCarouselRef = useRef(null);
  const [isDraggingCerts, setIsDraggingCerts] = useState(false);
  const [startXCerts, setStartXCerts] = useState(0);
  const [scrollLeftCerts, setScrollLeftCerts] = useState(0);
  const [canScrollLeftCerts, setCanScrollLeftCerts] = useState(false);
  const [canScrollRightCerts, setCanScrollRightCerts] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Check scroll position for certificates
  const checkScrollCerts = () => {
    if (certificatesCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = certificatesCarouselRef.current;
      setCanScrollLeftCerts(scrollLeft > 0);
      setCanScrollRightCerts(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollCerts();
    window.addEventListener('resize', checkScrollCerts);

    const slider = certificatesCarouselRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollCerts);
    }

    return () => {
      window.removeEventListener('resize', checkScrollCerts);
      if (slider) {
        slider.removeEventListener('scroll', checkScrollCerts);
      }
    };
  }, [certificates]);

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
  const selectedProjects = projects
    .filter(p => p.featured || p.isSelected)
    .sort((a, b) => {
      // Sort by displayOrder if exists, otherwise by createdAt
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;
      // Fallback to createdAt descending
      return 0;
    })
    .slice(0, 8);
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
      const scrollAmount = 640; // Adjusted for wider cards
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
      <div className="bg-gradient-to-r from-[#0a192f] via-[#172a45] to-[#0a192f] py-16 mb-12 border-b border-blue-500/20 relative overflow-hidden">
        {/* Subtle decorative elements for a premium feel */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Projects & Works
            </motion.h1>
            <motion.p
              className="text-xl text-blue-50 max-w-2xl mx-auto drop-shadow-sm font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              A showcase of quality assurance excellence across various projects
            </motion.p>
          </div>
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
          <div>
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
                  <div className="p-3 rounded-full bg-blue-600 border border-blue-500 shadow-lg">
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
                <div className="relative group px-4">
                  {/* Left Arrow Button */}
                  {canScrollLeftCerts && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => scrollCertificates('left')}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl border border-gray-100"
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                      </motion.button>
                    </div>
                  )}

                  {/* Certificates Carousel Container */}
                  <div
                    ref={certificatesCarouselRef}
                    className="flex gap-8 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth py-10 px-4 w-full"
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
                        onClick={() => setSelectedCertificate(certificate)}
                      />
                    ))}
                  </div>

                  {/* Right Arrow Button */}
                  {canScrollRightCerts && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.button
                        onClick={() => scrollCertificates('right')}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:shadow-xl border border-gray-100"
                        whileTap={{ scale: 0.95 }}
                      >
                        <ChevronRight className="w-6 h-6 text-gray-800" />
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/60 backdrop-blur-sm rounded-2xl">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No certificates yet. Add certificates from admin dashboard.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[85vw] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Section */}
              <div className="w-full md:w-2/3 bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
                {selectedCertificate.image && (
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-30 scale-125"
                    style={{ backgroundImage: `url(${selectedCertificate.image})` }}
                  />
                )}
                {selectedCertificate.image ? (
                  <img
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    className="relative max-w-full max-h-[70vh] object-contain shadow-2xl rounded-lg z-10"
                  />
                ) : (
                  <div className="text-center p-12">
                    <Award className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="w-full md:w-1/3 p-6 md:p-8 bg-white overflow-y-auto">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="mt-2">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
                    Certificate
                  </span>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                    {selectedCertificate.title}
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3 text-gray-600">
                      <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Issuer</p>
                        <p className="text-sm">{selectedCertificate.issuer}</p>
                      </div>
                    </div>

                    {selectedCertificate.date && (
                      <div className="flex items-start gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">Date Issued</p>
                          <p className="text-sm">
                            {new Date(selectedCertificate.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="prose prose-blue prose-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {selectedCertificate.description || 'No description provided.'}
                    </p>
                  </div>

                  {selectedCertificate.image && (
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <a
                        href={selectedCertificate.credentialUrl || selectedCertificate.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                        View Full Original
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );



  // ... (drag handlers unchanged)

  // ... (render)
}

// Certificate Card Component - Redesigned to Match Featured Projects (Even Larger)
function CertificateCard({ certificate, index, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="relative flex-shrink-0 w-[600px] h-[400px] rounded-3xl overflow-hidden cursor-pointer group shadow-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, shadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15), 0 15px 15px -5px rgba(0, 0, 0, 0.08)" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      {/* Background Image - Full Cover */}
      <div className="absolute inset-0 bg-gray-900">
        {certificate.image ? (
          <motion.div
            className="w-full h-full bg-cover bg-center opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            style={{ backgroundImage: `url(${certificate.image})` }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Award className="w-24 h-24 text-gray-700" />
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg uppercase tracking-wider shadow-lg">
            Certificate
          </span>
          <span className="text-gray-300 text-sm font-medium bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            {certificate.date ? new Date(certificate.date).getFullYear() : ''}
          </span>
        </div>

        <h3 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-md line-clamp-2">
          {certificate.title}
        </h3>

        <div className="flex items-center gap-2 text-gray-300 text-base font-medium">
          <Award className="w-5 h-5 text-blue-400" />
          {certificate.issuer}
        </div>
      </div>
    </motion.div>
  );
}
