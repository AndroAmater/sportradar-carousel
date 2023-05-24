# Notes

## Dependencies

The only thing I added to the project (besides what ships with create-react-app), were 2 packages.

### Axios

Axios is a library for http requests making life a bit easier. I chose it because it's pretty standard, I have lots of experience with it, and it gets the job done.

### Redux

I chose redux because it's the most popular state management solution that I know of. I've never used it before, and don't really know of any alternatives, but decided to go with it to optimize the requests and data sharing between components. This is something I would have to research when starting with React.

## Files and Folders

### Src

#### App.tsx / App.css

The App component (not sure if this is reffered to as the root component in react, or if the index.tsx is the root. I decided to place the tabs here because it seemed a bit cleaner for the demo) with 2 tabs and 3 match carousels. There is likely a way to optimize the rendering for tabs but I'm new to react and spent most of my time allocated for optimization on the actual Carousel component, so this is just something that does the job.

#### components

##### Card.tsx / Card.css

This is the card component designed the same way as in the static page and in the designs.

At the beginning of the file there are some country codes I use to "randomly" select flags from. The crest api doesn't exist anymore so I had to use an open flags API. If the crest api were to be implemented this could be removed.The flag is selected based on the team id so replacing the API should be very easy.

The component pretty much gets the match data and displays it. There isn't really any reactivity here. There are some conditionals but it's all very basic.

##### MatchCarousel.tsx / MatchCarousel.css

This is the carousel component and this is where the bulk of the logic for this demo happens.

The features described in the assignment should work. There are a number of improvements and features that could be added, for example:

- Aria labels and general accessibility optimization
- Other options for controls (left/right arrows etc.)
- Keyboard control
- Different layouts for the cards
- Showing more than just the selected card

Some of these would be fairly easy to add, for some it would require a little bit of a rework for how this works, but the general concept with scroll snapping should work well.

I added a loading state and an error state. The loading state can be easily tested by throttling the network speed and the error state by blocking the request in devtools.

In the optimization phase I reduced the rerenders from ~16 to 8. 6 happen when the component is created and 2 after the content is loaded, after that the component never re-renders unless the data or the props change (I didn't test the data or the props changing so that may be buggy). Interestingly when switching tabs there are only 2 re-renders when the component enters and leaves the viewport. I didn't immediately understand it, but I'm guessing React does some caching at some point.

From the first version I removed all `useState`s. I replaced them with a single ref object that doesn't reall need to be reactive, and with a memoized sport object and slides array. I wrapped pretty much all handlers/callbacks into useCallback for caching and removed as many effects as I could. I also memoized the carousel body contents, because some of the components don't need to be re-evaluated every time. This would mostly come in handy if the data or props changed.

The data loading is more efficient this time. When the request is received all the data is still mapped (more on that below in the matches.ts notes), but on the component the loops are run only as many times as it takes to populate the data array. For specific sports I just use array slices. There is probably a little faster way to do the match selection for all sports also using slices and checking new data length every time matches are added instead of looping the array, but I didn't think of it when I was refactoring.

I'm almost completely new to react so this was as far as I got in this refactor. I'm sure there are other improvements that could be made and that there are some reactivity behaviors and optimization techniques that I'm not fammiliar with, but I'm pretty happy for a couple of day's work. I got the component down to a lot less re-renders, and it doesn't re-render at all when changing slides so that's pretty good for a first try. The other big improvements can be made in the state.

##### icons/*

A folder with 2 svg icon components for the loaders and error handling state.

#### store

##### store.ts

The root store file where the store is created and the matches reducer is registered

##### matches.ts

This is where the server data is fetched, transformed and stored.

All the data is now typed, there arent any `any` types in the application left.

I also added and finished the loading state and some simple error handling.

This was my first ever time using redux, and it's a lot more complicated and convoluted than Vue.js's state management solutions that I've worked with in the past, so there was quite the learning curve in the little time I spent on it. I cobbled together a working solution, but I'm sure that there is a way to improve it with best practices.

The main problem with this solution is the amount of data we are fetching from the server and transforming on the frontend immediately.

The first optimization I would add here is only requesting the data form the server that we need. This would be by far the best solution.

If that is not possible, I would go on to develop a solution that fetches the data, dumps the raw data somewhere, and only retrieves and maps the data that it needs, when it needs it, and ideally caches the mapped data somewhere, so that it can be reused if requested again from another component.

The optimization approach here would depend a lot on what we would want to optimize. Is is cpu cycles, ram or maybe DX and readability.

The solution works good enough for now, and I would not optimize further until I found out more about the requirements. When the first API call is made it now successfuly blocks new calls (there was a missing return before `Promise.reject()` and a flawed way of thunk handling in the first version). After that the data is parsed and remapped for component consumption, and from there the rest should be pretty performant.

## Finishing thoughts

The first version was quite a disaster, I admit. It was a mix of miscommunication, not knowing the wanted quality level, but most of all my negligence. 

I wanted to deliver a product that showed I knew what direction I wanted to go in, and that I could talk about and explain further optimizations in person, but I also thought that a few crucial of things were working, but did not check well enough, and that resulted in a far worst experience than I thought I was delivering. I am quite embarrased about it and I didn't want that to be a reflection of my work or standards.

This version turned out much better. I know I could do more with this but I am also limited with time so this will likely be my last contribution to this project. I completely understand if the first version left a bad taste in your mouth and you aren't ready to take the risk of considering me for your team, but I really couldn't have that be my final product :)

Thank you for your time.
