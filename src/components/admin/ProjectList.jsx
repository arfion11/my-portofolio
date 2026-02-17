import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { staggerContainer, staggerItem } from '../../utils/animations';

export default function ProjectList({ projects, loading, onEdit, onDelete }) {
  return (
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
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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
          <p className="text-gray-600">
            Belum ada project. Klik &quot;Add New Project&quot; untuk mulai!
          </p>
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
              className="divide-y divide-gray-200"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    variants={staggerItem}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{
                      backgroundColor: '#f9fafb',
                      y: -2,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                      transition: { duration: 0.2 },
                    }}
                    layout
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {project.images && project.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={project.images[0]}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          {project.isSelected && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {project.projectDate
                        ? new Date(project.projectDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <motion.button
                        onClick={() => onEdit(project)}
                        className="text-blue-600 hover:text-blue-900 inline-block"
                        whileHover={{
                          scale: 1.2,
                          color: '#1e40af',
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        onClick={() => onDelete(project.id)}
                        className="text-red-600 hover:text-red-900 inline-block"
                        whileHover={{
                          scale: 1.2,
                          color: '#991b1b',
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </motion.tbody>
          </table>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
