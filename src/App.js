import './App.css';
import axios from 'axios'
import { useState, useEffect } from 'react'

var countryCodes = [
  'US', // United States
  'CA', // Canada
  'MX', // Mexico
  'GB', // United Kingdom
  'FR', // France
  'DE', // Germany
  'IT', // Italy
  'ES', // Spain
  'NL', // Netherlands
  'SE', // Sweden
  'NO', // Norway
  'FI', // Finland
  'DK', // Denmark
  'RU', // Russia
  'CN', // China
  'JP', // Japan
  'KR', // South Korea
  'IN', // India
  'PK', // Pakistan
  'BD', // Bangladesh
  'ID', // Indonesia
  'PH', // Philippines
  'VN', // Vietnam
  'BR', // Brazil
  'AR', // Argentina
  'CO', // Colombia
  'PE', // Peru
  'ZA', // South Africa
  'NG', // Nigeria
  'EG', // Egypt
  'SA', // Saudi Arabia
  'AE', // United Arab Emirates
  'IL', // Israel
  'TR', // Turkey
  'GR', // Greece
  'PT', // Portugal
  'AU', // Australia
  'NZ', // New Zealand
  'SG', // Singapore
  'MY', // Malaysia
  'TH', // Thailand
  'KH', // Cambodia
  'KE', // Kenya
  'ET', // Ethiopia
  'GH', // Ghana
  'UA', // Ukraine
  'PL', // Poland
  'AT', // Austria
  'CH', // Switzerland
  'BE', // Belgium
];

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
                      <>
                        <p>{ match.status.name }</p>
                        <p>{ match.status._id }</p>
                        <p>{ match.teams.home.name }</p>
                        <p>{ match.teams.home.abbr }</p>
                        <p>{ match.teams.home.uid }</p>
                        <img src={`https://flagsapi.com/${countryCodes[match.teams.home.uid%50]}/flat/64.png`} alt={match.teams.home.name}></img>
                        <p>{ match.teams.away.name }</p>
                        <p>{ match.teams.away.abbr }</p>
                        <p>{ match.teams.away.uid }</p>
                        <img src={`https://flagsapi.com/${countryCodes[match.teams.away.uid%50]}/flat/64.png`} alt={match.teams.away.name}></img>
                      </>
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
