import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import SmoothScroll from './lib/SmoothScroll.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Loader from './components/Loader.jsx';
import { markIntroDone } from './lib/introState.js';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

/**
 * App
 * -------------------------------------------------------------------------
 * Top-level shell: shows the brand Loader once per browser session, then
 * mounts the Lenis smooth-scroll provider around the persistent
 * Navbar/Footer and the routed page content.
 */
const INTRO_KEY = 'srj-intro-seen';

function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(INTRO_KEY, '1');
  } catch {
    // Storage unavailable (e.g. private mode) — the intro just plays again.
  }
}

export default function App() {
  const [loaded, setLoaded] = useState(introSeen);

  useEffect(() => {
    if (loaded) markIntroDone();
  }, [loaded]);

  return (
    <>
      {!loaded && (
        <Loader
          onReveal={markIntroDone}
          onFinish={() => {
            markIntroSeen();
            setLoaded(true);
          }}
        />
      )}
      <SmoothScroll>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </SmoothScroll>
    </>
  );
}
