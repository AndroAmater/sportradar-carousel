import * as React from "react"
import './MatchCarousel.css';
import Card from './Card.tsx'

function changeSlide(matchId: string) {
  // TODO: Cache this
  (document.getElementById(`match-id-${matchId}`) as HTMLElement).scrollIntoView({
    block: "nearest",
    inline: "nearest",
    behavior: "smooth"
  })
}

export default function MatchCarousel({ sport }) {
  return (
    <div className="carousel-container">
      <h1 key={sport.id}>{sport.name}</h1>
      <div className="carousel">
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
                className="carousel__page-indicator"
              ></button>
            ))
        }
      </div>
    </div>
  );
}
