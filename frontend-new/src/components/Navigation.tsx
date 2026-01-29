import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback } from "react";
import type { FC } from "react";
import ThemeToggle from './ThemeToggle';
import { apiClient } from '../lib/api';

interface NavProps {
  currentPath?: string;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

const Navigation: FC<NavProps> = ({ currentPath = "/" }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Normalize path for comparison (remove trailing slash except for root)
  const normalizePath = useCallback((path: string) => {
    return path === '/' ? '/' : path.replace(/\/$/, '');
  }, []);

  const normalizedCurrentPath = useMemo(() => normalizePath(currentPath), [currentPath, normalizePath]);

  // Check authentication status
  const checkAuth = useCallback(() => {
    const token = apiClient.getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_token') {
        checkAuth();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically (in case of same-tab login/logout)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [checkAuth]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(() => NAV_LINKS, []);
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    apiClient.logout();
    setIsAuthenticated(false);
    if (normalizedCurrentPath?.startsWith('/admin')) {
      // Use href to ensure proper navigation (ViewTransitions disabled on admin pages)
      window.location.href = '/';
    }
  }, [normalizedCurrentPath]);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Skip initial animation on first mount to prevent lag
    const timer = setTimeout(() => setHasMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.nav
        initial={hasMounted ? { y: -100 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-display font-bold text-earth dark:text-white"
            >
              Tanner Atkinson<span className="text-accent">.</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const normalizedLinkHref = normalizePath(link.href);
                const isActive = normalizedCurrentPath === normalizedLinkHref;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary dark:text-accent-light"
                        : "text-earth/70 dark:text-gray-300 hover:text-primary dark:hover:text-accent-light"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
              {isAuthenticated && (
                <motion.a
                  href="/admin"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    normalizedCurrentPath === '/admin'
                      ? "text-primary dark:text-accent-light"
                      : "text-earth/70 dark:text-gray-300 hover:text-primary dark:hover:text-accent-light"
                  }`}
                >
                  Admin
                  {normalizedCurrentPath === '/admin' && (
                    <motion.div
                      layoutId="activeNavAdmin"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              )}
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-accent text-white rounded-full font-medium hover:bg-accent-dark transition-colors duration-200"
              >
                Let's Talk
              </motion.a>
              {isAuthenticated ? (
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-earth dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Logout
                </motion.button>
              ) : (
                <motion.a
                  href="/admin/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-earth dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Login
                </motion.a>
              )}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button + Theme Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={toggleMobileMenu}
                className="text-earth dark:text-white p-2"
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
        </div>
      </motion.nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
          pointerEvents: isMobileMenuOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 md:hidden bg-cream dark:bg-gray-900"
      >
        <div className="flex flex-col h-full pt-20 px-6">
          {/* Navigation Links */}
          <motion.div
            initial={false}
            animate={{
              y: isMobileMenuOpen ? 0 : -20,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center space-y-6"
          >
            {navLinks.map((link, index) => {
              const normalizedLinkHref = normalizePath(link.href);
              const isActive = normalizedCurrentPath === normalizedLinkHref;
              const handleClick = normalizedCurrentPath?.startsWith('/admin')
                ? (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = link.href;
                  }
                : undefined;
              
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={handleClick}
                  initial={false}
                  animate={{
                    x: isMobileMenuOpen ? 0 : -20,
                    opacity: isMobileMenuOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className={`text-2xl font-medium ${
                    isActive
                      ? "text-primary dark:text-accent-light"
                      : "text-earth dark:text-gray-200 hover:text-primary dark:hover:text-accent-light"
                  }`}
                >
                  {link.label}
                </motion.a>
              );
            })}
            
            {isAuthenticated && (
              <motion.a
                href="/admin"
                initial={false}
                animate={{
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className={`text-2xl font-medium ${
                  normalizedCurrentPath === '/admin'
                    ? "text-primary dark:text-accent-light"
                    : "text-earth dark:text-gray-200 hover:text-primary dark:hover:text-accent-light"
                }`}
              >
                Admin
              </motion.a>
            )}
            
            <motion.a
              href="/contact"
              initial={false}
              animate={{
                x: isMobileMenuOpen ? 0 : -20,
                opacity: isMobileMenuOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="w-full px-6 py-4 mt-4 bg-accent text-white text-center rounded-full font-semibold text-lg hover:bg-accent-dark transition-colors duration-200"
            >
              Let's Talk
            </motion.a>
            
            {isAuthenticated ? (
              <motion.button
                onClick={handleLogout}
                initial={false}
                animate={{
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="w-full px-6 py-4 mt-4 bg-gray-200 dark:bg-gray-700 text-earth dark:text-gray-200 text-center rounded-full font-semibold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Logout
              </motion.button>
            ) : (
              <motion.a
                href="/admin/login"
                initial={false}
                animate={{
                  x: isMobileMenuOpen ? 0 : -20,
                  opacity: isMobileMenuOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: 0.45 }}
                className="w-full px-6 py-4 mt-4 bg-gray-200 dark:bg-gray-700 text-earth dark:text-gray-200 text-center rounded-full font-semibold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Login
              </motion.a>
            )}
          </motion.div>

          {/* Full-Stack Developer tagline at bottom */}
          <motion.p
            initial={false}
            animate={{
              y: isMobileMenuOpen ? 0 : 20,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="pb-8 text-center text-earth/70 dark:text-gray-400"
          >
            Full-Stack Developer building scalable web applications with cloud infrastructure, database design, and modern frameworks.
          </motion.p>
        </div>
      </motion.div>
    </>
  );
};

export default Navigation;
