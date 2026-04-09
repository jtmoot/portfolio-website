import { useState, useCallback } from 'react';
import Portfolio from './components/Portfolio.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import BootSequence from './components/BootSequence.jsx';
import EntranceReveal from './components/EntranceReveal.jsx';

function shouldSkipBoot() {
  if (sessionStorage.getItem('skipBoot') === 'true') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  return false;
}

function App() {
  const [phase, setPhase] = useState(() => shouldSkipBoot() ? 'ready' : 'booting');

  const handleBootComplete = useCallback(() => {
    sessionStorage.setItem('skipBoot', 'true');
    setPhase('revealing');
  }, []);

  const handleRevealComplete = useCallback(() => {
    setPhase('ready');
  }, []);

  return (
    <>
      {phase === 'booting' && (
        <BootSequence onComplete={handleBootComplete} />
      )}
      {phase === 'revealing' && (
        <EntranceReveal onComplete={handleRevealComplete} />
      )}
      <div style={{ visibility: phase === 'ready' ? 'visible' : 'hidden' }}>
        <ThemeToggle />
        <Portfolio ready={phase === 'ready'} />
      </div>
    </>
  );
}

export default App;
