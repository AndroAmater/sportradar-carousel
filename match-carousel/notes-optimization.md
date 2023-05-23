# Optimization notes

This is a semi polished version of the cards and carousel. I would still need to improve the usablility and accessibility for production, as well as make some performance/design/code improvements where needed. I'll go into more detail about those below. I focused on the highes priority features and functionalities as my time was limited due to other life responsibilities and most of it had to be delayed untill the weekend. I didn't want to give a much longer time estimate because I also have other interviews and would like to make this brief out of respect for all the companies I'm in talks with, so that I can accept/reject any offers as soon as possible. Given a bit more time I would have polished it, but I will point out the details that I left out below.

This was tested on Chrome, I don't have a mac. 

## Deviations from spec

There are a few deviations from the specification, either because of conflicting directions or because I thought it would be more pragmatic to do something slightly differently. I was told that this assignment spec is still a work in progress so I think it should be okay.

### Provide a folder html-test

There is a direction to provide a html-test folder at the beginning of the assignment, while at the bottom the testing process is described as:

- Unzip the file
- Go into the folder
- Run `npm install`
- Run `npm start`
- Open `http://localhost:3000` in a browser

I figured this was going to be the end testing process, and that the point of the assignment is not to test webpack configuration skills, so I left this one out. I can do it if you wish, but I didn't have a whole lot of time for this due to other responsibilities so I decided my time was better spent elsewhere.

### Class component

As we discussed, I didn't create a class component but a functional component.

### The crest api is replaced

The team crest api wasn't working for me. The ls.betradar domain could not be resolved. I tried googling for the api but couldn't find one, so I just replaced it with a generic flag api, where a country flag is randomly selected from an array of countries based on the team id. If provided with a working api it would simply be a matter of replacing the url in the url generator function and the api integration should work.

### Exact styling

The styling isn't 100% exact. I tried to get reasonably close and I think it looks pretty good. There are some little deviations like the paddings not being exact, the selected dot gets slightly bigger etc. I took a little artistic freedom to make it look good, if provided with designer specs I could make it more accurate with a lot less work.

### Auto-play behavior on hover

The auto play timer is reset when clicking on a dot. I also added a handler to pause and reset the interval when hovering over the card with the mouse. It helped a little when playing around in development and seemed like a neat feature so I decided to leave it in.

### Typescript

I used typescript instead of JS for the components. I used any types for the API data, in production I would make better interfaces.

### App.js with two tabs

I didn't create 2 tabs in the root component. I didn't want to add router packages so as to not waste any time, and didn't see much point in creating the tab functionality as it's super basic, so I decided to skip this and focus on making the cards and carousel better in the time I had.

## Optimization

### Store

It was my first time using Redux or any React state management library, so I'm sure there are some best practices I missed. The promise rejection in the fetchMatches thunk makes the devtools console bleed, and the interfaces aren't the best, but the state works for the demo. It creates the request once, if a request is already in progress and the thunk is triggered again, the code will reject and wait for the first request to load the data, so the data is only loaded once regardless of how many carousels are on the page. The error handling could be improved, as well as loading states, along with general error and loading handling in components.

### Card

The card turned out pretty well. I'm sure there are better practices for styling jsx (haven't used it for a few years now), and a linter would help, but I skipped it to save time.

The country codes array could be removed if I fixed the crest api.

There is no state management here, as most of the logic happens in the carousel component, but we could probably optimize images to lazy load and the card to not be rendered when not selected or near selection. Performance testing would be required to get the best result there though.

### Carousel

I decided to go with a simple scroll based carousel. Scroll snaping is now supported in ~96% of browsers (same support as grid) so I figured it would be good enough for the demo.

The carousel triggers the matches thunk on load, if the data is already loaded nothing will happen. This could be optimized by skipping the dispatch if the data is loaded already.

This carousel allows scrolling with the scroll weel, on touch devices and by clicking the carousel dots. The performance of scrolling should be pretty well optimized as it is a native browser feature.

There is some caching work to do with the elements, I shouldn't have to query the dom every time we want to change the slide.

I'm sure there are some hook optimizations but I got it to a state where I'm pretty happy for my first hook based component.

The JSX could probably be prettier, and some of the code could be better commented. 

Some naming improvements could be made to the functions, variables and classes.

## Final thoughts

I think it turned out pretty well, there is a bit more to do in terms of polish and there are a few other features I would want to support (showing multiple cards at the same time, more complex grids of cards, carousel elements passed via slots). I'm sure we can think of a lot more, but I think it will do for the assignment.

Thank you for your time and sorry if I burried you under this wall of text :D

P.S. Please excuse any spelling errors.
