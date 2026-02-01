import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { motion } from 'framer-motion';
import { ChevronLeft, Zap, Layers, Award, Briefcase, GraduationCap } from 'lucide-react';
import MinimalProjectCard from '../components/MinimalProjectCard';

export default function CategoryView() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategoryProjects();
    }, [category]);

    const fetchCategoryProjects = async () => {
        try {
            setLoading(true);
            let q;

            if (category === 'selected') {
                // Fetch featured/selected projects
                q = query(
                    collection(db, 'projects'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Filter for featured/selected
                const selected = allProjects.filter(p => p.featured || p.isSelected);

                // If no selected projects found, fallback to showing recent projects (matching Portfolio.jsx)
                if (selected.length > 0) {
                    setProjects(selected);
                } else {
                    setProjects(allProjects.slice(0, 20));
                }
            } else if (category === 'other') {
                // Fetch projects that are not work and not selected
                q = query(
                    collection(db, 'projects'),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                const allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProjects(allProjects.filter(p => p.category !== 'work' && !p.featured && !p.isSelected));
            } else {
                // Fetch by category (work, internship, university, etc.)
                q = query(
                    collection(db, 'projects'),
                    where('category', '==', category),
                    orderBy('createdAt', 'desc')
                );
                const snapshot = await getDocs(q);
                setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Simple Banner Header */}
            <div className="bg-gray-900 py-16 mb-12 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <Link to="/portfolio">
                        <motion.button
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 font-medium transition-colors"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Portfolio
                        </motion.button>
                    </Link>

                    {/* Title */}
                    <motion.div
                        className="flex items-center gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="p-4 rounded-full bg-gray-800 border border-gray-700 shadow-lg">
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                {categoryInfo.title}
                            </h1>
                            <p className="text-gray-400 text-lg">
                                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
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
                        <p className="text-gray-600 font-medium mt-4">Loading projects...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                        <Icon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-700 text-xl font-semibold mb-2">No projects in this category</p>
                        <p className="text-gray-500">Check back later for new projects!</p>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {projects.map((project, index) => (
                            <div key={project.id} className="flex justify-center">
                                <MinimalProjectCard project={project} index={index} />
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
