import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Award, Code, Bug } from 'lucide-react';
import Card from '../components/Card';

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Hi, I'm Pion as QA Engineer
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              I'm a QA Engineer with a strong background in manual and automation testing. I'm passionate about ensuring the quality of software products through structured testing methodologies and continuous improvement.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/portfolio"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View My Portfolio
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award size={48} className="text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">2+</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Code size={48} className="text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">10+</h3>
              <p className="text-gray-600">Projects Tested</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Bug size={48} className="text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-2">500+</h3>
              <p className="text-gray-600">Bugs Found</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white-800 mb-8 text-center">
            Featured Projects
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No projects yet. Add some from the admin dashboard!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <Card
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.images?.[0]}
                  tags={project.tools}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
