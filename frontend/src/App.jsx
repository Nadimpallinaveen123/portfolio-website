import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Menu,
  Moon,
  Phone,
  Search,
  Send,
  Sun,
  Trash2,
  UserCheck,
  X
} from 'lucide-react';
import { adminApi, publicApi, resumeApi } from './api';
import {
  certifications,
  education,
  experiences,
  expertise,
  highlights,
  journey,
  navItems,
  profile,
  projects,
  serviceOfferings,
  skillGroups,
  technologyLogos,
  techStack,
  values
} from './data';

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35 }
};

function cls(...classes) {
  return classes.filter(Boolean).join(' ');
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [resumeOpen, setResumeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setMenuOpen(false);
    publicApi.visit(location.pathname).catch(() => undefined);
  }, [location.pathname]);

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (!gaId) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-ink transition-colors dark:bg-[#101418] dark:text-white">
      <Header
        darkMode={darkMode}
        menuOpen={menuOpen}
        setDarkMode={setDarkMode}
        setMenuOpen={setMenuOpen}
        onResume={() => setResumeOpen(true)}
      />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage onResume={() => setResumeOpen(true)} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppButton />
      <ResumeDownloadModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}

function Header({ darkMode, menuOpen, setDarkMode, setMenuOpen, onResume }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/88 backdrop-blur-xl dark:border-white/10 dark:bg-[#101418]/88">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Naveen portfolio home">
          <span className="grid h-10 w-10 place-items-center rounded bg-accent text-sm font-bold text-white">NN</span>
          <span className="leading-tight">
            <span className="block text-sm font-bold">Naveen Nadimpalli</span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Java Full Stack Developer</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cls(
                  'rounded px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <IconLink href={profile.linkedin} label="LinkedIn">
            <Linkedin size={18} />
          </IconLink>
          <IconLink href={profile.github} label="GitHub">
            <Github size={18} />
          </IconLink>
          <IconButton label={darkMode ? 'Light mode' : 'Dark mode'} onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <button className="btn-primary h-10" onClick={onResume}>
            <Download size={17} />
            Resume
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <IconButton label={darkMode ? 'Light mode' : 'Dark mode'} onClick={() => setDarkMode((value) => !value)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </IconButton>
          <IconButton label="Menu" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </IconButton>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#101418] md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="rounded px-3 py-2 text-sm font-semibold">
                {item.label}
              </NavLink>
            ))}
            <button className="btn-primary mt-2 h-11 justify-center" onClick={onResume}>
              <Download size={17} />
              Download Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HomePage({ onResume }) {
  return (
    <motion.div {...pageMotion}>
      <section className="hero-band">
        <div className="hero-overlay" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl content-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded bg-white/[0.12] px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/25">
              {profile.experience}
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-white sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-teal-100 sm:text-3xl">{profile.title}</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">{profile.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary h-12">
                <UserCheck size={18} />
                Contact
              </Link>
              <button className="btn-secondary h-12 border-white/30 bg-white/[0.12] text-white hover:bg-white/[0.18]" onClick={onResume}>
                <FileDown size={18} />
                Download Resume
              </button>
              <Link to="/projects" className="btn-secondary h-12 border-white/30 bg-white/[0.12] text-white hover:bg-white/[0.18]">
                <ArrowRight size={18} />
                View Projects
              </Link>
              <Link to="/services" className="btn-secondary h-12 border-white/30 bg-white/[0.12] text-white hover:bg-white/[0.18]">
                <BriefcaseBusiness size={18} />
                Freelance Services
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:pl-8">
            <div className="glass-panel p-5 text-white">
              <div className="flex items-center gap-4">
                <div className="photo-placeholder">
                  <span>NN</span>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-teal-100">Available for opportunities</p>
                  <p className="mt-2 text-lg font-black">Java Full Stack Specialist</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    ✨ Java Full Stack Developer | Microservices & Cloud Innovator | AI-Driven Productivity
                  </p>
                </div>
              </div>
            </div>
            <MetricsStrip />
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionTitle eyebrow="Technology Stack" title="Enterprise Java, Cloud, Frontend, and Data" />
        <TechLogoSlider />
        <div className="mt-8 flex flex-wrap gap-3">{techStack.map((tech) => <span key={tech} className="tech-pill">{tech}</span>)}</div>
      </section>

      <section className="section-muted">
        <SectionTitle eyebrow="Current Skills" title="Built for production teams and hiring conversations" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item) => (
            <motion.div
              whileHover={{ y: -5 }}
              key={item.title}
              className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <item.icon className="mb-4 text-accent" size={28} />
              <h3 className="text-base font-bold">{item.title}</h3>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function AboutPage() {
  return (
    <motion.section className="section" {...pageMotion}>
      <SectionTitle eyebrow="About Me" title="Java Full Stack Developer focused on reliable enterprise delivery" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 className="text-xl font-bold">Professional Summary</h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
            I am Naveen Nadimpalli, a Java Full Stack Developer with 4.5+ years of experience designing,
            building, and supporting enterprise applications. My work spans Spring Boot services, microservices,
            Kafka event flows, AWS deployments, React interfaces, and relational and NoSQL persistence.
          </p>
          <div className="mt-6 grid gap-3">
            {['OEM Integration', 'Credit Management Systems', 'Shipment Tracking Systems', 'Survey Management Platforms'].map((domain) => (
              <div key={domain} className="flex items-center gap-3 rounded bg-slate-50 p-3 dark:bg-white/8">
                <CheckCircle2 className="text-accent" size={18} />
                <span className="text-sm font-semibold">{domain}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <InfoBlock title="Career Journey" items={journey} />
          <InfoBlock title="Technical Expertise" items={expertise} />
          <InfoBlock title="Education" items={education} />
          <InfoBlock title="Certifications" items={certifications} />
        </div>
      </div>
    </motion.section>
  );
}

function SkillsPage() {
  return (
    <motion.section className="section" {...pageMotion}>
      <SectionTitle eyebrow="Skills" title="Full-stack capabilities across backend, cloud, frontend, and databases" />
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <motion.article
            key={group.title}
            whileHover={{ y: -6 }}
            className="rounded border border-black/10 bg-white p-6 shadow-sm transition dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded bg-accent/10 text-accent">
                <group.icon size={26} />
              </div>
              <h2 className="text-xl font-bold">{group.title}</h2>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {group.skills.map((skill) => (
                <span key={skill} className="rounded border border-black/10 px-3 py-3 text-center text-sm font-semibold dark:border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ExperiencePage() {
  return (
    <motion.section className="section" {...pageMotion}>
      <SectionTitle eyebrow="Experience" title="Enterprise timeline across service delivery and product engineering" />
      <div className="relative mt-10 grid gap-6 lg:ml-6">
        <div className="absolute bottom-6 left-6 top-6 hidden w-px bg-gradient-to-b from-accent via-slate-300 to-transparent lg:block" />
        {experiences.map((item, index) => (
          <motion.article
            key={item.company}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card relative grid gap-4 p-6 lg:ml-12"
          >
            <div className="hidden lg:absolute lg:-left-[4.4rem] lg:top-6 lg:grid lg:h-12 lg:w-12 lg:place-items-center lg:rounded lg:bg-accent lg:text-white">
              <item.icon size={22} />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-accent">{item.period}</p>
                <h1 className="mt-2 text-2xl font-black">{item.company}</h1>
                <p className="mt-1 font-bold text-slate-600 dark:text-slate-300">{item.role}</p>
              </div>
              <span className="rounded bg-accent/10 px-3 py-2 text-xs font-black uppercase text-accent">Java Full Stack</span>
            </div>
            <p className="max-w-3xl leading-8 text-slate-600 dark:text-slate-300">{item.summary}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ProjectsPage() {
  return (
    <motion.section className="section" {...pageMotion}>
      <SectionTitle eyebrow="Projects" title="Enterprise platforms with backend depth and user-facing delivery" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <motion.article
            key={project.name}
            whileHover={{ y: -6 }}
            className="rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-accent/10 text-accent">
                <project.icon size={25} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{project.name}</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  {tech}
                </span>
              ))}
            </div>
            <div className="project-shot mt-5">
              <div className="project-shot-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="grid h-36 place-items-center rounded-b bg-slate-100 text-center text-sm font-black uppercase tracking-wide text-slate-500 dark:bg-white/8 dark:text-slate-300">
                {project.screenshotLabel}
              </div>
            </div>
            <ProjectList title="Responsibilities" items={project.responsibilities} />
            <ProjectList title="Key Achievements" items={project.achievements} />
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

function ServicesPage() {
  return (
    <motion.section className="section" {...pageMotion}>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionTitle eyebrow="Freelance Services" title="Practical Java and React delivery for small teams and growing businesses" />
        <Link to="/contact" className="btn-primary h-11">
          <Send size={17} />
          Start a Project
        </Link>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {serviceOfferings.map((service) => (
          <motion.article
            key={service.title}
            whileHover={{ y: -5 }}
            className="rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded bg-accent/10 text-accent">
                <service.icon size={25} />
              </div>
              <div>
                <h2 className="text-xl font-black">{service.title}</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{service.summary}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {service.items.map((item) => (
                <p key={item} className="flex items-center gap-2 rounded bg-slate-50 px-3 py-2 text-sm font-semibold dark:bg-white/8">
                  <CheckCircle2 className="shrink-0 text-accent" size={16} />
                  {item}
                </p>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="text-xl font-black">Available for freelance work</h2>
        <p className="mt-3 max-w-3xl leading-8 text-slate-600 dark:text-slate-300">
          I can help with new feature development, backend API work, React UI implementation, deployment fixes,
          and production support for Java full stack applications.
        </p>
      </div>
    </motion.section>
  );
}

function ContactPage() {
  const [form, setForm] = useState({ fullName: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  async function submit(event) {
    event.preventDefault();
    setStatus('Sending...');
    try {
      await publicApi.contact(form);
      setForm({ fullName: '', email: '', message: '' });
      setStatus('Message sent successfully.');
    } catch {
      setStatus('Unable to send message right now.');
    }
  }

  return (
    <motion.section className="section" {...pageMotion}>
      <SectionTitle eyebrow="Contact" title="Recruiter and hiring manager contact" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-4">
          <ContactLink icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactLink icon={Linkedin} label="LinkedIn" value="View profile" href={profile.linkedin} />
          <ContactLink icon={Github} label="GitHub" value="View repositories" href={profile.github} />
          <ContactLink icon={MapPin} label="Location" value={profile.location} href="https://www.google.com/maps/search/?api=1&query=India" />
        </div>
        <form className="rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5" onSubmit={submit}>
          <div className="grid gap-4">
            <TextInput label="Full Name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} required />
            <TextInput label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
            <label className="grid gap-2 text-sm font-semibold">
              Message
              <textarea
                className="input min-h-36 resize-y"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                required
              />
            </label>
            <button className="btn-primary h-11 w-fit">
              <Send size={17} />
              Send Message
            </button>
            {status && <p className="text-sm font-semibold text-accent">{status}</p>}
          </div>
        </form>
      </div>
      <div className="mt-10 overflow-hidden rounded border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 border-b border-black/10 px-5 py-4 dark:border-white/10">
          <MapPin size={19} className="text-accent" />
          <h2 className="font-black">Google Maps</h2>
        </div>
        <iframe
          title="Naveen Nadimpalli location map"
          className="h-72 w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=India&output=embed"
        />
      </div>
    </motion.section>
  );
}

function ResumeDownloadModal({ open, onClose }) {
  const [step, setStep] = useState('details');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    companyName: '',
    designation: '',
    reason: ''
  });
  const [recruiterId, setRecruiterId] = useState(null);
  const [otp, setOtp] = useState('');
  const [downloadToken, setDownloadToken] = useState('');
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep('details');
      setStatus('');
      setToast(null);
      setOtp('');
      setDownloadToken('');
      setLoading(false);
    }
  }, [open]);

  function showToast(type, message) {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4200);
  }

  function apiError(error, fallback) {
    if (!error.response) {
      return 'Backend API not reachable. Start the Spring Boot backend or check VITE_API_BASE_URL.';
    }
    return error.response?.data?.message || fallback;
  }

  async function requestOtp(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('Sending OTP...');
    try {
      const response = await resumeApi.requestOtp(form);
      setRecruiterId(response.data.recruiterId);
      setStep('otp');
      setStatus('OTP sent to recruiter email.');
      showToast('success', 'OTP sent successfully. Please check the recruiter email.');
    } catch (error) {
      const message = apiError(error, 'Unable to Send OTP');
      setStatus(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('Verifying...');
    try {
      const response = await resumeApi.verifyOtp({ recruiterId, otp });
      setDownloadToken(response.data.downloadToken);
      setStep('download');
      setStatus('Verification successful.');
      showToast('success', 'OTP verified successfully. Resume is ready to download.');
    } catch (error) {
      const message = apiError(error, 'OTP Verification Failed');
      setStatus(message);
      showToast('error', message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadResume() {
    setLoading(true);
    setStatus('Preparing resume...');
    try {
      const response = await resumeApi.download(downloadToken);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'NaveenNadimpalli_JFS_updated_resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setStatus('Resume downloaded.');
      showToast('success', 'Resume downloaded successfully.');
    } catch {
      setStatus('Unable to download resume.');
      showToast('error', 'Unable to download resume.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded bg-white p-6 shadow-enterprise dark:bg-[#171c22]"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">Verified Resume Access</p>
            <h2 className="mt-1 text-2xl font-black">Download Naveen Nadimpalli Resume</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </div>

        {toast && <Toast type={toast.type} message={toast.message} />}

        {step === 'details' && (
          <form className="mt-6 grid gap-4" onSubmit={requestOtp}>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Full Name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} required />
              <TextInput label="Mobile Number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} required />
              <TextInput label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} required />
              <TextInput label="Company Name" value={form.companyName} onChange={(value) => setForm({ ...form, companyName: value })} required />
              <TextInput label="Designation" value={form.designation} onChange={(value) => setForm({ ...form, designation: value })} required />
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Reason For Download
              <textarea className="input min-h-28" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required />
            </label>
            <button className="btn-primary h-11 w-fit disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
              {loading ? <Spinner /> : <Lock size={17} />}
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="mt-6 grid gap-4" onSubmit={verifyOtp}>
            <TextInput label="Enter OTP" value={otp} onChange={setOtp} required />
            <button className="btn-primary h-11 w-fit disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
              {loading ? <Spinner /> : <CheckCircle2 size={17} />}
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 'download' && (
          <div className="mt-6">
            <button className="btn-primary h-12 disabled:cursor-not-allowed disabled:opacity-60" onClick={downloadResume} disabled={loading}>
              {loading ? <Spinner /> : <FileDown size={18} />}
              {loading ? 'Preparing...' : 'Download Resume'}
            </button>
          </div>
        )}

        {status && <p className="mt-5 text-sm font-semibold text-accent">{status}</p>}
      </motion.div>
    </div>
  );
}

function AdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [status, setStatus] = useState('');

  async function login(event) {
    event.preventDefault();
    setStatus('Signing in...');
    try {
      const response = await adminApi.login(credentials);
      localStorage.setItem('adminToken', response.data.token);
      setToken(response.data.token);
      setStatus('');
    } catch {
      setStatus('Invalid admin credentials.');
    }
  }

  if (!token) {
    return (
      <motion.section className="section" {...pageMotion}>
        <SectionTitle eyebrow="Admin" title="Secure recruiter dashboard" />
        <form className="mt-10 max-w-md rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5" onSubmit={login}>
          <div className="grid gap-4">
            <TextInput label="Username" value={credentials.username} onChange={(value) => setCredentials({ ...credentials, username: value })} required />
            <TextInput
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(value) => setCredentials({ ...credentials, password: value })}
              required
            />
            <button className="btn-primary h-11 w-fit">
              <Lock size={17} />
              Login
            </button>
            {status && <p className="text-sm font-semibold text-red-600">{status}</p>}
          </div>
        </form>
      </motion.section>
    );
  }

  return <AdminDashboard onLogout={() => {
    localStorage.removeItem('adminToken');
    setToken('');
  }} />;
}

function AdminDashboard({ onLogout }) {
  const [search, setSearch] = useState('');
  const [recruiters, setRecruiters] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [stats, setStats] = useState({});
  const [status, setStatus] = useState('');

  async function loadData(query = search) {
    try {
      const [recruiterResponse, downloadResponse, statsResponse] = await Promise.all([
        adminApi.recruiters({ search: query }),
        adminApi.downloads(),
        adminApi.stats()
      ]);
      setRecruiters(recruiterResponse.data);
      setDownloads(downloadResponse.data);
      setStats(statsResponse.data);
    } catch {
      setStatus('Unable to load dashboard data.');
    }
  }

  useEffect(() => {
    loadData('');
  }, []);

  async function exportExcel() {
    const response = await adminApi.exportExcel();
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recruiter-downloads.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async function remove(id) {
    await adminApi.deleteRecruiter(id);
    loadData();
  }

  return (
    <motion.section className="section" {...pageMotion}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle eyebrow="Admin Dashboard" title="Recruiters, downloads, and verification activity" />
        <button className="btn-secondary h-10" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric label="Recruiters" value={stats.totalRecruiters || 0} />
        <DashboardMetric label="Verified" value={stats.verifiedRecruiters || 0} />
        <DashboardMetric label="Downloads" value={stats.totalDownloads || 0} />
        <DashboardMetric label="Visitors" value={stats.totalVisitors || 0} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <label className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="input pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records" />
        </label>
        <button className="btn-secondary h-11" onClick={() => loadData(search)}>
          <Search size={17} />
          Search
        </button>
        <button className="btn-primary h-11" onClick={exportExcel}>
          <Download size={17} />
          Export Excel
        </button>
      </div>

      {status && <p className="mt-4 text-sm font-semibold text-red-600">{status}</p>}

      <div className="mt-8 overflow-hidden rounded border border-black/10 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {recruiters.map((item) => (
                <tr key={item.id} className="border-t border-black/10 dark:border-white/10">
                  <td className="px-4 py-3 font-semibold">{item.fullName}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.companyName}</td>
                  <td className="px-4 py-3">{item.designation}</td>
                  <td className="px-4 py-3">{item.otpVerified ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3">{new Date(item.createdDate).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <IconButton label="Delete" onClick={() => remove(item.id)}>
                      <Trash2 size={17} />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 rounded border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BarChart3 size={20} />
          Recent Downloads
        </h2>
        <div className="mt-4 grid gap-3">
          {downloads.slice(0, 8).map((item) => (
            <div key={item.id} className="rounded bg-slate-50 p-3 text-sm dark:bg-white/8">
              {item.recruiterEmail} downloaded at {new Date(item.downloadTime).toLocaleString()} from {item.ipAddress || 'unknown IP'}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function MetricsStrip() {
  const { data: metrics = { visitors: 0, downloads: 0 } } = useQuery({
    queryKey: ['public-metrics'],
    queryFn: async () => {
      const response = await publicApi.metrics();
      return response.data;
    }
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded bg-white/[0.12] p-4 text-white ring-1 ring-white/20">
        <p className="text-3xl font-black">{metrics.visitors}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-slate-200">Visitors</p>
      </div>
      <div className="rounded bg-white/[0.12] p-4 text-white ring-1 ring-white/20">
        <p className="text-3xl font-black">{metrics.downloads}</p>
        <p className="mt-1 text-xs font-semibold uppercase text-slate-200">Resume Downloads</p>
      </div>
    </div>
  );
}

function TechLogoSlider() {
  const repeated = [...technologyLogos, ...technologyLogos];

  return (
    <div className="logo-rail mt-8" aria-label="Technology logos slider">
      <div className="logo-track">
        {repeated.map((tech, index) => (
          <span key={`${tech}-${index}`} className="logo-token">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ item }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded bg-white/[0.12] p-4 text-white ring-1 ring-white/20">
      <item.icon className="mb-3 text-teal-200" size={24} />
      <p className="text-xl font-black">{item.value}</p>
      <p className="mt-1 text-xs font-semibold uppercase text-slate-200">{item.label}</p>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-wide text-accent">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">{title}</h1>
    </div>
  );
}

function InfoBlock({ title, items }) {
  return (
    <div className="rounded border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <p key={item} className="flex gap-3 leading-7 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="mt-1 shrink-0 text-accent" size={18} />
            <span>{item}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function ProjectList({ title, items }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p key={item} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="mt-1 shrink-0 text-accent" size={16} />
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function ContactLink({ icon: Icon, label, value, href }) {
  return (
    <a className="flex items-center justify-between gap-4 rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5" href={href}>
      <span className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded bg-accent/10 text-accent">
          <Icon size={22} />
        </span>
        <span>
          <span className="block text-sm font-bold text-slate-500 dark:text-slate-400">{label}</span>
          <span className="block font-bold">{value}</span>
        </span>
      </span>
      <ExternalLink size={18} />
    </a>
  );
}

function TextInput({ label, value, onChange, type = 'text', required = false }) {
  const id = useMemo(() => label.toLowerCase().replaceAll(' ', '-'), [label]);
  return (
    <label className="grid gap-2 text-sm font-semibold" htmlFor={id}>
      {label}
      <input id={id} className="input" type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function DashboardMetric({ label, value }) {
  return (
    <div className="rounded border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function Toast({ type, message }) {
  return (
    <div
      className={cls(
        'mt-5 rounded border px-4 py-3 text-sm font-bold',
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
          : 'border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200'
      )}
    >
      {message}
    </div>
  );
}

function Spinner() {
  return <span className="spinner" aria-hidden="true" />;
}

function IconButton({ label, onClick, children }) {
  return (
    <button className="icon-button" type="button" onClick={onClick} aria-label={label} title={label}>
      {children}
    </button>
  );
}

function IconLink({ label, href, children }) {
  return (
    <a className="icon-button" href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
      {children}
    </a>
  );
}

function WhatsAppButton() {
  if (!profile.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${profile.whatsapp}`}
      className="fixed bottom-5 right-5 z-30 grid h-12 w-12 place-items-center rounded-full bg-[#128c7e] text-white shadow-enterprise transition hover:scale-105"
      aria-label="WhatsApp"
      title="WhatsApp"
      target="_blank"
      rel="noreferrer"
    >
      <Phone size={22} />
    </a>
  );
}

function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white py-8 dark:border-white/10 dark:bg-[#101418]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Naveen Nadimpalli. Java Full Stack Developer.</p>
        <div className="flex gap-3">
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="font-semibold hover:text-accent">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default App;
