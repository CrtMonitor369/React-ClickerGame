# The technical document


### The structure of the program
####    App.jsx is the foundation of everything (ok main.tsx, but nothing is done there)
####    In there we have two IF statements controlling the state of the program, you are either on the main screen, or in the game
####    Almost all of the state is brought up to the level of App.tsx, the exceptions are mostly the cases where the state is only needed inside of the component




### Components structure
#### Button component, which is just a button html element with added additional functionality
#### Clicker, which uses the Button component to build a clicker
#### JigsawPiece component which is a small draggable jigsaw piece
#### JigsawPuzzle which uses the JigsawPiece component to build a jigsaw puzzle
#### DoomFire component which is just a graphical effect used upon save data erasure, it draws to the canvas
#### Shop component, which is a component containing buttons that have purchase functions attached to them


### Most important solutions and challenges

#### I didn't have anything specific, but in general I wrestled with where to best contain the state
#### I found that generally the easiest solution was to just contain most of the state in the parent

### What I learnt

#### I learnt the usage of react, and how to structure an application in it