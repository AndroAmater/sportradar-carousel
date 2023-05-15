import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

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

function getMatchStatus(match) {
  if (match.status._id === 100) {
    return 'postmatch'
  } else if (match.status._id === 0) {
    return 'prematch'
  } else {
    return 'live'
  }
}

function App() {
  const [sports, setSports] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    return (async () => {
      try {
        setIsLoading(true)
        let res = await axios.get('https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074')
        setSports(res.data.doc[0].data)
        console.log(res.data.doc[0].data)
      } catch (error) {
        setIsError(true)
      }
    })
  }, [])

  return (
    <div className="App">
      {sports.map(sport => 
        (
          <>
            <h1 key={sport._id}>{sport.name}</h1>
            {sport.realcategories.map(category => (
              <>
                <h2>{category.name}</h2>
                {category.tournaments.map(tournament => (
                  <>
                    <h3>{tournament.name}</h3>
                    <strong>{tournament.seasontypename}</strong>
                    {tournament.matches.map(match => (
                      <div className={ `card card--status-${getMatchStatus(match)}` }>
                        <span className="card__titles-container">
                          <span className="card__title">{tournament.name}</span>
                          <span className="card__subtitle">{tournament.seasontypename}</span>
                        </span>
                        <div className="card__center-container">
                          <div className="card__country">
                            <img className="card__country-flag" src={`https://flagcdn.com/w160/${countryCodes[match.teams.home.uid%50]}.webp`} alt={match.teams.home.name} />
                            <span className="card__country-name">{ match.teams.home.name }</span>
                          </div>
                          {
                            getMatchStatus(match) === 'prematch' ?
                              (
                                <div className="card__vs card__vs--prematch">
                                  <span className="card__vs-title">VS</span>
                                  <span className="card__vs-time">{match._dt.time}</span>
                                  <span className="card__vs-date">{match._dt.date}</span>
                                </div>
                              ) :
                              (
                                <div className={ `card__vs card__vs--${getMatchStatus(match)}` }>
                                  <span>{match.result.home}</span>
                                  <span className="card__vs-separator">:</span>
                                  <span>{match.result.away}</span>
                                </div>
                              )
                          }
                          <div className="card__country">
                            <img className="card__country-flag" src={`https://flagcdn.com/w160/${countryCodes[match.teams.away.uid%50]}.webp`} alt={match.teams.away.name}></img>
                            <span className="card__country-name">{ match.teams.away.name }</span>
                          </div>
                        </div>
                        <p className={ `card__status card__status--${getMatchStatus(match)}`}>{ match.status.name }</p>
                      </div>
                    ))}
                  </>
                ))}
              </>
            ))}
          </>
        ) 
      )}
    </div>
  );
}

export default App;
