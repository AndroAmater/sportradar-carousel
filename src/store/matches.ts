import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, thunkApi) => {
    // TODO: Is there a nicer way to handle this?
    if (
        (thunkApi.getState() as any).matches.loading
        || (thunkApi.getState() as any).matches.loaded
    ) new Promise((_, reject) => reject())

    // TODO: Imporove interface
    let res = await axios.get('https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074')
    return res.data
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
      data: {},
      loaded: false,
      loading: false
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (_, action) => {
      let data = (action.payload as any).doc[0].data
      // TODO: Imporove interface
      data = data.reduce((output: any, sport: any) => {
        output[sport._id] = {}
        output[sport._id].name = sport.name
        output[sport._id].id = sport._id
        output[sport._id].matches = sport.realcategories.flatMap((category: any) => 
          category.tournaments.flatMap((tournament: any) => 
            tournament.matches.flatMap((match: any) => ({
              id: match._id,
              tournamentName: tournament.name,
              tournamentSeasonTypeName: tournament.seasontypename,
              homeTeamUid: match.teams.home.uid,
              homeTeamName: match.teams.home.name,
              homeTeamResult: match.teams.home.result,
              awayTeamUid: match.teams.away.uid,
              awayTeamName: match.teams.away.name,
              awayTeamResult: match.teams.away.result,
              time: match._dt.time,
              date: match._dt.date,
              statusName: match.status.name,
              statusId: match.status._id
            }))
          )
        ).reduce((output: any, match: any) => {
          output[match.id] = match
          return output
        }, {})
        return output
      }, {})
      return { 
          data,
          loaded: true,
          loading: false
      };
    }).addCase(fetchMatches.pending, () => {
        return { 
            data: {},
            loaded: false,
            loading: true
        };
    }).addCase(fetchMatches.rejected, () => {
        return { 
            data: {},
            loaded: true,
            loading: false
        };
    });
  },
});

export default matchesSlice.reducer;
