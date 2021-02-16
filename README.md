<h1 align="center">
  2PC-Client
</h1>

<p align="center">
  Front-end control panel of an own implementation of the Two Phase Commit Protocol for the UZH course "Distributed Database Systems DDBS20"
</p>

# Demo

A demo playground can be found [here](https://2pc.janwil.li/).

![Control Panel](public/control_panel.jpg)

# How to run

1. `git clone` this repository
2. run `npm install` once
3. `npm run dev` runs the app in development mode
4. Navigate to [http://localhost:3000](http://localhost:3000) to view it in the browser.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# How to use

This client consists of three main views.
- **Landing Page:** insert URLs of the coordinator and any desired number of nodes
- **Control Panel:** manually run transactions with variable configurations
- **Test Panel:** automatically run randomized tests
