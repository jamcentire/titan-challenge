import React from 'react';
import logo from './logo.svg';
import './App.css';

import LandingPage from './components/LandingPage';

function App() {
  const handleStart = () => {
    console.log('button clicked!')
  }

  return <LandingPage/>
  // return <LandingPage onStart={handleStart} />
}

export default App;
