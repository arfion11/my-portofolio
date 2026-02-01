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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { db, storage, auth } from '../../config/firebase';
import { Plus, Edit, Trash2, LogOut, X } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    role: '',
    tools: '',
    category: 'manual',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const uploadImages = async () => {
    const imageUrls = [];
    
    for (const file of imageFiles) {
      const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
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
        tools: formData.tools.split(',').map(t => t.trim()),
        images: editingProject 
          ? [...(editingProject.images || []), ...imageUrls]
          : imageUrls,
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
        tools: '',
        category: 'manual',
        images: []
      });
      setImageFiles([]);
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
      tools: project.tools.join(', '),
      category: project.category || 'manual',
      images: project.images || []
    });
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Manage Projects</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingProject(null);
              setFormData({
                title: '',
                company: '',
                description: '',
                role: '',
                tools: '',
                category: 'manual',
                images: []
              });
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add New Project
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button onClick={() => setShowForm(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Company / Client
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Your Role as QA
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Manual Tester, Automation Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Tools (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={formData.tools}
                      onChange={(e) => setFormData({...formData, tools: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="e.g., Jira, Postman, Selenium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="manual">Manual Testing</option>
                      <option value="automation">Automation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Upload Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Bisa pilih beberapa gambar sekaligus
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {uploading ? 'Uploading...' : editingProject ? 'Update' : 'Add Project'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600">Belum ada project. Klik "Add New Project" untuk mulai!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{project.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {project.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.category === 'automation' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
