import * as React from 'react'
import './App.css';
import MatchCarousel from './components/MatchCarousel';

function App() {
  const [activeTab, setActiveTab] = React.useState(1)

  let content

  if (activeTab === 1) {
    content = (
      <MatchCarousel 
        max={15}
        logRenderCount={true}
      />
    )
  } else {
    content = (
      <>
        <MatchCarousel
          sportId={1}
        />
        <MatchCarousel
          sportId={2}
        />
      </>
    )
  }

  return (
    <div className="App">
      <div className="tab-container">
        <button 
          className={ `tab ${activeTab === 1 ? 'tab--active' : ''}` }
          onClick={() => setActiveTab(1)}
        >Tab 1</button>
        <button 
          className={ `tab ${activeTab === 2 ? 'tab--active' : ''}` }
          onClick={() => setActiveTab(2)}
        >Tab 2</button>
      </div>
      {content}
    </div>
  );
}

export default App;
