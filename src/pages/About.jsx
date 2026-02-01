import { Download } from 'lucide-react';
import profilePhoto from '../assets/images/profile.jpg'; 

export default function About() {
  const skills = {
    manual: ['Test Case Design', 'Bug Reporting', 'Regression Testing', 'UAT', 'API Testing'],
    automation: ['Selenium WebDriver', 'Cypress', 'Postman', 'JMeter', 'REST API Testing'],
    tools: ['Jira', 'TestRail', 'Git', 'Slack', 'Confluence']
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg">
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Arfion Rizki Diotama</h1>
              <p className="text-xl text-blue-600 mb-4">QA Engineer / Software Tester</p>
              <p className="text-gray-600 mb-6">
                Passionate QA Engineer with 2+ years of experience in manual and automation testing. 
                Committed to delivering high-quality software through structured testing methodologies 
                and continuous improvement.
              </p>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={20} />
                <a 
                href="/cv.pdf" 
                download="Arfion Rizki Diotama_CV.pdf" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download CV
                </a>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manual Testing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manual Testing</h2>
            <ul className="space-y-2">
              {skills.manual.map((skill, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Automation Testing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Automation</h2>
            <ul className="space-y-2">
              {skills.automation.map((skill, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tools</h2>
            <ul className="space-y-2">
              {skills.tools.map((skill, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Experience</h2>
          
          <div className="space-y-8">
            {/* Experience Item 1 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <h3 className="text-xl font-bold text-gray-800">QA Engineer</h3>
                <p className="text-blue-600 mb-2">PT ABC Technology • 2022 - Present</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>Created and executed 200+ test cases for web and mobile applications</li>
                  <li>Reduced production bugs by 30% through comprehensive regression testing</li>
                  <li>Implemented automation framework using Selenium WebDriver</li>
                </ul>
              </div>
            </div>

            {/* Experience Item 2 */}
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
              </div>
              <div className="flex-1 pb-8">
                <h3 className="text-xl font-bold text-gray-800">Junior QA Tester</h3>
                <p className="text-blue-600 mb-2">PT XYZ Software • 2021 - 2022</p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>Performed manual testing for e-commerce platform</li>
                  <li>Documented and tracked bugs using Jira</li>
                  <li>Collaborated with developers to ensure timely bug fixes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
