import { useState } from 'react';
import { Mail, Linkedin, Github, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulasi pengiriman (bisa diganti dengan API email nanti)
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status setelah 3 detik
      setTimeout(() => setStatus(''), 3000);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600">
            Let's discuss your QA needs or opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">your-email@example.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Phone className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-800 font-medium">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <MapPin className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium">Jakarta, Indonesia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Connect With Me</h2>
              
              <div className="flex gap-4">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <Github size={24} />
                </a>
                <a
                  href="mailto:your-email@example.com"
                  className="bg-red-600 text-white p-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Message</h2>

            {status === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
