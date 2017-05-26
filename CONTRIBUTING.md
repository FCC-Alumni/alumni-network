# Contributor's Guide
### Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Setting Up freeCodeCamp Alumni Network](#setting-up-freecodecamp-alumni-network)
- [Running the App](#running-the-app)
- [If you are not FCC Certified, Please Read!](#if-you-are-not-fcc-certified-please-read)
- [Dev Tools & Other Utilities](#dev-tools---other-utilities)
- [Using the Mongo Shell](#using-the-mongo-shell)
- [Semantic-UI / Semantic-UI React](#semantic-ui--semantic-ui-react)
- [SASS / Styled-Components](#sass--styled-components)

### Prerequisites

| Prerequisite                                | Version |
| ------------------------------------------- | ------- |
| [MongoDB](http://www.mongodb.org/downloads) | `~ ^3`  |
| [Redis](https://redis.io/download)          | `~ ^3.2`|
| [Node.js](http://nodejs.org)                | `~ ^6`  |
| npm (comes with Node)                       | `~ ^3`  |

> _Updating to the latest releases is recommended_.

If Node, MongoDB, or Redis are already installed on your machine, run the following commands to validate the versions:

```shell
$ node -v
$ mongo --version
$ redis-server --version
```
If your versions are lower than the prerequisite versions, you should update.

### Getting Started
> **_IMPORTANT:_** If you have never contributed to an open source project before, are unfamiliar with the git workflow, or need assistance with creating a local copy of the freeCodeCamp Alumni Network (FCCAN) repo, branching, branch naming conventions, etc., please see the Getting Started guide [here](https://github.com/FCC-Alumni/alumni-network/blob/master/GETTING_STARTED.md).

### Setting Up freeCodeCamp Alumni Network
> Once you've established a local copy of FCCAN, you will need to do a few things before launching the application for the first time:

**Install all of the project's dependencies:**
- This project is bootstrapped with `create-react-app` and is configured to run a proxied server. This means `npm install` needs to be run twice.
- We have created a utility script to make this easier for you: In the project's root directory, simply run the following command:
```shell
$ npm run setup
```
- Please note that this may take several minutes. All of the server side dependencies are installed at the root level, while all of the client's dependencies are installed in `alumni-network/client`.
- Should you ever need to install dependencies, please be sure to install them in the appropriate directory.
- `npm install` can also be run in each independently in each directory should you ever need to clear either `node_modules` folder.

**Secrets and API keys:**
- This project utilizes a few APIs, but only one is absolutely crucial for the app to run: GitHub. Since user authentication is based on a `PassportJS` GitHub strategy, you must have a GitHub ID and a GitHub secret for the app to run, otherwise you will be unable to login.
- To get started, go to your GitHub account, and go to `Settings` > `OAuth Apps` > `Register a new application`.
- Call your application something like `local-fccan`, give it a homepage of `https://localhost:8080` (this doesn't really matter for now), and **most importantly**, give it an "Authorization callback URL" of `https://localhost:8080/auth/github/callback` (8080 is the port the proxied express server will be running on).
> **_IMPORTANT:_** Make sure there is no trailing slash at the end of your authorization url - you should enter it _**exactly**_ as it is above.
- Once you've successfully created a new OAuth app, copy the sample `.env` file into your root directory and name it `.env`:
```shell
$ cp sample.env .env
```
- This will set you up with a template `.env` file for you to populate with the necessary API keys and secrets and will contain the `MONGO_URL` environment variable for you to connect to your locally run database.
- Add the GitHub Client ID and GitHub Client Secret keys that you generated, when you created a new OAuth app earlier, to their respective environment variables in the `.env` file.
- A session secret is also required for `PassportJS` authentication to work. Your session secret can be anything you want, but for best practices, try to make it at least somewhat complex and only something you will remember.
- Do not wrap your environment variable keys in quotes or leave a space after the `=` sign. The first few lines of your file should look something like this:
```
MONGO_URL=mongodb://127.0.0.1:27017/alumninetwork

SESSION_SECRET=thisisasupercoolsessionsecretthatonlyIknow

GITHUB_CLIENT_ID=<Enter the client ID for your GitHub application here>
GITHUB_SECRET=<Enter the secret for your GitHub application here>
```
- LinkedIn and Twitter API keys are optional and are only required if you will be developing against the features that utilize these APIs.

**Populating the Database and Running the App:**
- To run the app, you will need a minimum of 4 terminal/command prompt tabs for each of the following processes, which must be running for the app to work: `create-react-app` dev-server, NodeJS server, MongoDB, and Redis.
- First, launch MongoDB and Redis:
```bash
# in your first tab, in any directory, run:
$ mongod
# if you are a mac user and get an error, you may need to run:
$ sudo mongod
# and enter your password
#
# now, in your second tab, also in any directory, run:
$ redis-server
```
- For assistance troubleshooting MongoDB or Redis, please refer to the respective documentation and/or your always friend Google.
- Once Redis and MongoDB are running, all that's left to do is to launch the servers. However, you may find it helpful to have some mock users populated into the database for development. We've created a utility for just this purpose (**NOTE:** MongoDB must be running for this utility script to work).
- This is an optional step, and can be completed at any time, however it is recommended for the best development experience.
```bash
# in another tab, in the project's root directory, run:
$ npm run populate-db
# if this is successful, you should see a success message in the command prompt console
# if you get an error, please make sure mongo is running and try again
```
- Finally, launch the dev servers:
```shell
# in your third tab, in the project's root directory, run:
$ npm run dev
# this will start the NodeJS server
#
# in your fourth tab, from the project's root directory
# change directories to alumni-network/client
$ cd client
# and run
$ npm start
# this will start the CRA dev-server
```
- If all of this worked, your app should be up and running! If you are not navigated there automatically, open a new browser window (we recommend using Chrome), and navigate to http://localhost:3000.

> _**BONUS:**_ In addition to the 4 tabs required to run the app's various servers and databases, we recommend utilizing at least 2 other command prompt/terminal tabs. One for interacting with MongoDB (which you can do by running `$ mongo` from the command line), and another for general navigation, additional commands, and for managing the project's Git workflow.

### Running the App
> _**SUMMARY:**_ To summarize the previous section, and for running FCCAN each time after initial setup, the commands are:
```shell
# Tab 1: Run MongoDb
$ mongod
# Tab 2: Run Redis
$ redis-server
# Tab 3: Run NodeJS Server
$ npm run dev
# Tab 4: Run CRA dev-server
$ cd client
$ npm start
```

### If you are not FCC Certified, Please Read!
> **_NOTE:_** Our registration process requires that users have a GitHub account, a freeCodeCamp account, and at least one FCC certification to join. However, we do not want this limitation to prevent potential contributors from gaining access to the application for development.

If you are not FCC certified, we have included a workaround setting that can be changed for development only:
- In your text editor, open the file `server.js`, located in the project's root directory.
- On line `~15`, you should see the following `export` statement:
```js
export const isAllowed = false;
```
- Change the boolean to `true`, save your changes and run the server (if it is not already running), and you will now be allowed in to the app.
- Please be sure to revert this change before making a PR, or you will be asked to make the change before the PR is accepted.

### Dev Tools & Other Utilities
> _**NOTE:**_ We built this project using Chrome as our default browser, and for the best development experience and seamless dev-tools integration, we recommend you do the same.
- This project is configured to use both React and Redux dev tools. You can get them for Chrome here:
    - [React](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
    - [Redux](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
- Another useful utility that's value goes beyond the scope of this project is [Mongo Hacker](https://github.com/TylerBrock/mongo-hacker). This package is a series of Mongo Shell enhancements that makes interacting with MongoDB from the command line more seamless and less visually taxing.
- It can be installed by running the following commands:
> _**NOTE:**_ Do not run these commands in the FCCAN project directory, you should run these in your project's parent directory, e.g. `/Users/your_name/myCodingProjects`, or in another preferred directory.
```shell
$ git clone --depth=1 https://github.com/TylerBrock/mongo-hacker.git
$ cd mongo-hacker
$ make install
```

### Using the Mongo Shell
> _**NOTE:**_ For more complete documentation, please see the Mongo Shell documentation [here](https://docs.mongodb.com/manual/reference/mongo-shell/).
- While working on this project, you may find it helpful to interact with MongoDB from Mongo's built in Mongo Shell. You can access this shell by using the following command from your command prompt/terminal:
```shell
$ mongo
```
- Here are some helpful commands and tips to get you started:
```shell
# before running any of the following commands
# switch to the FCCAN database by using:
$ use alumninetwork
#
# list all collections within alumninetwork db:
$ show collections
#
# see all entries of a particular collection
# ex:
$ db.users.find({})
# or
$ db.privateChat.find({})
#
# these searches can be refined further:
$ db.users.find({ username: "no-stack-dub-sack" })
#
# you may occasionally want to reset your project's DB to test
# certain features like registration (which you will only go through
# the first time your user document is added to the database):
$ db.dropDatabase()
# WARNING: this cannot be undone and is tantamount to deleting
# all of your project's stored data! If you need to preserve your
# current settings, this is NOT recommended.
```
- Like in other shells, note that you can use the <kbd>↑</kbd> and <kbd>↓</kbd> keys to cycle through recent commands.
- There are other commands that you may find helpful, so don't forget to check out the documentation!

### Semantic-UI / Semantic-UI React
For responsive design, layout, theming, and general UI design, we have chosen to utilize [Semantic-UI](https://semantic-ui.com/) over some of the more common libraries like Bootstrap. We made this choice for 2 reasons: 1) We already knew Bootstrap and we wanted to learn something new, and 2) Semantic-UI rocks! We think you'll like working with it too.

**Some notes on Semantic-UI:**
- Semantic-UI is working on a seamless React integration, however not every feature is currently supported, and frankly, some features are just easier to implement using the standard CSS implementations. On the other hand, some features of the React integration are excellent, and are not easily duplicated using the CSS only package. As a result, this project makes use of a combination of both [Semantic-UI](https://semantic-ui.com/) CSS and [Semantic-UI-React](https://react.semantic-ui.com/).
- We've linked to both docs so please explore them and feel free to use whichever fits your particular use case the best.

**On Theming:**
- We've replaced the standard Semantic-UI theme, with a theme that replicates the freeCodeCamp theme (a creative commons theme).
- Most components can be colored just by adding the corresponding class names to the JSX markup. However, the way Semantic-UI implements theming, means that some colors don't exactly match up with their corresponding class names. Here are the main colors we use and their corresponding class names:

| Color         | Class Name |
| ------------- |----------- |
| Green         | green      |
| Dark Green    | teal       |
| Red           | red        |
| Grey          | grey       |
| Dark Grey     | black      |
| Light Red     | pink       |

- As you can see there are some discrepancies here, but for the most part, you will only really be using `green`, except in special cases. For a full list of colors and their class name mappings, see [this](https://github.com/FCC-Alumni/alumni-network/blob/master/client/public/semantic/src/site/globals/site.variables) file.

### SASS / Styled-Components
Consistency is fantastic! However, this project isn't. At least from a CSS standpoint 😄 . While we relied heavily on Semantic-UI for our general UI design and styles, more granular styles are always necessary to achieve the right level of control. For this, we used 3 different approaches to styling the UI:
- Regular old SASS
- In-line React styles
- Styled-Components

**Why Styled-Components?**
- Part way through building this project, we discovered [Styled-Components](https://github.com/styled-components/styled-components), which is an awesome library that decouples class-name mappings from styles, and allows for writing more intuitive, and very flexible CSS within your React code, that can very easily respond to conditionals. Since your styles are (mostly) kept in the same files as your components, there's also a lot less digging through the file tree and a massive SASS file to find the styles you're looking for.
- Styled-Components are not ideal for everything, but wherever possible, we tried to replace existing SASS code with Styled-Components.

**When to use Styled-Component and When to Not:**
- For most use cases, Styled-Components is suitable and will be the preferred method for writing new styles when contributing to this app. Try to use them wherever possible!
- For very simple, or very complex use-cases, however, Styled-Components may not be ideal.
- A very simple change, such as modifying a font-size, is a better use case for React in-line styles.
- In the event of very complex styling, such as in our "Mess Hall", you will likely find that a SASS stylesheet will be the best solution.  
- While Styled-Components supports animations, we've found that this support doesn't work so well, so SASS stylesheets are going to be the best bet there. We have a stylesheet dedicated to animations [here](https://github.com/FCC-Alumni/alumni-network/blob/master/client/src/styles/_animations.scss).

**Some Tips:**
- Before contributing to this app, we highly recommend that you familiarize yourself with some basic Styled-Components usage. But don't worry! It's pretty easy to get started with.
- The Styled-Components [documentation](https://github.com/styled-components/styled-components/blob/master/docs/README.md) is excellent, however their [repo landing page]((https://github.com/styled-components/styled-components)) provides a very thorough introduction and is probably the best place to start.
- For, some more advanced concepts, see the [Tips & Tricks](https://github.com/styled-components/styled-components/blob/master/docs/tips-and-tricks.md) doc, which covers some syntax you'll see throughout this project, like utilizing props for making conditional changes, and global styles (examples of both can be seen in the [`style-utils`](https://github.com/FCC-Alumni/alumni-network/blob/master/client/src/styles/style-utils.js) file).
- Here's a basic example of the global style concept, which utilizes functions that return CSS which are invoked using the `${}` template literal syntax, e.g.:
```js
import styled from 'styled-components';
import { thisFunctionReturnsCSS } from './style-utils';

const Text = styled.span`
  border: 1px solid red;
  ${ thisFucntionReturnsCss() }
`;
```
- Our [`hoverTransition`](https://github.com/FCC-Alumni/alumni-network/blob/master/client/src/styles/style-utils.js#L39) function is a great example of a reusable, global style that can be invoked in any styled-component (since all styled-components rely on template literals).  
- This code might not make sense out of context, however, this is a very powerful concept that's worth pointing out. And after checking out our codebase and the Styled-Components docs, this will all make much more sense!

### This file is a WIP!
