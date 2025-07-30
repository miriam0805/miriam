import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StarWarGame from './components/StarWarGame';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StarWarGame />} />
          <Route path="/main" element={<StarWarGame />} />
          <Route path="/chapt" element={<div>Chapter Page</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 