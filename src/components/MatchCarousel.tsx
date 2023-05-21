import * as React from "react"
import './MatchCarousel.css';
import Card from './Card.tsx'
import { useDispatch } from 'react-redux'
import { fetchMatches } from '../store/matches'
import { useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'


export default function MatchCarousel({ sportId = null, max = 10 }) {
  const dispatch: AppDispatch = useDispatch()
  const matches = useSelector((state: RootState) => state.matches)
  const [sport, setSport] = React.useState(null)
  const autoScrolling = React.useRef(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef(null)
  const scrollEndTimer = React.useRef(null)
  const [slideIds, setSlideIds] = React.useState([])
  const scrollInterval = React.useRef(null)

  React.useEffect(() => {
    const fetchData = async () => {
        await dispatch(fetchMatches())
    }
    fetchData()
  }, [dispatch])

  React.useEffect(() => {
    if (sportId === null) {
      const allMatches = { 
        id: 0,
        name: "All Sports",
        // TODO: Improve interfaces
        matches: Object.values(matches.data).reduce((matches: any, currentSport: any) => { 
          // TODO: Optimize this
          matches = { ...matches, ...currentSport.matches}
          return matches
        }, {}) 
      }
      setSport(allMatches)
      setSlideIds(Object.keys(allMatches.matches).slice(0, max - 1))
    } else if (matches.data[sportId]) {
      setSport(matches.data[sportId])
      setSlideIds(Object.keys(matches.data[sportId].matches).slice(0, max - 1))
    } else {
      setSport(null)
      setSlideIds([])
    }
  }, [setSport, setSlideIds, matches, sportId, max])

  function handleScroll() {
      clearInterval(scrollInterval.current)
      clearTimeout(scrollEndTimer.current)
      scrollEndTimer.current = setTimeout(() => {
        autoScrolling.current = false
        resetInterval()
      }, 100)
  }

  function intervalChangeSlide (slideIdIndex: number) {
    const matchId = sport.matches[slideIds[slideIdIndex]].id
    // TODO: Cache this
    const card = document.getElementById(`match-id-${matchId}`)
    carousel.current.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth'
    })
    autoScrolling.current = true
    setCurrentSlide(slideIdIndex)
  }

  function resetInterval() {
    clearInterval(scrollInterval.current)
    scrollInterval.current = setInterval(() => {
      setCurrentSlide(prevSlide => {
        if (prevSlide < slideIds.length - 1) {
          intervalChangeSlide(prevSlide + 1)
          return prevSlide + 1
        } else {
          intervalChangeSlide(0)
          return 0
        }
      })
    }, 3000)
  }

  function dotChangeSlide(slideIdIndex: number) {
    const matchId = sport.matches[slideIds[slideIdIndex]].id
    // TODO: Cache this
    document.getElementById(`match-id-${matchId}`).scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth"
    })
    autoScrolling.current = true
    setCurrentSlide(slideIdIndex)
    resetInterval()
  }

  // Run when the component is rendered for the first time
  React.useEffect(() => {
    if (!sport) return
    // Add intersection observer to handle dot changes
    const observer = new IntersectionObserver((entries) => {
      if (autoScrolling.current) return
      setCurrentSlide(parseInt(entries[0].target.getAttribute('data-index')))
    }, {
      root: carousel.current,
      rootMargin: '0px',
      threshold: 0.7
    })
    for (let i = 0; i < carousel.current.children.length; i++) {
      observer.observe(carousel.current.children[i])
    }

    // Clean up intersection observer
    return () => {
      observer.disconnect()
    }
  }, [slideIds.length, sport])

  React.useEffect(() => {
    resetInterval()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIds.length])

  if (!sport) return null

  return (
    <div className="carousel-container">
      <h1 key={sport.id}>{sport.name}</h1>
      <div 
        className="carousel" 
        ref={carousel}
        onScroll={handleScroll}
      >
        {
            slideIds.map((slideId: any, index: number) => ( 
              <Card
                match={sport.matches[slideId]}
                key={sport.matches[slideId].id}
                index={index}
                onMouseEnter={() => clearInterval(scrollInterval.current)}
                onMouseLeave={() => resetInterval()}
              />
            ))
        }
      </div>
      <div>
        {
            slideIds.map((slideId: any, index: number) => (
              <button 
                key={sport.matches[slideId].id}
                onClick={() => dotChangeSlide(index)}
                data-index={index}
                className={ `carousel__page-indicator${ String(slideIds[currentSlide]) === String(sport.matches[slideId].id) ? ' carousel__page-indicator--active': '' }` }
              ></button>
            ))
        }
      </div>
    </div>
  );
}
