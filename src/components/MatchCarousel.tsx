import * as React from "react"
import './MatchCarousel.css';
import Card from './Card.tsx'


export default function MatchCarousel({ sport }) {
  const autoScrolling = React.useRef(false)
  const [currentSlide, setCurrentSlide] = React.useState(null)
  const carousel = React.useRef(null)
  const scrollEndTimer = React.useRef(null)

  function handleScroll() {
      clearTimeout(scrollEndTimer.current)
      scrollEndTimer.current = setTimeout(() => {
        autoScrolling.current = false
      }, 100)
  }

  // Run when the component is rendered for the first time
  React.useEffect(() => {
    // Set default slide
    const matchIds = Object.keys(sport.matches)
    if (matchIds.length > 0) {
      setCurrentSlide(matchIds[0])
    }

    // Add intersection observer to handle dot changes
    const observer = new IntersectionObserver((entries) => {
      if (autoScrolling.current) return
      setCurrentSlide(entries[0].target.id.split('-')[2])
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function changeSlide(matchId: string) {
    // TODO: Cache this
    (document.getElementById(`match-id-${matchId}`) as HTMLElement).scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth"
    })
    autoScrolling.current = true
    setCurrentSlide(matchId)
  }

  return (
    <div className="carousel-container">
      <h1 key={sport.id}>{sport.name}</h1>
      <div 
        className="carousel" 
        ref={carousel}
        onScroll={handleScroll}
      >
        {
            Object.values(sport.matches).map((match: any) => ( 
              <Card
                match={match}
                key={match.id}
              />
            ))
        }
      </div>
      <div>
        {
            Object.values(sport.matches).map((match: any) => (
              <button 
                key={match.id}
                onClick={() => changeSlide(match.id)}
                className={ `carousel__page-indicator${ String(currentSlide) === String(match.id) ? ' carousel__page-indicator--active': '' }` }
              ></button>
            ))
        }
      </div>
    </div>
  );
}
