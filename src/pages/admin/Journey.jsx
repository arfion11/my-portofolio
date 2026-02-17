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
  orderBy,
  query
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Plus, Edit, Trash2, LogOut, X, Upload, MapPin, Rocket, GraduationCap, Briefcase, Heart, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropModal from '../../components/ImageCropModal';
import { blobToFile } from '../../utils/cropUtils';

export default function Journey() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);

  const [formData, setFormData] = useState({
    caption: '',
    description: '',
    icon: 'pin',
    order: 0
  });

  const iconOptions = [
    { value: 'pin', label: 'Location Pin', icon: MapPin },
    { value: 'rocket', label: 'Rocket', icon: Rocket },
    { value: 'graduation', label: 'Graduation', icon: GraduationCap },
    { value: 'briefcase', label: 'Briefcase', icon: Briefcase },
    { value: 'heart', label: 'Heart', icon: Heart },
    { value: 'award', label: 'Award', icon: Award }
  ];

  useEffect(() => {
    checkAuth();
    fetchPhotos();
  }, []);

  const checkAuth = () => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/admin/login');
    }
  };

  const fetchPhotos = async () => {
    try {
      const q = query(collection(db, 'journey'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const photosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(photosData);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropImageSrc(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleCropComplete = (croppedBlob) => {
    const file = blobToFile(croppedBlob, `journey-photo-${Date.now()}.jpg`);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(croppedBlob));
  };

  const uploadImage = async () => {
    if (!imageFile) return editingPhoto?.image || '';

    try {
      const url = await uploadToCloudinary(imageFile);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrl = await uploadImage();

      const photoData = {
        ...formData,
        image: imageUrl,
        order: parseInt(formData.order) || 0,
        updatedAt: serverTimestamp()
      };

      if (editingPhoto) {
        await updateDoc(doc(db, 'journey', editingPhoto.id), photoData);
      } else {
        await addDoc(collection(db, 'journey'), {
          ...photoData,
          createdAt: serverTimestamp()
        });
      }

      fetchPhotos();
      closeModal();
    } catch (error) {
      console.error('Error saving photo:', error);
      alert('Error saving photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await deleteDoc(doc(db, 'journey', id));
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error deleting photo. Please try again.');
    }
  };

  const openModal = (photo = null) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData({
        caption: photo.caption || '',
        description: photo.description || '',
        icon: photo.icon || 'pin',
        order: photo.order || 0
      });
      setImagePreview(photo.image || '');
    } else {
      setEditingPhoto(null);
      setFormData({
        caption: '',
        description: '',
        icon: 'pin',
        order: photos.length
      });
      setImagePreview('');
    }
    setImageFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPhoto(null);
    setFormData({ caption: '', description: '', icon: 'pin', order: 0 });
    setImageFile(null);
    setImagePreview('');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading journey photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Journey Photos</h1>
            <p className="text-gray-600 mt-1">Manage your journey story photos</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Add New Button */}
        <button
          onClick={() => openModal()}
          className="mb-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Add New Photo
        </button>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No journey photos yet. Add your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => {
              const IconComponent = iconOptions.find(opt => opt.value === photo.icon)?.icon || MapPin;

              return (
                <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    {photo.image ? (
                      <img
                        src={photo.image}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconComponent className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {/* Icon Badge */}
                    <div className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full">
                      <IconComponent className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{photo.caption}</h3>
                    {photo.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{photo.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-3">Order: {photo.order}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(photo)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <ImageCropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={cropImageSrc}
        onCropComplete={handleCropComplete}
      />
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-2">Click to upload photo</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Choose Photo
                    </label>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Caption *
                  </label>
                  <input
                    type="text"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., First internship, Testing my first app"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Optional short description"
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {iconOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: option.value })}
                          className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${formData.icon === option.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          <IconComponent className={`w-6 h-6 ${formData.icon === option.value ? 'text-blue-600' : 'text-gray-600'}`} />
                          <span className={`text-sm ${formData.icon === option.value ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Saving...' : editingPhoto ? 'Update Photo' : 'Add Photo'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

