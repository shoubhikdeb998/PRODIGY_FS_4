import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ A wrapper component to use useEffect safely
function RootWithAOS() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootWithAOS />);
