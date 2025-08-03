# Everdell

## Demo

See the app live: https://philliparaujo.github.io/everdell/#/home

Screenshots: https://imgur.com/a/PCErn4L

## Description

[Everdell](https://rules.dized.com/game/0GI6_zUiQh2U27DV_13LJw/everdell) is a 1-4 player board game where you construct a city filled with woodland creatures to earn as many victory points as possible. Each turn you can either gather resources, play a card with resources, or prepare for the next season. The game ends once you have no more actions in the last season, autumn.

This project is specifically a 2-player implementation of Everdell. It includes the base expansion, a few smaller card expansions, and player power expansions. To start play, visit the app link, set your username, and either create/join a game.

## Project Structure

The frontend was made with [React](https://react.dev/) and [Tailwind](https://tailwindcss.com/), and the server is hosted on [Firebase](https://firebase.google.com/docs/firestore). Local settings like username, player ID, and card preferences are saved using `localStorage` and `sessionStorage`.

- `assets`
  - `cards`: Card images grouped by expansion
  - `data`: Raw information about game elements, like cards and locations
  - `icons`: Screenshots of Everdell icons, like resources and colors
  - `images`: Non-card images
  - `screenshots`: For the screenshot gallery on this README
  - `transparent-icons`: Everdell icons with their backgrounds removed
- `components`: Reusable React components, like buttons, cards, and sidebar
- `engine`: Definition of custom types, game constants, and in-game actions
- `screens`
  - `CardManagement`: Set active expansions and card frequencies
  - `Game`: In-game screen
  - `Home`: Set your name and player ID
  - `Lobby`: Create, join, and view games
- `server`: Handle firebase logic
- `utils`
  - `card`: For card frequencies and filename paths
  - `gameLogic`: Many important helpers regarding Everdell game logic
  - `identity`: For `localStorage` and `sessionStorage`
  - `loops`: For working with lists like cards or resources
  - `math`: Generic math helpers
  - `navigation`: Constants for route names corresponding to screens
  - `react`: Helpers that return `ReactNode`
  - `tailwind`: Helpers that return Tailwind className strings
