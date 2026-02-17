import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Mail, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageVariants,
  staggerContainer,
  staggerItem,
  buttonVariants,
} from '../../utils/animations';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchMessages();
  }, [checkAuth]);

  const checkAuth = useCallback(() => {
    if (!auth.currentUser) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMarkAsRead = async (messageId, currentReadStatus) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: !currentReadStatus,
      });
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'messages', messageId));
        fetchMessages();
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
                : 'All messages read'}
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              Back to Dashboard
            </motion.button>
            <motion.button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <LogOut size={20} />
              Logout
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div
              className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            className="text-center py-12 bg-white rounded-lg shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Mail size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No messages yet</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <motion.div variants={staggerContainer} initial="initial" animate="animate">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                    !message.read ? 'border-l-4 border-blue-600' : ''
                  }`}
                  variants={staggerItem}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: { duration: 0.2 },
                  }}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{message.name}</h3>
                        {!message.read && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                      <p className="text-md font-semibold text-gray-700 mb-2">{message.subject}</p>
                      <p className="text-gray-600 line-clamp-2">{message.message}</p>
                      <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                        <Clock size={14} />
                        {formatDate(message.createdAt)}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(message.id, message.read);
                        }}
                        className={`p-2 rounded-lg ${
                          message.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={message.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {message.read ? <Eye size={18} /> : <CheckCircle size={18} />}
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete message"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Message Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {selectedMessage.subject}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {formatDate(selectedMessage.createdAt)}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">From:</p>
                      <p className="font-semibold text-gray-800">{selectedMessage.name}</p>
                      <p className="text-blue-600">{selectedMessage.email}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Message:</p>
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-center"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Reply via Email
                    </motion.a>
                    <motion.button
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id, selectedMessage.read);
                        setSelectedMessage(null);
                      }}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
