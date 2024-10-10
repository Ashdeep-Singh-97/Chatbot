import React, {  } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import Landing from './pages/landing';
import BouncingBall from './components/BouncingBall';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BouncingBall />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </Router>
  );
};

export default App;
