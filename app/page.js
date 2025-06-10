
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
          <h1 className="text-5xl sm:text-6xl font-light leading-relaxed animate__animated animate__fadeInUp">
            Hi, I'm Dylan Wang.
          </h1>

          <div className="max-w-7xl space-y-8 text-xl sm:text-2xl font-light leading-relaxed text-gray-200">
            <p className="animate__animated animate__fadeInUp animate__delay-1s">
              Currently working on the Common Platform Team at Fidelity Investments as a Software Engineer Intern.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-2s">
              Previously optimized medical imaging pipelines at UMass Lowell and tested firmware at Charm Sciences.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-3s">
              Building Teach and Serve (200+ Sign ups) and Lightbulb (50+ users).
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-4s">
              Senior Computer Engineering Student at the University of Massachusetts Amherst.
            </p>
            <p className="animate__animated animate__fadeInUp animate__delay-5s">
              Sentinels Fan.
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
              href=""
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Resume"
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
