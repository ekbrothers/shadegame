# ShadeGame App Context

## App Overview

ShadeGrade (shadegame.com is not available) is a web application initially designed for baseball fans to find the best seats in stadiums based on sun exposure. The app provides information about game schedules, stadium layouts, and shading patterns throughout the day. There are plans to expand to other sports once the user base grows.

## Tech Stack

- Frontend: React with Material-UI
- Backend: Not yet implemented (planned: Node.js)
- Deployment: Vercel (currently through VCS connection, may move to GitHub Actions workflow in the future)
- Version Control: GitHub
- Release Management: Using Release Please

## Key Features

1. Team and game selection
2. Stadium map visualization with shading information
3. Calendar view of team schedules with home/away game distinction
4. Light and dark mode support
5. Integration with MLB API for schedule data

## Design Philosophy

- Visually appealing interface using Material-UI
- Emphasis on user-friendliness and intuitive design
- "Stupid easy to use" approach for maximum accessibility

## Development Approach

- Built with assistance from Claude AI to enhance development efficiency
- Modular architecture to facilitate ongoing AI-assisted development
- Emphasis on maintainability and scalability

## Monetization Strategies (Under Consideration)

- Ticketmaster affiliate program integration
- Potential for sponsorships (implementation challenges noted for static site)
- Note: Subscription model is not being considered

## Current Project Structure

```
src/
├── components/
│   ├── GameDetails.js
│   ├── GameSchedule.js
│   ├── LeagueSelector.js
│   ├── StadiumMap.js
│   ├── TeamSchedule.js
│   ├── TeamSelector.js
│   └── [CSS files for components]
├── services/
│   ├── dataService.js
│   ├── mlbService.js
│   └── stadiumShading.js
├── data/
│   ├── stadiums/
│   │   └── index.js
│   ├── stadiumShading/
│   │   ├── index.js
│   │   ├── FenwayPark.js
│   │   ├── GreatAmericanBallPark.js
│   │   └── WrigleyField.js
│   └── mockSchedule.js
├── App.js
├── data.js
└── [other React app files]
```

## Current Development Focus

- Enhancing stadium shading data accuracy
- Adding additional stadium SVGs
- Refining SVG rendering, view, and interactivity on both desktop and mobile devices
- Preparing for backend integration
- Potential expansion to other sports in the future
- Exploring monetization options, particularly Ticketmaster affiliate integration

## Implemented Features

- Home and away game visualization in the calendar

## Data Sources

- MLB API for current schedule data
- Mock data for non-MLB leagues (temporary)

## Known Issues or Limitations

- Stadium shading data is currently static and may not account for all factors
- Limited to baseball stadiums at present, with plans to expand
- Challenges in implementing sponsorships on a static site without compromising aesthetics

## Future Considerations

- Exploring ways to integrate monetization features without disrupting user experience
- Potential migration to a more dynamic site structure to accommodate advanced features

Please note that this context is current as of [INSERT DATE]. When discussing the app, I'll provide any updates or changes to this information as needed.
