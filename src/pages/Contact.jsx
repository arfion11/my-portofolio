import { useState } from 'react';
import { Mail, Linkedin, Github, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buttonVariants, modalVariants } from '../utils/animations';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../services/emailjs';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        read: false, // Mark as unread initially
      });

      // 2. Send email notification via EmailJS
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            name: formData.name,      // Sesuai dengan {{name}} di template
            email: formData.email,    // Sesuai dengan {{email}} di template
            title: formData.subject,  // Sesuai dengan {{title}} di template
            message: formData.message, // Sesuai dengan {{message}} di template
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        );
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Continue even if email fails - message is still saved to Firestore
      }

      // Success!
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'diotama2arfi@gmail.com', color: 'bg-blue-100 text-blue-600' },
    { icon: Phone, label: 'Phone', value: '+62 812-9495-2500', color: 'bg-green-100 text-green-600' },
    { icon: MapPin, label: 'Location', value: 'Jakarta, Indonesia', color: 'bg-purple-100 text-purple-600' },
  ];

  const socialLinks = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/arfionrizkidiotama/', label: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: Github, href: 'https://github.com/arfion11', label: 'GitHub', color: 'bg-gray-800 hover:bg-gray-900' },
    { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&fs=1&to=diotama2arfi@gmail.com', label: 'Email', color: 'bg-red-600 hover:bg-red-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600">
            Let's discuss your needs or opportunities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.label}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div
                        className={`${info.color} p-3 rounded-full`}
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Icon size={24} />
                      </motion.div>
                      <div>
                        <p className="text-sm text-gray-500">{info.label}</p>
                        <p className="text-gray-800 font-medium">{info.value}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              className="bg-white rounded-lg shadow-md p-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Me</h2>

              <div className="flex gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith('http') ? '_blank' : undefined}
                      rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className={`${social.color} text-white p-4 rounded-lg`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.6 + (index * 0.1),
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300
                      }}
                      whileHover={{
                        scale: 1.1,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.label}
                    >
                      <Icon size={24} />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-lg shadow-md p-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Message</h2>

            <AnimatePresence>
              {status === 'success' && (
                <motion.div
                  className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center gap-2"
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <CheckCircle size={20} />
                  Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2"
                  variants={modalVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <AlertCircle size={20} />
                  Failed to send message. Please try again or contact me directly.
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {['name', 'email', 'subject'].map((field, index) => (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-2 capitalize">
                      {field} *
                    </label>
                    <motion.input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field)}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                      placeholder={
                        field === 'name' ? 'Your name' :
                        field === 'email' ? 'your.email@example.com' :
                        "What's this about?"
                      }
                      required
                      animate={{
                        scale: focusedField === field ? 1.02 : 1,
                        boxShadow: focusedField === field
                          ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                          : '0 0 0 0px rgba(59, 130, 246, 0)'
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <motion.textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField('')}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Your message here..."
                    required
                    animate={{
                      scale: focusedField === 'message' ? 1.02 : 1,
                      boxShadow: focusedField === 'message'
                        ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                        : '0 0 0 0px rgba(59, 130, 246, 0)'
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  variants={buttonVariants}
                  whileHover={status !== 'sending' ? "hover" : undefined}
                  whileTap={status !== 'sending' ? "tap" : undefined}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
