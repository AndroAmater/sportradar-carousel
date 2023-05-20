import React from "react"
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

export default function MatchCarousel(sport: any) {
  return (
    <div className="carousel-container">
      <h1 key={sport._id}>{sport.name}</h1>
      <div className="carousel">
        {
          sport.realcategories.flatMap((category: any) => 
            category.tournaments.flatMap((tournament: any) => 
                tournament.matches.map((match: any) => Card(match, tournament))
            )
          )
        }
      </div>
      <div>
        {sport.realcategories.map((category: any) => {
          return category.tournaments.map((tournament: any) => {
            return tournament.matches.map((match: any) => (
              <button 
                onClick={() => changeSlide(match._id)}
                className="carousel__page-indicator"
              ></button>
            ))
          })
        })}
      </div>
    </div>
  );
}
