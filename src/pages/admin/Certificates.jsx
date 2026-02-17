
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { uploadToCloudinary } from '../../services/cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus, Trash2, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { pageVariants, buttonVariants } from '../../utils/animations';
import ImageCropModal from '../../components/ImageCropModal';
import { blobToFile } from '../../utils/cropUtils';

export default function Certificates() {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    credentialUrl: '',
    file: null,
    fileType: 'image' // 'image' or 'pdf'
  });

  // Crop state
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        fetchCertificates();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
      alert('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.includes('pdf')) {
        setFormData({ ...formData, file, fileType: 'pdf' });
        setPreviewUrl(null);
      } else {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setCropImageSrc(reader.result);
          setShowCropModal(true);
        });
        reader.readAsDataURL(file);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleCropComplete = (croppedBlob) => {
    const file = blobToFile(croppedBlob, `certificate - ${Date.now()}.jpg`);
    setFormData({ ...formData, file, fileType: 'image' });
    setPreviewUrl(URL.createObjectURL(croppedBlob));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Cloudinary
      const fileURL = await uploadToCloudinary(formData.file);

      // Add certificate to Firestore
      await addDoc(collection(db, 'certificates'), {
        title: formData.title,
        issuer: formData.issuer,
        date: formData.date,
        description: formData.description,
        credentialUrl: formData.credentialUrl || '',
        image: fileURL,
        fileType: formData.fileType,
        createdAt: new Date()
      });

      alert('Certificate added successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        issuer: '',
        date: '',
        description: '',
        file: null,
        fileType: 'image'
      });
      setPreviewUrl(null);
      fetchCertificates();
    } catch (error) {
      console.error('Error adding certificate:', error);
      alert('Failed to add certificate');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await deleteDoc(doc(db, 'certificates', id));
      alert('Certificate deleted successfully!');
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificates Management</h1>
            <p className="text-gray-600">Manage your certificates and achievements</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Back to Dashboard
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Logout
            </motion.button>
          </div>
        </div>

        {/* Add Certificate Button */}
        <motion.button
          onClick={() => setShowForm(true)}
          className="mb-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 shadow-lg"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <Plus className="w-5 h-5" />
          Add New Certificate
        </motion.button>

        {/* Add Certificate Form Modal */}
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
        />
        <AnimatePresence>
          {showForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Add New Certificate</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issuing Organization *
                    </label>
                    <input
                      type="text"
                      value={formData.issuer}
                      onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credential URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.credentialUrl}
                      onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificate File (Image or PDF) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="certificate-file"
                      />
                      <label htmlFor="certificate-file" className="cursor-pointer block">
                        {!previewUrl && !formData.file && <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />}

                        {/* Preview */}
                        {previewUrl ? (
                          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
                            <img src={previewUrl} alt="Certificate Preview" className="w-full h-full object-contain" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setPreviewUrl(null);
                                setFormData({ ...formData, file: null });
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : formData.file && formData.fileType === 'pdf' ? (
                          <div className="flex flex-col items-center mb-2">
                            <FileText className="w-16 h-16 text-red-500 mb-2" />
                            <span className="text-gray-700 font-medium">{formData.file.name}</span>
                          </div>
                        ) : (
                          <p className="text-gray-600">Click to upload image or PDF</p>
                        )}

                        <p className="text-sm text-gray-500 mt-1">
                          Supported: JPG, PNG, PDF
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Uploading...' : 'Add Certificate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Certificate Preview */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                {certificate.fileType === 'pdf' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-20 h-20 text-purple-500" />
                  </div>
                ) : (
                  <img
                    src={certificate.image}
                    alt={certificate.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(certificate.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {certificate.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  {certificate.issuer}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(certificate.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
                {certificate.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {certificate.description}
                  </p>
                )}
                <a
                  href={certificate.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View Full Certificate →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Award className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No certificates yet</p>
            <p className="text-gray-500 mt-2">Click "Add New Certificate" to get started</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}


