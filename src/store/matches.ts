import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios'

export interface Match {
    id: string,
    categoryName: string,
    tournamentName: string,
    tournamentSeasonTypeName: string,
    homeTeamUid: string,
    homeTeamName: string,
    homeTeamMediumName: string,
    homeTeamShortName: string,
    homeTeamResult: number,
    awayTeamUid: string,
    awayTeamName: string,
    awayTeamMediumName: string,
    awayTeamShortName: string,
    awayTeamResult: number,
    time: string,
    date: string,
    statusName: string,
    statusId: string
}

export interface Sport {
    name: string,
    id: string,
    matches: Match[]
}

export interface MatchesState {
    data: { [key: string]: Sport },
    loaded: boolean,
    loading: boolean,
    error: boolean
}

interface ServerMatch {
    _id: string,
    name: string,
    teams: {
      home: {
        uid: string,
        name: string,
        mediumname: string,
        abbr: string
      },
      away: {
        uid: string,
        name: string,
        mediumname: string,
        abbr: string
      }
    },
    result: {
      home: number,
      away: number
    },
    _dt: {
      time: string,
      date: string
    },
    status: {
      name: string,
      _id: string
    }
}

interface ServerTournament {
    matches: ServerMatch[],
    name: string,
    seasontypename: string
}

interface ServerCategory {
    tournaments: ServerTournament[],
    name: string
}

interface ServerSport {
    _id: string,
    name: string,
    realcategories: ServerCategory[]
}

interface ServerResponse {
    data: {
        doc: {
            data: ServerSport[]
        }[]
    }
}

export const setLoading = createAction('matches/setLoading', (state: boolean) => ({ payload: state }))
export const handleError = createAction('matches/handleError')

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, thunkApi) => {
    if (
        (thunkApi.getState() as { matches: MatchesState }).matches.loading
        || (thunkApi.getState() as { matches: MatchesState }).matches.loaded
    ) return new Promise((_, reject) => reject('Already loading or loaded'))

    thunkApi.dispatch(setLoading(true))
    let res: ServerSport[]
    try {
      res = (await axios.get('https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074') as ServerResponse).data.doc[0].data
    } catch (error) {
      thunkApi.dispatch(handleError())
      return new Promise((_, reject) => reject(error))
    }
    thunkApi.dispatch(setLoading(false))
    return res
  }
);

const matchesSlice = createSlice<MatchesState, {}, "matches">({
  name: 'matches',
  initialState: {
      data: {},
      loaded: false,
      loading: false,
      error: false
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (_, action) => {
      
      let data: { [key: string]: Sport } = action.payload
        .reduce((output: { [key: string]: Sport }, sport: ServerSport) => {
          output[sport._id] = {
            name: sport.name,
            id: sport._id,
            matches: []
          }
          output[sport._id].matches = sport.realcategories.flatMap((category: ServerCategory) => 
            category.tournaments.flatMap((tournament: ServerTournament) => 
              tournament.matches.flatMap((match: ServerMatch) => ({
                id: match._id,
                categoryName: category.name,
                tournamentName: tournament.name,
                tournamentSeasonTypeName: tournament.seasontypename,
                homeTeamUid: match.teams.home.uid,
                homeTeamName: match.teams.home.name,
                homeTeamMediumName: match.teams.home.mediumname,
                homeTeamShortName: match.teams.home.abbr,
                homeTeamResult: match.result.home,
                awayTeamUid: match.teams.away.uid,
                awayTeamName: match.teams.away.name,
                awayTeamMediumName: match.teams.away.mediumname,
                awayTeamShortName: match.teams.away.abbr,
                awayTeamResult: match.result.away,
                time: match._dt.time,
                date: match._dt.date,
                statusName: match.status.name,
                statusId: match.status._id
              }))
            )
          )
          return output
        }, {} as { [key: string]: Sport })

      return { 
          data,
          loaded: true,
          loading: false,
          error: false
      };
    }).addCase(setLoading, (state, action) => {
        state.loading = action.payload
    }).addCase(handleError, (state) => {
        state.loading = false
        state.error = true
    });
  },
});

export default matchesSlice.reducer;
