import * as React from "react"
import './Card.css';

import { Match } from '../store/matches'

var countryCodes = [
  'us', // United States
  'ca', // Canada
  'mx', // Mexico
  'gb', // United Kingdom
  'fr', // France
  'de', // Germany
  'it', // Italy
  'es', // Spain
  'nl', // Netherlands
  'se', // Sweden
  'no', // Norway
  'fi', // Finland
  'dk', // Denmark
  'ru', // Russia
  'cn', // China
  'jp', // Japan
  'kr', // South Korea
  'in', // India
  'pk', // Pakistan
  'bd', // Bangladesh
  'id', // Indonesia
  'ph', // Philippines
  'vn', // Vietnam
  'br', // Brazil
  'ar', // Argentina
  'co', // Colombia
  'pe', // Peru
  'za', // South Africa
  'ng', // Nigeria
  'eg', // Egypt
  'sa', // Saudi Arabia
  'ae', // United Arab Emirates
  'il', // Israel
  'tr', // Turkey
  'gr', // Greece
  'pt', // Portugal
  'au', // Australia
  'nz', // New Zealand
  'sg', // Singapore
  'my', // Malaysia
  'th', // Thailand
  'kh', // Cambodia
  'ke', // Kenya
  'et', // Ethiopia
  'gh', // Ghana
  'ua', // Ukraine
  'pl', // Poland
  'at', // Austria
  'ch', // Switzerland
  'be', // Belgium
];

function getMatchStatus(match: Match) {
  if (match.statusId === 100) {
    return 'postmatch'
  } else if (match.statusId === 0) {
    return 'prematch'
  } else {
    return 'live'
  }
}

interface CardProps {
  match: Match,
  index: number,
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ 
  match, 
  index = null, 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={ `card card--status-${getMatchStatus(match)}` }
      id={ `match-id-${ match.id }` }
      key={ `match-id-${ match.id }` }
      data-index={ index }
    >
      <span className="card__titles-container">
        <span className="card__title">{`${match.tournamentName} - ${match.tournamentSeasonTypeName}`}</span>
        <span className="card__subtitle">{match.categoryName}</span>
      </span>
      <div className="card__center-container">
        <div className="card__country">
          <img 
            className="card__country-flag" 
            src={`https://flagcdn.com/w160/${countryCodes[parseInt(match.homeTeamUid) % 50]}.webp`} 
            alt={match.homeTeamName} 
          />
          <span className="card__country-name">{ match.homeTeamName }</span>
          <span className="card__country-medium-name">{ match.homeTeamMediumName }</span>
          <span className="card__country-short-name">{ match.homeTeamShortName }</span>
        </div>
        {
          getMatchStatus(match) === 'prematch' ?
            (
              <div className="card__vs card__vs--prematch">
                <span className="card__vs-title">VS</span>
                <span className="card__vs-time">{match.time}</span>
                <span className="card__vs-date">{match.date}</span>
              </div>
            ) :
            (
              <div className={ `card__vs card__vs--${getMatchStatus(match)}` }>
                <span>{match.homeTeamResult}</span>
                <span className="card__vs-separator">:</span>
                <span>{match.awayTeamResult}</span>
              </div>
            )
        }
        <div className="card__country">
          <img 
            className="card__country-flag" 
            src={`https://flagcdn.com/w160/${countryCodes[parseInt(match.awayTeamUid) % 50]}.webp`} 
            alt={match.awayTeamName}
          />
          <span className="card__country-name">{ match.awayTeamName }</span>
          <span className="card__country-medium-name">{ match.awayTeamMediumName }</span>
          <span className="card__country-short-name">{ match.awayTeamShortName }</span>
        </div>
      </div>
      <p className={ `card__status card__status--${getMatchStatus(match)}`}>{ match.statusName }</p>
    </div>
  );
})

export default Card;
