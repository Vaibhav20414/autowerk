import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CaseStudies from './components/CaseStudies';
import Philosophy from './components/Philosophy';
import Protocol from './components/Protocol';
import GetStarted from './components/GetStarted';
import Footer from './components/Footer';
import CaseStudyPage from './components/CaseStudyPage';

function NoiseOverlay() {
  return (
    <svg className="noise-overlay" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const prev = useRef({ pathname: null, key: null });

  useEffect(() => {
    const inPageNav = prev.current.pathname === pathname && prev.current.key !== key;
    prev.current = { pathname, key };
    const behavior = inPageNav ? 'smooth' : 'instant';

    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView({ behavior });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }, [pathname, hash, key]);

  return null;
}

function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CaseStudies />
      <Philosophy />
      <Protocol />
      <GetStarted />
    </>
  );
}

export default function App() {
  return (
    <>
      <NoiseOverlay />
      <ScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="*" element={<CaseStudyPage />} />
      </Routes>
      <Footer />
    </>
  );
}
