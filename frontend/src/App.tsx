import React from 'react';
import logo from './logo.svg';
import './App.css';

import LandingPage from './components/LandingPage';
import { PageViewer } from './PageViewer'

function App() {
  const handleStart = () => {
    console.log('button clicked!')
  }

  // return (<div>
  //   <PageViewer/>
  //   <button onClick={async () => {
  //     const res = await fetch('http://localhost:3000/documents?pageNum=1')
  //     const blob = await res.blob()
  //     const url = URL.createObjectURL(blob)
  //     window.open(url)
  //   }}>Test Download</button>
  // </div>)
  return <PageViewer/>
  // return <LandingPage/>
  // return <LandingPage onStart={handleStart} />
}

export default App;
