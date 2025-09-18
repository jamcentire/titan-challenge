import React from 'react';
import logo from './logo.svg';
import './App.css';

import LandingPage from './components/LandingPage';
import PageViewer from './PageViewer'

function App() {
  const handleStart = () => {
    console.log('button clicked!')
  }

  return <PageViewer/>
  // return <LandingPage/>
  // return <LandingPage onStart={handleStart} />
}

export default App;
