import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../config/firebase';
import { uploadToCloudinary } from '../../config/cloudinary';
import { Plus, Edit, Trash2, LogOut, X, Mail, Award, Upload, FileText, Heart, GripVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageVariants,
  buttonVariants,
  modalVariants,
  backdropVariants,
  staggerContainer,
  staggerItem
} from '../../utils/animations';
import ImageCropModal from '../../components/ImageCropModal';
import { blobToFile } from '../../utils/cropUtils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    role: '',
    projectDate: '',
    images: [],
    isSelected: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  // Featured projects reordering state
  const [showFeaturedSection, setShowFeaturedSection] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'projects'));
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);

      // Filter and sort featured projects
      const featured = projectsData
        .filter(p => p.featured || p.isSelected)
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = featuredProjects.findIndex(p => p.id === active.id);
    const newIndex = featuredProjects.findIndex(p => p.id === over.id);

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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
      // Reset input value to allow selecting same file again
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob) => {
    const file = blobToFile(croppedBlob, `project-image-${Date.now()}.jpg`);
    setImageFiles(prev => [...prev, file]);
    setPreviewUrls(prev => [...prev, URL.createObjectURL(croppedBlob)]);
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  const uploadImages = async () => {
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

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload images if ada
      let imageUrls = [];
      if (imageFiles.length > 0) {
        imageUrls = await uploadImages();
      }

      // Prepare data
      const projectData = {
        ...formData,
        images: [...(formData.images || []), ...imageUrls],
        createdAt: editingProject ? editingProject.createdAt : serverTimestamp()
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

      // Reset form
      setFormData({
        title: '',
        company: '',
        description: '',
        role: '',
        projectDate: '',
        images: [],
        isSelected: false
      });
      setImageFiles([]);
      setPreviewUrls([]);
      setShowForm(false);
      setEditingProject(null);

      // Refresh data
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Gagal menyimpan project. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      company: project.company,
      description: project.description,
      role: project.role,
      projectDate: project.projectDate || '',
      images: project.images || [],
      isSelected: project.isSelected || false
    });
    setImageFiles([]);
    setPreviewUrls([]);
    setShowForm(true);
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
        className="bg-white shadow-md"
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
                transition: { duration: 0.2 }
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
              setShowForm(true);
              setEditingProject(null);
              setFormData({
                title: '',
                company: '',
                description: '',
                role: '',
                projectDate: '',
                images: []
              });
              setImageFiles([]);
              setPreviewUrls([]);
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
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <motion.h3
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </motion.h3>
                  <motion.button
                    onClick={() => setShowForm(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {[
                      { name: 'title', label: 'Project Title *', type: 'text', required: true },
                      { name: 'company', label: 'Company / Client', type: 'text', required: false },
                    ].map((field, index) => (
                      <motion.div key={field.name} variants={staggerItem}>
                        <label className="block text-gray-700 font-semibold mb-2">
                          {field.label}
                        </label>
                        <motion.input
                          type={field.type}
                          value={formData[field.name]}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all"
                          required={field.required}
                          animate={{
                            scale: focusedField === field.name ? 1.02 : 1,
                            boxShadow: focusedField === field.name
                              ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                              : '0 0 0 0px rgba(59, 130, 246, 0)'
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    ))}

                    <motion.div variants={staggerItem}>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Description *
                      </label>
                      <motion.textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        onFocus={() => setFocusedField('description')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all"
                        rows="4"
                        required
                        animate={{
                          scale: focusedField === 'description' ? 1.02 : 1,
                          boxShadow: focusedField === 'description'
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            : '0 0 0 0px rgba(59, 130, 246, 0)'
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    {[
                      { name: 'role', label: 'Your Role as QA', placeholder: 'e.g., Manual Tester, Automation Engineer' },
                    ].map((field) => (
                      <motion.div key={field.name} variants={staggerItem}>
                        <label className="block text-gray-700 font-semibold mb-2">
                          {field.label}
                        </label>
                        <motion.input
                          type="text"
                          value={formData[field.name]}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all"
                          placeholder={field.placeholder}
                          animate={{
                            scale: focusedField === field.name ? 1.02 : 1,
                            boxShadow: focusedField === field.name
                              ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                              : '0 0 0 0px rgba(59, 130, 246, 0)'
                          }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    ))}

                    <motion.div variants={staggerItem}>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Project Date
                      </label>
                      <motion.input
                        type="date"
                        value={formData.projectDate}
                        onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                        onFocus={() => setFocusedField('projectDate')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all"
                        animate={{
                          scale: focusedField === 'projectDate' ? 1.02 : 1,
                          boxShadow: focusedField === 'projectDate'
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            : '0 0 0 0px rgba(59, 130, 246, 0)'
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>

                    <motion.div variants={staggerItem} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <input
                        type="checkbox"
                        id="isSelected"
                        checked={formData.isSelected}
                        onChange={(e) => setFormData({ ...formData, isSelected: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="isSelected" className="text-gray-700 font-medium cursor-pointer select-none">
                        Mark as Selected Project (Featured)
                      </label>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Select an image to crop and add. You can add multiple images one by one.
                      </p>

                      {/* Image Previews */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {/* Existing Images */}
                        {formData.images && formData.images.map((img, index) => (
                          <div key={`existing-${index}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img src={img} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(img)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}

                        {/* New Cropped Images */}
                        {previewUrls.map((url, index) => (
                          <div key={`new-${index}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-500">
                            <img src={url} alt={`New ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="mt-6 flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                      variants={buttonVariants}
                      whileHover={!uploading ? "hover" : undefined}
                      whileTap={!uploading ? "tap" : undefined}
                    >
                      {uploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <motion.span
                            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Uploading...
                        </span>
                      ) : (
                        editingProject ? 'Update' : 'Add Project'
                      )}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                      whileHover={{
                        backgroundColor: '#d1d5db',
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crop Modal moved outside to avoid stacking context issues */}
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
        />

        {/* Featured Projects Reordering Section */}
        {featuredProjects.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <GripVertical className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Manage Featured Projects Order</h2>
                  <p className="text-sm text-gray-500">Drag and drop to reorder featured projects</p>
                </div>
              </div>
              <motion.button
                onClick={() => setShowFeaturedSection(!showFeaturedSection)}
                className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showFeaturedSection ? 'Hide' : 'Show'}
              </motion.button>
            </div>

            <AnimatePresence>
              {showFeaturedSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={featuredProjects.map(p => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {featuredProjects.map((project) => (
                        <SortableItem key={project.id} project={project} />
                      ))}
                    </SortableContext>
                  </DndContext>

                  {featuredProjects.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No featured projects yet. Mark projects as "Selected Project (Featured)" to manage their order here.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Projects Table */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 mt-4">Loading...</p>
            </motion.div>
          ) : projects.length === 0 ? (
            <motion.div
              className="bg-white rounded-lg shadow-md p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-600">Belum ada project. Klik "Add New Project" untuk mulai!</p>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  className="bg-white divide-y divide-gray-200"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {projects.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      variants={staggerItem}
                      whileHover={{
                        backgroundColor: '#f9fafb',
                        y: -2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: { duration: 0.2 }
                      }}
                      layout
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{project.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {project.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {project.projectDate ? new Date(project.projectDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <motion.button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 mr-4 inline-block"
                          whileHover={{
                            scale: 1.2,
                            color: '#1e40af',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 inline-block"
                          whileHover={{
                            scale: 1.2,
                            color: '#991b1b',
                            transition: { duration: 0.2 }
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificate Modal */}
        <AnimatePresence>

        </AnimatePresence>
      </div>
    </>
  );
}

// Sortable Item Component for Drag and Drop
function SortableItem({ project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-md p-4 mb-3 flex items-center gap-4 cursor-move hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.01 }}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </div>

      <div className="flex-1 flex items-center gap-4">
        {project.images && project.images.length > 0 && (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-16 h-16 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{project.title}</h4>
          <p className="text-sm text-gray-500">{project.company}</p>
        </div>
      </div>

      <div className="text-sm text-gray-400">
        {project.projectDate ? new Date(project.projectDate).toLocaleDateString() : '-'}
      </div>
    </motion.div>
  );
}
