import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { LogOut, Plus, Mail, Heart, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { buttonVariants } from '../../utils/animations';
import { arrayMove } from '@dnd-kit/sortable';

import FeaturedProjectsManager from '../../components/admin/FeaturedProjectsManager';
import ProjectList from '../../components/admin/ProjectList';
import ProjectForm from '../../components/admin/ProjectForm';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Featured projects reordering state
  const [showFeaturedSection, setShowFeaturedSection] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);

      // Filter and sort featured projects
      const featured = projectsData
        .filter((p) => p.featured || p.isSelected)
        .sort((a, b) => {
          // Sort by displayOrder if exists, otherwise by createdAt
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          if (a.displayOrder !== undefined) return -1;
          if (b.displayOrder !== undefined) return 1;
          return 0;
        });
      setFeaturedProjects(featured);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = featuredProjects.findIndex((p) => p.id === active.id);
    const newIndex = featuredProjects.findIndex((p) => p.id === over.id);

    const reorderedProjects = arrayMove(featuredProjects, oldIndex, newIndex);
    setFeaturedProjects(reorderedProjects);

    // Update displayOrder in Firestore
    try {
      const updatePromises = reorderedProjects.map((project, index) =>
        updateDoc(doc(db, 'projects', project.id), { displayOrder: index })
      );
      await Promise.all(updatePromises);

      // Refresh all projects to update the main list
      fetchProjects();
    } catch (error) {
      console.error('Error updating project order:', error);
      alert('Failed to update project order. Please try again.');
      // Revert on error
      fetchProjects();
    }
  };

  const handleCreateOrUpdate = async (formData, imageFiles) => {
    setIsSubmitting(true);

    try {
      // Upload images if any
      const imageUrls = [];
      for (const file of imageFiles) {
        try {
          const url = await uploadToCloudinary(file);
          imageUrls.push(url);
        } catch (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // Prepare data
      const projectData = {
        ...formData,
        images: [...(formData.images || []), ...imageUrls],
        createdAt: editingProject ? editingProject.createdAt : serverTimestamp(),
      };

      if (editingProject) {
        // Update existing project
        await updateDoc(doc(db, 'projects', editingProject.id), projectData);
        alert('Project berhasil diupdate!');
      } else {
        // Add new project
        await addDoc(collection(db, 'projects'), projectData);
        alert('Project berhasil ditambahkan!');
      }

      // Reset and close
      setShowForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Gagal menyimpan project. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin mau hapus project ini?')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
        alert('Project berhasil dihapus!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Gagal menghapus project.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white shadow-md relative z-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate('/admin/messages')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Mail size={20} />
              Messages
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/journey')}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1625, duration: 0.5 }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Heart size={20} />
              Journey Photos
            </motion.button>
            <motion.button
              onClick={() => navigate('/admin/certificates')}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.175, duration: 0.5 }}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Award size={20} />
              Certificates
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 font-semibold"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                color: '#dc2626',
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        <motion.div
          className="mb-6 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800">Manage Projects</h2>
          <motion.button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Plus size={20} />
            Add New Project
          </motion.button>
        </motion.div>

        {/* Form Modal */}
        <ProjectForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateOrUpdate}
          initialData={editingProject}
          isSubmitting={isSubmitting}
        />

        {/* Featured Projects Reordering Section */}
        {featuredProjects.length > 0 && (
          <FeaturedProjectsManager
            projects={featuredProjects}
            onReorder={handleReorder}
            isOpen={showFeaturedSection}
            onToggle={() => setShowFeaturedSection(!showFeaturedSection)}
          />
        )}

        {/* Projects Table */}
        <ProjectList
          projects={projects}
          loading={loading}
          onEdit={(project) => {
            setEditingProject(project);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
