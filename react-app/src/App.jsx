import { useEffect } from 'react';
import markup from './prototype/markup.html?raw';
import initPrototype from './prototype/prototype.js';

// The prototype script binds document-level listeners, so it must run only once.
let started = false;

export default function App() {
  useEffect(() => {
    if (started) return;
    started = true;
    initPrototype();
  }, []);

  return <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />;
}
