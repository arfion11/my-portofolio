import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import Card from '../components/Card';

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Portfolio</h1>
          <p className="text-xl text-gray-600">
            Projects I've tested and ensured quality for
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('manual')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'manual'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manual Testing
          </button>
          <button
            onClick={() => setFilter('automation')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              filter === 'automation'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Automation
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">No projects yet</p>
            <p className="text-sm text-gray-500">
              Add your first project from the admin dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter(project => {
                if (filter === 'all') return true;
                return project.category === filter;
              })
              .map((project) => (
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
      </div>
    </div>
  );
}
