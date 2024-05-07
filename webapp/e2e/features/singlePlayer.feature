Feature: Playing a full game in single player mode

Scenario: The user plays a game
  Given A registered user
  When I login into the game and start a game in single player mode
  Then The answers and questions should appear the expected number of rounds