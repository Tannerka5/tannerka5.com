import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { FC } from "react";
import ThemeToggle from './ThemeToggle';

interface NavProps {
  currentPath?: string;
}

const Navigation: FC<NavProps> = ({ currentPath = "/" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" }, // Fixed: added label property
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white dark:bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg dark:shadow-accent/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-display font-bold text-earth dark:text-gray-100 dark:text-gray-100 dark:text-white"
          >
            Tanner Atkinson<span className="text-accent">.</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                  currentPath === link.href
                    ? "text-primary dark:text-accent-light"
                    : "text-earth dark:text-gray-100/70 dark:text-gray-300 dark:text-gray-300 hover:text-primary dark:hover:text-accent-light"
                }`}
              >
                {link.label}
                {currentPath === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors duration-200"
            >
              Let's Talk
            </motion.a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-earth dark:text-gray-100 dark:text-gray-100 dark:text-white p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? "auto" : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`block text-base font-medium ${
                  currentPath === link.href
                    ? "text-primary dark:text-accent-light"
                    : "text-earth dark:text-gray-100/70 dark:text-gray-300 dark:text-gray-300 hover:text-primary dark:hover:text-accent-light"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="block w-full px-5 py-2 bg-accent text-white text-center rounded-full font-medium hover:bg-accent-dark transition-colors duration-200"
            >
              Let's Talk
            </a>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
