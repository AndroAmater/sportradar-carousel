import * as React from "react"
import './MatchCarousel.css';

import { useDispatch } from 'react-redux'
import { fetchMatches } from '../store/matches'
import { useSelector } from 'react-redux'

import { RootState, AppDispatch } from '../store/store'

import Card from './Card.tsx'
import Skull from "./icons/Skull.tsx"
import Spinner from "./icons/Spinner.tsx"

import { Sport } from '../store/matches'


export default function MatchCarousel({ 
  sportId = null, 
  max = 10,
  logRenderCount = false
}) {
  if (logRenderCount) {
    console.count("Render: ")
  }

  const dispatch: AppDispatch = useDispatch()

  const sportsData = useSelector((state: RootState) => state.matches)

  const scrollStates = React.useRef<{
    autoScrolling: boolean,
    scrollEndTimer: NodeJS.Timeout|null,
    scrollInterval: NodeJS.Timer|null,
    currentSlide: number
  }>({
    autoScrolling: false,
    scrollEndTimer: null,
    scrollInterval: null,
    currentSlide: 0
  })

  const carousel = React.useRef<HTMLDivElement|null>(null)

  const {sport, slides} = React.useMemo<{
    sport: Sport|null,
    slides: {
      card: React.RefObject<HTMLDivElement>, 
      dot: React.RefObject<HTMLButtonElement>
    }[]
  }>(() => {
    let sport: Sport
    let slides: {
      card: React.RefObject<HTMLDivElement>, 
      dot: React.RefObject<HTMLButtonElement>
    }[]

    const sports = Object.values(sportsData.data)

    if (sportId === null && sports.length > 0) {
      const data = []
      for (let i = 0; i < sports.length; i++) {
        if (data.length === max) break
        for (let k = 0; k < sports[i].matches.length; k++) {
          if (data.length === max) break
          data.push(sports[i].matches[k])
        }
      }
      sport = { 
        id: "0",
        name: "All Sports",
        matches: data 
      }
      slides = Object.keys(sport.matches).map(() => ({ 
        card: React.createRef(),
        dot: React.createRef() 
      }))

    } else if (sportsData.data[sportId]) {
      sport = {
        id: sportsData.data[sportId].id,
        name: sportsData.data[sportId].name,
        matches: sportsData.data[sportId].matches.slice(0, max)
      }
      slides = Object.keys(sport.matches).map(() => ({ 
        card: React.createRef(),
        dot: React.createRef() 
      }))

    } else {
      sport = null
      slides = []
    }

    scrollStates.current.currentSlide = 0

    return {sport, slides}
  }, [sportsData, sportId, max])

  const intervalChangeSlide = React.useCallback((index: number) => {
    if (!carousel.current) return
    const card = slides[index]?.card.current
    const dot = slides[index]?.dot.current
    if (!card || !dot) return
    carousel.current.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth'
    })
    dot.setAttribute("data-active", "")
    if (slides.length > 1) {
      if (index === 0) {
        slides[slides.length - 1]?.dot.current.removeAttribute("data-active")
      } else {
        slides[index - 1]?.dot.current.removeAttribute("data-active")
      }
    }
    scrollStates.current.autoScrolling = true
    scrollStates.current.currentSlide = index
  }, [carousel, scrollStates, slides])

  const resetInterval = React.useCallback(() => {
    clearInterval(scrollStates.current.scrollInterval)
    scrollStates.current.scrollInterval = setInterval(() => {
      if (scrollStates.current.currentSlide < slides.length - 1) {
        scrollStates.current.currentSlide = scrollStates.current.currentSlide + 1
        intervalChangeSlide(scrollStates.current.currentSlide)
      } else {
        scrollStates.current.currentSlide = 0
        intervalChangeSlide(0)
      }
    }, 3000)
  }, [scrollStates, slides, intervalChangeSlide])

  React.useEffect(() => {
    resetInterval()
  }, [sportId, sportsData, max])

  // Dispatch fetchMatches on mount
  React.useEffect(() => {
    const fetchData = async () => {
        await dispatch(fetchMatches())
    }
    fetchData()
  }, [])


  // Handle scroll events
  const handleScroll = React.useCallback(() => {
      clearInterval(scrollStates.current.scrollInterval)
      clearTimeout(scrollStates.current.scrollEndTimer)
      scrollStates.current.scrollEndTimer = setTimeout(() => {
        scrollStates.current.autoScrolling = false
        resetInterval()
      }, 100)
  }, [scrollStates, resetInterval])

  const dotChangeSlide = React.useCallback((index: number) => {
    carousel.current.scrollTo({
      left: slides[index].card.current.offsetLeft,
      behavior: 'smooth'
    })
    slides[scrollStates.current.currentSlide]?.dot.current.removeAttribute("data-active")
    slides[index].dot.current.setAttribute('data-active', '')
    scrollStates.current.autoScrolling = true
    scrollStates.current.currentSlide = index
    resetInterval()
  }, [carousel, resetInterval, scrollStates, slides])

  React.useEffect(() => {
    if (!sport || !carousel.current) return
    // Add intersection observer to handle dot changes
    const observer = new IntersectionObserver((entries) => {
      if (scrollStates.current.autoScrolling) return
      const index = parseInt(entries[0].target.getAttribute('data-index'))
      slides[scrollStates.current.currentSlide]?.dot.current.removeAttribute("data-active")
      scrollStates.current.currentSlide = index
      slides[index].dot.current.setAttribute('data-active', '')
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
  }, [slides, sport])

  const carouselItems = React.useMemo(() => {
      if (!sport) return null
      return (
        <>
          <h1 key={sport.id}>{sport.name}</h1>
          <div 
            className="carousel" 
            ref={carousel}
            onScroll={handleScroll}
          >
            {
                slides.map((_, index: number) => {
                    return ( 
                      <Card
                        ref={slides[index].card}
                        match={Object.values(sport.matches)[index]}
                        key={Object.values(sport.matches)[index].id}
                        index={index}
                      />
                    )
                })
            }
          </div>
          <div>
            {
              slides.map((_, index: number) => (
                <button 
                  key={index}
                  ref={slides[index].dot}
                  onClick={() => dotChangeSlide(index)}
                  data-index={index}
                  data-active={index === 0 ? '' : null}
                  className="carousel__page-indicator"
                />
              ))
            }
          </div>
        </>
      )
  }, [sport, slides, handleScroll, dotChangeSlide])

  const loadingState = React.useMemo(() => {
      return (
      <>
        <div className="carousel carousel--loading">
          <div className="carousel__loading-message-container">
            <Spinner />
            <h1>Loading ...</h1>
          </div>
        </div>
      </>
      )
  }, [])

  const errorState = React.useMemo(() => {
    return (
      <>
        <div className="carousel carousel--error">
          <div className="carousel__error-message-container">
            <Skull />
            <h1>There was an error when loading match data.<br/>Please refresh the page or try again later.</h1>
          </div>
        </div>
      </>
    )
  }, [])

  let carouselBody: JSX.Element
  if (sportsData.error) {
    carouselBody = errorState
  } else if (sportsData.loading || !sportsData.loaded || !sport) {
    carouselBody = loadingState
  } else {
    carouselBody = carouselItems
  }

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => clearInterval(scrollStates.current.scrollInterval)}
      onMouseLeave={() => resetInterval()}
    >
      {carouselBody}
    </div>
  );
}
