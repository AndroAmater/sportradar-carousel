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
  const [slides, setSlides] = React.useState([])
  const scrollInterval = React.useRef(null)

  // Dispatch fetchMatches on mount
  React.useEffect(() => {
    const fetchData = async () => {
        await dispatch(fetchMatches())
    }
    fetchData()
  }, [dispatch])

  // Set sport and slideIds when matches.data changes
  React.useEffect(() => {
    if (sportId === null && Object.keys(matches).length > 0) {
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
      resetInterval()
      setSlideIds([])
      setSlides([])
    }
  }, [setSport, setSlideIds, matches, sportId, max])

  // Handle scroll events
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
    if (!sport) return
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
    carousel.current.scrollTo({
      left: slides[slideIdIndex].current.offsetLeft,
      behavior: 'smooth'
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

  React.useEffect(() => {
    setSlides(slideIds.map((_, i: number) => {
      return slides[i] ?? React.createRef()
    }))
  }, [slideIds])

  if (!sport) return null

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => {
        clearInterval(scrollInterval.current)
        console.log('test')
      }}
      onMouseLeave={() => resetInterval()}
    >
      <h1 key={sport.id}>{sport.name}</h1>
      <div 
        className="carousel" 
        ref={carousel}
        onScroll={handleScroll}
      >
        {
            slideIds.map((slideId: any, index: number) => {
                return ( 
                  <Card
                    ref={slides[index]}
                    match={sport.matches[slideId]}
                    key={sport.matches[slideId].id}
                    index={index}
                  />
                )
            })
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
