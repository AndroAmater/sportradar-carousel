import * as React from 'react'
import './App.css';
import { useEffect } from 'react'
import MatchCarousel from './components/MatchCarousel';
import { useDispatch } from 'react-redux'
import { fetchMatches } from './store/matches'
import { useSelector } from 'react-redux'
import { RootState, AppDispatch } from './store/store'

function App() {
  const dispatch: AppDispatch = useDispatch()
  const matches = useSelector((state: RootState) => state.matches)

  useEffect(() => {
    const fetchData = async () => {
        await dispatch(fetchMatches())
    }
    fetchData()
  }, [dispatch])

  return (
    <div className="App">
      {
        Object.values(matches.data).map((sport: any) => (
          <MatchCarousel 
            sport={sport} 
            key={sport.id}
          />
        ))
      }
    </div>
  );
}

export default App;
