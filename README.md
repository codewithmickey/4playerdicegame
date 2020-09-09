# Multiplayer Dice Game

# Live URL : http://dicegame.codewithmickey.com

* A simple turn based dice game
* Dice Outcomes range from 1 to 6
* Multiplayer Game
* Winning Criteria: Total Sum of the dice outcomes for a player reach 61 or greater
* 30 Sec turn or autoplay


**Features:**
- Expandable Project Structure
- Edge Cases handled
- Connect/Disconnect handled
- Scalability
- Minimum NPM modules

**Video of the Application:**

[![Click to see the explanation](https://img.youtube.com/vi/OYCVE2jsv0w/0.jpg)](https://www.youtube.com/watch?v=OYCVE2jsv0w)

**Requirements:**
* NodeJS 12.18.3
* Redis (Localhost:6379)
* MongoDB (It's on my Atlas cluster)

**To Run the Application:**
* **For dev:** npm run dev (This will need nodemon as a dev dependency)
* **For Prod:** npm run prod ( For utilizing all the cores of the processor, I am using cluster method and forking processes on every core of the processor)

**Flow of the Application:**
* Run the application
* Open http://localhost:8080
* Login using (user1@gmail.com, user2@gmail.com, user3@gmail.com, user4@gmail.com)(Click the login button, enter key doesn't work)
* you can also register using http://localhost:8080/register.html (Click the register button, enter key doesn't work)
* After login you will reach the game home screen. You will have 2 options here, "create room" or "join a game"
* Once you click the Create Room button, you will get into the game lobby. Here you will also get a room ID which you can share with other players to join.
* The lobby will get updated if any other players join in your room.
* Once you press the Start Game Button, the game will start. 
* All the data is computed on the server and sent to the client.

