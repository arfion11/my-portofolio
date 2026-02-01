import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Award, Code, Bug } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import Card from '../components/Card';
import { pageVariants, staggerContainer, staggerItem, buttonVariants } from '../utils/animations';

// Counter animation hook
const useCounter = (end, duration = 2, shouldStart = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

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

  const stats = [
    { icon: Award, value: 2, suffix: '+', label: 'Years Experience', color: 'text-blue-600' },
    { icon: Code, value: 10, suffix: '+', label: 'Projects Tested', color: 'text-blue-600' },
    { icon: Bug, value: 500, suffix: '+', label: 'Bugs Found', color: 'text-blue-600' },
  ];

  // Counter values
  const yearsCount = useCounter(2, 1.5, isStatsInView);
  const projectsCount = useCounter(10, 2, isStatsInView);
  const bugsCount = useCounter(500, 2.5, isStatsInView);

  const counterValues = [yearsCount, projectsCount, bugsCount];

  return (
    <motion.div
      className="min-h-screen"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              className="text-5xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              Hi, I'm Pion as QA Engineer
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              I'm a QA Engineer with a strong background in manual and automation testing. I'm passionate about ensuring the quality of software products through structured testing methodologies and continuous improvement.
            </motion.p>
            <motion.div
              className="flex justify-center gap-4 flex-wrap"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <Link to="/portfolio">
                <motion.button
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold shadow-lg"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  View My Portfolio
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Contact Me
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={statsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const counterValue = counterValues[index];

              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={staggerItem}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }
                  }}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.2,
                      duration: 0.6,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                  >
                    <Icon size={48} className={stat.color} />
                  </motion.div>
                  <motion.h3
                    className="text-4xl font-bold text-gray-800 mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.2, duration: 0.4 }}
                  >
                    {counterValue}{stat.suffix}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                  >
                    {stat.label}
                  </motion.p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-white mb-8 text-center"
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
              <p className="text-gray-400 mt-4">Loading projects...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-gray-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-400">No projects yet. Add some from the admin dashboard!</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
            >
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                >
                  <Card
                    title={project.title}
                    description={project.description}
                    image={project.images?.[0]}
                    tags={project.tools}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>
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
    </motion.div>
  );
}
