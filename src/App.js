import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPageView from './Components/LandingPage/LandingPageView';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPageView />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}

export default App;
