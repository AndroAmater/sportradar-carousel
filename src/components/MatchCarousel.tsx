import * as React from "react"
import './MatchCarousel.css';

import { useDispatch } from 'react-redux'
import { fetchMatches } from '../store/matches'
import { useSelector } from 'react-redux'

import { RootState, AppDispatch } from '../store/store'

import Card from './Card.tsx'
import CarouselDot from "./CarouselDot.tsx";

import { Sport, Match } from '../store/matches'


export default function MatchCarousel({ sportId = null, max = 10 }) {
  console.count("Render: ")

  const dispatch: AppDispatch = useDispatch()

  const matches = useSelector((state: RootState) => state.matches)

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

  const carousel = React.useRef<HTMLDivElement>()

  const {sport, slides} = React.useMemo(() => {
    let sport: Sport
    let slides: React.RefObject<HTMLDivElement>[]

    if (sportId === null && Object.keys(matches).length > 0) {
      sport = { 
        id: "0",
        name: "All Sports",
        // TODO: Optimize this
        matches: Object.values(matches.data).reduce((matches: { [key: string]: Match }, currentSport: Sport) => { 
          Object.values(currentSport.matches).reduce((matches: { [key: string]: Match }, match: Match) => {
            if (Object.keys(matches).length < max) {
              matches[match.id] = match
            }
            return matches
          }, matches)
          return matches
        }, {}) 
      }
      slides = Object.keys(sport.matches).map(() => React.createRef())

    } else if (matches.data[sportId]) {
      sport = matches.data[sportId]
      slides = Object.keys(sport.matches).map(() => React.createRef())

    } else {
      sport = null
      slides = []
    }

    return {sport, slides}
  }, [matches, sportId, max])

  const intervalChangeSlide = React.useCallback((index: number) => {
    const card = slides[index]?.current
    carousel.current.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth'
    })
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
  }, [sportId, matches, max])

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
      left: slides[index].current.offsetLeft,
      behavior: 'smooth'
    })
    scrollStates.current.autoScrolling = true
    scrollStates.current.currentSlide = index
    resetInterval()
  }, [carousel, resetInterval, scrollStates, slides])

  React.useEffect(() => {
    if (!sport) return
    // Add intersection observer to handle dot changes
    const observer = new IntersectionObserver((entries) => {
      if (scrollStates.current.autoScrolling) return
      scrollStates.current.currentSlide = parseInt(entries[0].target.getAttribute('data-index'))
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

  // TODO: Replace with suspense
  if (!sport) return null

  return (
    <div 
      className="carousel-container"
      onMouseEnter={() => clearInterval(scrollStates.current.scrollInterval)}
      onMouseLeave={() => resetInterval()}
    >
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
                    ref={slides[index]}
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
              <CarouselDot
                key={index}
                index={index}
                active={scrollStates.current.currentSlide === index}
                onClick={() => dotChangeSlide(index)}
              />
            ))
        }
      </div>
    </div>
  );
}
