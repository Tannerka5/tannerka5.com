import { motion } from 'framer-motion';

export default function AboutContent() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-gray-900 mb-8"
        >
          About Me
        </motion.h1>
        
        {/* Bio Section */}
        <motion.div
          {...fadeInUp}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img 
                src="/images/profile.jpg" 
                alt="Tanner Atkinson" 
                className="rounded-lg w-full"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hi, I'm Tanner</h2>
              <p className="text-gray-700 mb-4">
                I'm an Information Systems student at BYU Marriott School of Business, graduating in April 2027. 
                I combine technical expertise in SQL, Tableau, Python, and Django with real-world leadership 
                experience managing teams of up to 70 volunteers and 60 employees.
              </p>
              <p className="text-gray-700 mb-4">
                I've delivered measurable results by building a customer database system that contributed to a 114% 
                increase in catering sales in 3 months, launching a live web application to raise community awareness 
                of missing persons, and managing IT operations for 30+ POS and payment systems in a high-volume 
                business environment.
              </p>
              <p className="text-gray-700 mb-4">
                My passion lies at the intersection of business and technology—aligning people, processes, and systems 
                to deliver innovative solutions that drive growth. I'm particularly interested in data analytics, 
                product management, and cloud infrastructure.
              </p>
              <p className="text-gray-700">
                Outside of tech, I enjoy competitive rock climbing, exploring state and national parks, and discovering 
                new recipes. I'm fluent in Portuguese and Spanish, having spent two years in Brazil leading community 
                service projects.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          {...fadeInUp}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Technologies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Data & Analytics</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• SQL & Database Systems</li>
                <li>• Tableau & Oracle BI</li>
                <li>• Advanced Excel & VBA</li>
                <li>• Data Analysis & Visualization</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Development</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Python & Django</li>
                <li>• HTML/CSS/JavaScript</li>
                <li>• TypeScript & React</li>
                <li>• Git Version Control</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h3 className="font-semibold text-gray-900 mb-3">Cloud & Business Tools</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• AWS (S3, CloudFront, Lambda)</li>
                <li>• Networking & Data Comm</li>
                <li>• Monday CRM</li>
                <li>• Adobe Acrobat, MS Office</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          {...fadeInUp}
          className="bg-white rounded-lg shadow-md p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience Highlights</h2>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="border-l-4 border-blue-600 pl-4"
            >
              <h3 className="font-semibold text-gray-900">IT Manager & Team Lead</h3>
              <p className="text-gray-600">Chick-fil-A • August 2021 - Present</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• Maintain 30+ POS systems, payment terminals, and network infrastructure</li>
                <li>• Manage 60 staff members and analyze 20+ sales metrics to drive 26.4% sales increase</li>
                <li>• Implement inventory tracking systems to optimize waste and anticipate materials needs</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="border-l-4 border-green-600 pl-4"
            >
              <h3 className="font-semibold text-gray-900">Catering Director</h3>
              <p className="text-gray-600">Chick-fil-A • December 2019 - August 2021</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• Achieved 114% sales growth in 3 months through targeted customer engagement</li>
                <li>• Built customer database system (Monday CRM) to segment and track catering clients</li>
                <li>• Organized community outreach donating 16,000+ meals to local events</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="border-l-4 border-purple-600 pl-4"
            >
              <h3 className="font-semibold text-gray-900">Volunteer Representative</h3>
              <p className="text-gray-600">São Paulo, Brazil • September 2023 - August 2025</p>
              <ul className="text-gray-700 mt-2 space-y-1">
                <li>• Led community service projects and trained 70 volunteers in Portuguese and Spanish</li>
                <li>• Taught Beginner and Advanced English courses to strengthen cross-cultural communication</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          {...fadeInUp}
          className="bg-white rounded-lg shadow-md p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
          <div className="border-l-4 border-blue-600 pl-4">
            <h3 className="font-semibold text-gray-900">Bachelor of Science in Information Systems</h3>
            <p className="text-gray-600">Brigham Young University - Marriott School of Business</p>
            <p className="text-gray-500 text-sm mb-2">Expected Graduation: April 2027</p>
            <p className="text-gray-700 text-sm">
              Minor in Environmental Science • Member of the Association for Information Systems
            </p>
            <p className="text-gray-700 text-sm mt-2">
              <strong>Relevant Coursework:</strong> Database Systems, Business Programming, Data Communications, 
              Exploratory Data Analysis, Management Communication
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
