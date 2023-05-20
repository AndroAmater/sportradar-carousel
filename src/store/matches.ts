import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'

export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async () => {
      let res
      try {
        // setIsLoading(true)
        res = await axios.get('https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/event_fullfeed/0/1/12074')
        // setSports(res.data.doc[0].data)
        console.log(res.data.doc[0].data)
      } catch (error) {
        // setIsError(true)
      }
    return res.data.doc[0].data;
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState: [],
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (_, action) => {
      console.log(action)
      return action.payload;
    });
  },
});

export default matchesSlice.reducer;
