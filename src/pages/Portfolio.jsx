import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Code2, Sparkles, ArrowRight, ChevronLeft, ChevronRight, Award } from 'lucide-react';

export default function Portfolio() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);

  // Refs for carousels
  const projectsCarouselRef = useRef(null);
  const certificatesCarouselRef = useRef(null);

  // Drag state for projects carousel
  const [isDraggingProjects, setIsDraggingProjects] = useState(false);
  const [startXProjects, setStartXProjects] = useState(0);
  const [scrollLeftProjects, setScrollLeftProjects] = useState(0);

  // Drag state for certificates carousel
  const [isDraggingCerts, setIsDraggingCerts] = useState(false);
  const [startXCerts, setStartXCerts] = useState(0);
  const [scrollLeftCerts, setScrollLeftCerts] = useState(0);

  useEffect(() => {
    fetchProjects();
    fetchCertificates();
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

  const fetchCertificates = async () => {
    try {
      const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const certificatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCertificates(certificatesData);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  // Scroll functions for projects carousel
  const scrollProjects = (direction) => {
    if (projectsCarouselRef.current) {
      const scrollAmount = 400;
      projectsCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  // Drag handlers for projects
  const handleMouseDownProjects = (e) => {
    setIsDraggingProjects(true);
    setStartXProjects(e.pageX - projectsCarouselRef.current.offsetLeft);
    setScrollLeftProjects(projectsCarouselRef.current.scrollLeft);
  };

  const handleMouseMoveProjects = (e) => {
    if (!isDraggingProjects) return;
    e.preventDefault();
    const x = e.pageX - projectsCarouselRef.current.offsetLeft;
    const walk = (x - startXProjects) * 2;
    projectsCarouselRef.current.scrollLeft = scrollLeftProjects - walk;
  };

  const handleMouseUpProjects = () => {
    setIsDraggingProjects(false);
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

  // Handle smooth navigation to project detail
  const handleProjectClick = (projectId) => {
    if (isDraggingProjects) return; // Don't navigate if dragging
    navigate(`/portfolio/${projectId}`);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  const categories = [
    {
      id: 'all',
      label: 'All Projects',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      count: projects.length
    },
    {
      id: 'work',
      label: 'Work Projects',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      count: projects.filter(p => p.category === 'work').length
    },
    {
      id: 'internship',
      label: 'Internship',
      icon: Code2,
      color: 'from-green-500 to-emerald-500',
      count: projects.filter(p => p.category === 'internship').length
    },
    {
      id: 'university',
      label: 'University',
      icon: GraduationCap,
      color: 'from-orange-500 to-red-500',
      count: projects.filter(p => p.category === 'university').length
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative z-0">
      {/* Futuristic Header with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20 mb-16">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            {/* Sparkle Icon */}
            <motion.div
              className="inline-block mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                type: "spring",
                stiffness: 200
              }}
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Projects & Works
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Selected works from professional, internship, and academic projects
            </motion.p>

            {/* Stats Bar */}
            <motion.div
              className="flex justify-center gap-8 mt-10 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{projects.length}</div>
                <div className="text-white/80 text-sm">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{categories.length - 1}</div>
                <div className="text-white/80 text-sm">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100%</div>
                <div className="text-white/80 text-sm">Quality Assured</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="rgb(249, 250, 251)" fillOpacity="1"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Enhanced Category Tabs */}
        <div className="flex justify-center mb-12 gap-4 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = filter === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`relative group px-6 py-4 rounded-2xl font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'bg-white text-gray-800 shadow-xl'
                    : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80'
                }`}
              >
                {/* Gradient Border on Active */}
                {isActive && (
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-20`}
                  />
                )}

                <div className="relative flex items-center gap-3">
                  {/* Icon with Gradient */}
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Label and Count */}
                  <div className="text-left">
                    <div className="font-bold text-sm">{category.label}</div>
                    <div className="text-xs text-gray-500">{category.count} projects</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="sync">
          {loading ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Premium Loading Animation */}
              <motion.div className="flex flex-col items-center gap-4">
                <motion.div
                  className="relative w-16 h-16"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 border-4 border-purple-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full" />
                </motion.div>
                <motion.p
                  className="text-gray-600 font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Loading amazing projects...
                </motion.p>
              </motion.div>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-10 h-10 text-gray-500" />
              </motion.div>
              <p className="text-gray-700 text-xl font-semibold mb-2">No projects in this category yet</p>
              <p className="text-gray-500">
                {filter === 'all' ? 'Add your first project from the admin dashboard' : 'Try selecting a different category'}
              </p>
            </motion.div>
          ) : filter === 'all' ? (
            // Carousel view for "All Projects"
            <motion.div
              className="space-y-16 pb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Projects Carousel */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                  <Sparkles className="w-7 h-7 text-purple-600" />
                  All Projects
                </h2>

                <div className="relative group py-4">
                  {/* Left Arrow Button */}
                  <motion.button
                    onClick={() => scrollProjects('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </motion.button>

                  {/* Projects Carousel Container */}
                  <div
                    ref={projectsCarouselRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onMouseDown={handleMouseDownProjects}
                    onMouseMove={handleMouseMoveProjects}
                    onMouseUp={handleMouseUpProjects}
                    onMouseLeave={handleMouseUpProjects}
                  >
                    {filteredProjects.map((project, index) => (
                      <div
                        key={project.id}
                        className="flex-shrink-0 w-80"
                      >
                        <ProjectCard
                          project={project}
                          index={index}
                          onClick={() => handleProjectClick(project.id)}
                          onMouseEnter={() => setHoveredCard(project.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                          isHovered={hoveredCard === project.id}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Right Arrow Button */}
                  <motion.button
                    onClick={() => scrollProjects('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-xl"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </motion.button>
                </div>
              </div>

              {/* Certificates Section */}
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                  <Award className="w-7 h-7 text-purple-600" />
                  Certificates & Achievements
                </h2>

                {certificates.length > 0 ? (
                  <div className="relative group py-4">
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
                      className="flex gap-6 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing scroll-smooth px-2"
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
          ) : (
            // Grid view for filtered categories
            <motion.div
              key={filter}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => handleProjectClick(project.id)}
                  onMouseEnter={() => setHoveredCard(project.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  isHovered={hoveredCard === project.id}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Premium Project Card Component
function ProjectCard({ project, index, onClick, onMouseEnter, onMouseLeave, isHovered }) {
  const getCategoryBadge = (category) => {
    const badges = {
      work: { label: 'Work', color: 'from-blue-500 to-cyan-500', icon: Briefcase },
      internship: { label: 'Internship', color: 'from-green-500 to-emerald-500', icon: Code2 },
      university: { label: 'University', color: 'from-orange-500 to-red-500', icon: GraduationCap },
      manual: { label: 'Manual Testing', color: 'from-blue-500 to-cyan-500', icon: Briefcase },
      automation: { label: 'Automation', color: 'from-green-500 to-emerald-500', icon: Code2 },
    };
    return badges[category] || badges.work;
  };

  const badge = getCategoryBadge(project.category);
  const BadgeIcon = badge.icon;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div className="relative">
      {/* Category Badge - Completely isolated from card animations */}
      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <motion.div
          className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${badge.color} backdrop-blur-sm flex items-center gap-2 shadow-lg`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
        >
          <BadgeIcon className="w-4 h-4 text-white flex-shrink-0" strokeWidth={2} />
          <span className="text-white text-xs font-semibold whitespace-nowrap">{badge.label}</span>
        </motion.div>
      </div>

      <motion.div
        className="group relative bg-white rounded-3xl shadow-lg cursor-pointer select-none"
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        whileHover={{
          y: -12,
          scale: 1.02,
          transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }
        }}
        whileTap={{ opacity: 0.95 }}
      >

      {/* Image Section - Reduced Size */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-3xl">
        {project.images?.[0] ? (
          <>
            <motion.img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            />

            {/* Gradient Overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              transition={{ duration: 0.3 }}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* View Details Button - Appears on Hover */}
        <motion.div
          className="absolute bottom-3 right-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-3 py-1.5 bg-white rounded-full flex items-center gap-1.5 shadow-lg">
            <span className="text-gray-800 font-semibold text-xs">View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-800" />
          </div>
        </motion.div>
      </div>

      {/* Content Section - Reduced Padding */}
      <div className="p-4">
        {/* Project Title - Smaller */}
        <motion.h3
          className="text-xl font-bold text-gray-800 mb-2 line-clamp-2"
          animate={isHovered ? { x: 4 } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>

        {/* Project Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Role Badge */}
        {project.role && (
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              {project.role}
            </span>
          </div>
        )}

        {/* Tech/Tools Tags */}
        {project.tools && project.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tools.slice(0, 3).map((tool, idx) => (
              <motion.span
                key={idx}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.1 + idx * 0.05,
                  duration: 0.3
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  transition: { duration: 0.2 }
                }}
              >
                {tool}
              </motion.span>
            ))}
            {project.tools.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium">
                +{project.tools.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <motion.div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${badge.color} opacity-0 pointer-events-none`}
        animate={{ opacity: isHovered ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Border Glow on Hover */}
      <motion.div
        className={`absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r ${badge.color} opacity-0 pointer-events-none`}
        style={{
          WebkitMaskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '2px'
        }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
    </div>
  );
}

// Certificate Card Component
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
