
import 'animate.css';
import { Github, Mail, Linkedin, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="font-inter min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="p-8 sm:p-12">
        <div className="absolute top-8 right-8 sm:top-12 sm:right-12 text-gray-400 text-base sm:text-lg">
          © 2025
        </div>
      </header>

      {/* Main Content */}
      <main className="font-inter flex-1 flex items-center px-8 sm:px-12 pb-32">
        <div className="max-w-7xl space-y-10 sm:space-y-12">

          <div className="max-w-7xl space-y-8 text-xl sm:text-2xl font-semibold leading-relaxed text-gray-200">
            <p className="animate__animated animate__fadeInUp animate__delay-0s">
              Hi, I&apos;m Dylan Wang.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-1s">
              Currently working on the Common Platform Team at{' '}
                <a 
                href="https://www.linkedin.com/company/fidelity-investments/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white border-b border-gray-600 hover:border-gray-400 transition-all duration-200"
              >
                Fidelity Investments
              </a>
              {' '}
               as a Software Engineer Intern.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-2s">
              Previously worked on ML Research at the{' '}
                <a 
                href="https://www.linkedin.com/school/university-of-massachusetts-lowell/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white border-b border-gray-600 hover:border-gray-400 transition-all duration-200"
              >
                University of Massachusetts Lowell
              </a>
              {' '}and implemented testing and automation at{' '}
                <a 
                href="https://www.linkedin.com/company/charm-sciences-inc./"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white border-b border-gray-600 hover:border-gray-400 transition-all duration-200"
              >
                Charm Sciences
              </a>
              {' '}.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-3s">
              Building Teach & Serve (500+ Sign ups) and constantly updating{' '}
                <a 
                href="https://uselightbulb.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white border-b border-gray-600 hover:border-gray-400 transition-all duration-200"
              >
                Lightbulb
              </a>
              {' '}(50+ users).
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-4s">
              Computer Engineering Student at the{' '}
                <a 
                href="https://www.linkedin.com/school/university-of-massachusetts-amherst/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-100 hover:text-white border-b border-gray-600 hover:border-gray-400 transition-all duration-200"
              >
                University of Massachusetts Amherst
              </a>
              {' '}.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-5s">
              Avid fan of groundhogs.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 sm:px-12 pb-8">
        <div className="flex justify-between items-end">
          <div className="flex gap-6 text-lg sm:text-xl animate__animated animate__fadeInUp animate__delay-5s">
            <a
              href="https://github.com/dwang1257"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={24} />
            </a>
            <a
              href="mailto:dwang2022@gmail.com"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/dylanwang1/"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="/DylanWangResume.pdf"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Resume"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={24} />
            </a>
          </div>

          <div className="text-gray-400 text-base sm:text-lg animate__animated animate__fadeInUp animate__delay-5s">
            ANDOVER, MA
          </div>
        </div>
      </footer>
    </div>
  );
}
