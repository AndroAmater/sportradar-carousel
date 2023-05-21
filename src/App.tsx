import * as React from 'react'
import './App.css';
import MatchCarousel from './components/MatchCarousel';

function App() {
  return (
    <div className="App">
        <MatchCarousel 
          max={15}
        />
        <MatchCarousel
          sportId={1}
        />
        <MatchCarousel
          sportId={2}
        />
    </div>
  );
}

export default App;
