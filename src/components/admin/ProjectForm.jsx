import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  modalVariants,
  backdropVariants,
  staggerContainer,
  staggerItem,
  buttonVariants,
} from '../../utils/animations';
import ImageCropModal from '../ImageCropModal';
import { blobToFile } from '../../utils/cropUtils';

export default function ProjectForm({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    role: '',
    projectDate: '',
    images: [],
    isSelected: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [focusedField, setFocusedField] = useState('');

  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  // Initialize form when opening/editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          title: initialData.title || '',
          company: initialData.company || '',
          description: initialData.description || '',
          role: initialData.role || '',
          projectDate: initialData.projectDate || '',
          images: initialData.images || [],
          isSelected: initialData.isSelected || false,
        });
      } else {
        // Reset form
        setFormData({
          title: '',
          company: '',
          description: '',
          role: '',
          projectDate: '',
          images: [],
          isSelected: false,
        });
      }
      setImageFiles([]);
      setPreviewUrls([]);
    }
  }, [isOpen, initialData]);

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
    setImageFiles((prev) => [...prev, file]);
    setPreviewUrls((prev) => [...prev, URL.createObjectURL(croppedBlob)]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageUrl),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFiles);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h3
                  className="text-2xl font-bold text-gray-800"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {initialData ? 'Edit Project' : 'Add New Project'}
                </motion.h3>
                <motion.button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
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
                  ].map((field) => (
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
                          boxShadow:
                            focusedField === field.name
                              ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                              : '0 0 0 0px rgba(59, 130, 246, 0)',
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  ))}

                  <motion.div variants={staggerItem}>
                    <label className="block text-gray-700 font-semibold mb-2">Description *</label>
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
                        boxShadow:
                          focusedField === 'description'
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            : '0 0 0 0px rgba(59, 130, 246, 0)',
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  {[
                    {
                      name: 'role',
                      label: 'Your Role as QA',
                      placeholder: 'e.g., Manual Tester, Automation Engineer',
                    },
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
                          boxShadow:
                            focusedField === field.name
                              ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                              : '0 0 0 0px rgba(59, 130, 246, 0)',
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.div>
                  ))}

                  <motion.div variants={staggerItem}>
                    <label className="block text-gray-700 font-semibold mb-2">Project Date</label>
                    <motion.input
                      type="date"
                      value={formData.projectDate}
                      onChange={(e) => setFormData({ ...formData, projectDate: e.target.value })}
                      onFocus={() => setFocusedField('projectDate')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all"
                      animate={{
                        scale: focusedField === 'projectDate' ? 1.02 : 1,
                        boxShadow:
                          focusedField === 'projectDate'
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            : '0 0 0 0px rgba(59, 130, 246, 0)',
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <input
                      type="checkbox"
                      id="isSelected"
                      checked={formData.isSelected}
                      onChange={(e) => setFormData({ ...formData, isSelected: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor="isSelected"
                      className="text-gray-700 font-medium cursor-pointer select-none"
                    >
                      Mark as Selected Project (Featured)
                    </label>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label className="block text-gray-700 font-semibold mb-2">Upload Images</label>
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
                      {formData.images &&
                        formData.images.map((img, index) => (
                          <div
                            key={`existing-${index}`}
                            className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden"
                          >
                            <img
                              src={img}
                              alt={`Existing ${index}`}
                              className="w-full h-full object-cover"
                            />
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
                      {previewUrls.map((url, i) => (
                        <div
                          key={`new-${i}`}
                          className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-500"
                        >
                          <img src={url} alt={`New ${i}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
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
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                    variants={buttonVariants}
                    whileHover={!isSubmitting ? 'hover' : undefined}
                    whileTap={!isSubmitting ? 'tap' : undefined}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Uploading...
                      </span>
                    ) : initialData ? (
                      'Update'
                    ) : (
                      'Add Project'
                    )}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
                    whileHover={{
                      backgroundColor: '#d1d5db',
                      scale: 1.02,
                      transition: { duration: 0.2 },
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

      {/* Crop Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
    </>
  );
}
