import { Mail, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '../utils/animations';

export default function Footer() {
  const socialLinks = [
    {
      icon: Mail,
      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=diotama2arfi@gmail.com',
      label: 'Email',
      color: 'hover:text-red-400'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/arfionrizkidiotama/',
      label: 'LinkedIn',
      color: 'hover:text-blue-400'
    },
    {
      icon: Github,
      href: 'https://github.com/arfion11',
      label: 'GitHub',
      color: 'hover:text-purple-400'
    },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* About Section */}
          <motion.div variants={staggerItem}>
            <h3 className="text-xl font-bold mb-4">Arfion Rizki Diotama</h3>
            <p className="text-gray-300">
              Ensuring quality through structured testing & automation
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <motion.a
                    href={link.path}
                    className="text-gray-300 inline-block"
                    whileHover={{
                      color: '#ffffff',
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={staggerItem}>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`text-gray-300 ${social.color} transition-colors`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: [0.43, 0.13, 0.23, 0.96]
                    }}
                    whileHover={{
                      scale: 1.2,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={social.label}
                  >
                    <Icon size={24} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p>&copy; 2026 arfionrizkidiotama Portfolio. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
