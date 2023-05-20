import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'
import MatchCarousel from './components/MatchCarousel.tsx';

function App() {
  const [sports, setSports] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    return (async () => {
      try {
        setIsLoading(true)
        let res = await axios.get('https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074')
        setSports(res.data.doc[0].data)
        console.log(res.data.doc[0].data)
      } catch (error) {
        setIsError(true)
      }
    })
  }, [])

  return (
    <div className="App">
      {sports.map(sport => 
          MatchCarousel(sport)
      )}
    </div>
  );
}

export default App;
