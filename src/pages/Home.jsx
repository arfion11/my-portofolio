import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { pageVariants, staggerContainer, staggerItem, buttonVariants } from '../utils/animations';
import profilePhoto from '../assets/images/Gemini_Generated_Image_qv8a9oqv8a9oqv8a.png';
import heroBanner from '../assets/images/WhatsApp Image 2026-02-01 at 19.36.26.jpeg';

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), limit(3));
      const snapshot = await getDocs(q);
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeaturedProjects(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    "2+ years of experience in QA Engineering",
    "Expert in manual and automation testing",
    "Proficient with Cypress, Playwright, and Appium",
    "Strong background in API and performance testing",
    "Passionate about delivering quality software"
  ];

  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Banner Section - Futuristic & Aesthetic */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <motion.img
            src={heroBanner}
            alt="Hero Banner"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          />

          {/* Futuristic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/70 to-transparent"></div>

          {/* Animated Grid Pattern Overlay */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px']
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Glowing Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">

              {/* Main Title */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                Hi, I'm Pion.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-2xl md:text-3xl text-blue-100/90 font-light leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
              >
                Turning ideas into meaningful digital experiences.
              </motion.p>

            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Me Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Photo with Cool Animations */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              {/* Decorative Background Elements */}
              <motion.div
                className="absolute -top-10 -left-10 w-72 h-72 bg-blue-100 rounded-full opacity-50 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-100 rounded-full opacity-50 blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [90, 0, 90],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Photo Container with Floating Animation */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm"></div>

                  {/* Photo */}
                  <div className="relative m-1 rounded-2xl overflow-hidden">
                    <img
                      src={profilePhoto}
                      alt="Arfion Rizki Diotama"
                      className="w-full h-auto object-cover"
                    />

                    {/* Overlay Gradient on Hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-transparent to-transparent opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>

                {/* Floating Badge */}
                <motion.div
                  className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border-4 border-blue-500 transition-transform duration-300 hover:scale-110 hover:rotate-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">안녕</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Side - About Me Content */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                  About Me
                </h2>
              </motion.div>

              <motion.p
                className="text-lg text-gray-600 mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Hi! I'm <span className="font-bold text-blue-600">Arfion Rizki Diotama</span>,
                a passionate QA Engineer dedicated to ensuring software quality through
                meticulous testing and continuous improvement.
              </motion.p>

              <motion.p
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                With expertise in both manual and automation testing, I bring a comprehensive
                approach to quality assurance, combining technical skills with attention to detail
                to deliver exceptional results.
              </motion.p>

              {/* Highlights List */}
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 group cursor-default"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <div className="transition-transform duration-200 group-hover:scale-110">
                      <CheckCircle2 className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                    </div>
                    <p className="text-gray-700 text-lg transition-transform duration-200 group-hover:translate-x-1">{highlight}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.div
                className="mt-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link to="/about">
                  <motion.button
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Learn More About Me
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>

          {loading ? (
            <div className="text-center py-12">
              <motion.div
                className="inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
              </motion.div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-gray-100 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-600">No projects yet. Add some from the admin dashboard!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  title={project.title}
                  image={project.images?.[0]}
                  projectId={project.id}
                  delay={index * 0.05}
                />
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/portfolio">
              <motion.button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg"
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                View All Projects
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div >
  );
}
