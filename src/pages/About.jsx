import { Download, Award, Code, Bug } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import profilePhoto from '../assets/images/profile.jpg';
import telkomLogo from '../assets/images/Telkom University Logo.png';
import noiceLogo from '../assets/images/Noice.png';
import transtrackLogo from '../assets/images/Trans Track Logo.jpg';
import { staggerContainer, staggerItem, buttonVariants } from '../utils/animations';

// Counter animation hook
const useCounter = (end, duration = 2, shouldStart = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

export default function About() {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const skills = {
    manual: ['Test Planning', 'Test Case Design', 'Exploratory Testing', 'Functional Testing', 'Regression Testing', 'Smoke Testing', 'UAT', 'SIT'],
    automation: ['Cypress', 'Playwright', 'Appium', 'Selenium'],
    api: ['Postman', 'Swagger', 'REST API Testing', 'API Automation'],
    performance: ['Locust', 'API Performance Testing', 'Grafana'],
    tools: ['Jira', 'Notion', 'Trello', 'Confluence', 'Git', 'GitHub', 'Figma', 'Bitbucket', 'Jenkins'],
    programming: ['JavaScript', 'TypeScript', 'Kotlin', 'Python', 'Java', 'PHP', 'C#', 'HTML', 'CSS'],
    frameworks: ['Laravel', 'Node.js', 'Android', 'Flutter', 'Unity'],
    database: ['MySQL', 'MongoDB', 'PostgreSQL'],
    methodology: ['Agile Scrum', 'Waterfall', 'SDLC', 'STLC']
  };

  const skillCategories = [
    { title: 'Manual Testing', skills: skills.manual, color: 'bg-blue-600' },
    { title: 'Automation Testing', skills: skills.automation, color: 'bg-green-600' },
    { title: 'API Testing', skills: skills.api, color: 'bg-purple-600' },
    { title: 'Performance Testing', skills: skills.performance, color: 'bg-orange-600' },
    { title: 'Tools & Bug Tracking', skills: skills.tools, color: 'bg-cyan-600' },
    { title: 'Programming Languages', skills: skills.programming, color: 'bg-indigo-600' },
    { title: 'Frameworks', skills: skills.frameworks, color: 'bg-pink-600' },
    { title: 'Database', skills: skills.database, color: 'bg-teal-600' },
    { title: 'Methodology', skills: skills.methodology, color: 'bg-red-600' },
  ];

  const stats = [
    { icon: Award, label: 'Years Experience', value: 2, suffix: '+', color: 'text-blue-600' },
    { icon: Code, label: 'Projects Tested', value: 10, suffix: '+', color: 'text-green-600' },
    { icon: Bug, label: 'Bugs Found', value: 500, suffix: '+', color: 'text-red-600' },
  ];

  // Counter values
  const yearsCount = useCounter(2, 1.5, isStatsInView);
  const projectsCount = useCounter(10, 2, isStatsInView);
  const bugsCount = useCounter(500, 2.5, isStatsInView);

  const counterValues = [yearsCount, projectsCount, bugsCount];

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Profile Section */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8 mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div
              className="w-48 h-48 rounded-full overflow-hidden shadow-lg"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
                delay: 0.2
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                transition: { duration: 0.3 }
              }}
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.h1
                className="text-4xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Arfion Rizki Diotama
              </motion.h1>
              <motion.p
                className="text-xl text-blue-600 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                QA Engineer / Software Tester
              </motion.p>
              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Passionate QA Engineer with 2+ years of experience in manual and automation testing.
                Committed to delivering high-quality software through structured testing methodologies
                and continuous improvement.
              </motion.p>
              <motion.a
                href="/cv.pdf"
                download="Arfion Rizki Diotama_CV.pdf"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Download size={20} />
                Download CV
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section with Counter Animation */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const counterValue = counterValues[index];

            return (
              <motion.div
                key={stat.label}
                className="bg-white rounded-lg shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <div className={`${stat.color} bg-opacity-10 p-4 rounded-full`}>
                    <Icon className={stat.color} size={32} />
                  </div>
                </motion.div>

                <motion.div
                  className="text-4xl font-bold text-gray-800 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                >
                  {counterValue}{stat.suffix}
                </motion.div>

                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Skills Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              className="bg-white rounded-lg shadow-md p-6"
              variants={staggerItem}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.h2
                className="text-2xl font-bold text-gray-800 mb-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIndex * 0.1, duration: 0.4 }}
              >
                {category.title}
              </motion.h2>
              <ul className="space-y-2">
                {category.skills.map((skill, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: catIndex * 0.1 + (index * 0.05),
                      duration: 0.3
                    }}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.span
                      className={`w-2 h-2 ${category.color} rounded-full`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: catIndex * 0.1 + (index * 0.05) + 0.1,
                        duration: 0.3,
                        type: "spring",
                        stiffness: 300
                      }}
                    />
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Experience Timeline */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8 mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Experience
          </motion.h2>

          <div className="space-y-8">
            {/* Experience Item 1 - NOICE */}
            <motion.div
              className="flex gap-6 items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-4 h-4 bg-blue-600 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                />
                <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
              </div>
              <motion.div
                className="flex-1 pb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800">QA Engineer</h3>
                <p className="text-blue-600 mb-2">NOICE, Jakarta, Indonesia • Aug 2025 - Present</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>Conducted manual and automated testing for Noice Web and Noice Studio using Playwright, integrating CI/CD pipelines</li>
                  <li>Implemented mobile automation testing using Appium, reducing manual effort by 40%</li>
                  <li>Executed comprehensive manual testing for Noice TV platform (smoke, sanity, regression testing)</li>
                  <li>Performed load testing using Locust to evaluate system performance and scalability</li>
                  <li>Monitored application performance metrics through Grafana dashboards, reducing downtime by 25%</li>
                  <li>Performed API testing using Postman and Swagger</li>
                  <li>Executed functional, regression, smoke, and exploratory testing, contributing to 95% on-time release rate</li>
                </ul>
              </motion.div>
              {/* Company Logo - Clickable */}
              <motion.a
                href="https://open.noice.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-24 h-24 bg-white rounded-lg shadow-md p-3 flex items-center justify-center overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  <img
                    src={noiceLogo}
                    alt="NOICE Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.a>
            </motion.div>

            {/* Experience Item 2 - TransTRACK */}
            <motion.div
              className="flex gap-6 items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-4 h-4 bg-blue-600 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                />
              </div>
              <motion.div
                className="flex-1 pb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800">QA Engineer Intern</h3>
                <p className="text-blue-600 mb-2">TransTRACK, Bandung, Indonesia • Aug 2024 - Jun 2025</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>Designed and executed test cases for web and mobile applications (functional, regression, exploratory testing) with 95% coverage</li>
                  <li>Implemented automation testing using Cypress and integrated CI/CD pipelines, reducing manual testing time by 40%</li>
                  <li>Validated 30+ API endpoints using Postman and Newman with integrated automation, reducing API error rate by 25%</li>
                  <li>Led 30+ sprint review sessions and UAT sessions in Agile environment with 93% satisfaction rate</li>
                  <li>Documented test scenarios and bug reports using project management tools, improving team traceability by 80%</li>
                </ul>
              </motion.div>
              {/* Company Logo - Clickable */}
              <motion.a
                href="https://www.transtrack.co/id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-24 h-24 bg-white rounded-lg shadow-md p-3 flex items-center justify-center overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  <img
                    src={transtrackLogo}
                    alt="TransTRACK Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.a>
            </motion.div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-8 mt-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Education
          </motion.h2>

          <div className="space-y-8">
            {/* Education Item */}
            <motion.div
              className="flex gap-6 items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-4 h-4 bg-green-600 rounded-full"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                />
              </div>
              <motion.div
                className="flex-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-xl font-bold text-gray-800">Associate's Degree in Informatics Engineering</h3>
                <p className="text-green-600 mb-2">Telkom University, Bandung, Indonesia • 2022 - 2025</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                </ul>
              </motion.div>

              {/* Telkom University Logo */}
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-white rounded-lg shadow-md p-2 flex items-center justify-center">
                  <img
                    src={telkomLogo}
                    alt="Telkom University"
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
