import * as React from "react"
import './MatchCarousel.css';
import Card from './Card.tsx'


export default function MatchCarousel({ sport }) {
  const autoScrolling = React.useRef(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const carousel = React.useRef(null)
  const scrollEndTimer = React.useRef(null)
  const [slideIds, setSlideIds] = React.useState([])
  const scrollInterval = React.useRef(null)

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
    // Add intersection observer to handle dot changes
    const observer = new IntersectionObserver((entries) => {
      if (autoScrolling.current) return
      setCurrentSlide(parseInt(entries[0].target.getAttribute('data-index')))
      console.log(parseInt(entries[0].target.getAttribute('data-index')))
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
  }, [slideIds.length])

  React.useEffect(() => {
    setSlideIds(Object.keys(sport.matches))
  }, [sport])

  React.useEffect(() => {
    resetInterval()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIds.length])


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
