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
- [Make Changes](#make-changes)
- [Squash Your Commits](#squash-your-commits)
- [Creating A Pull Request](#Creating-a-pull-request)
- [Common Steps](#common-steps)

### Prerequisites

| Prerequisite                                | Version     |
| ------------------------------------------- | -------     |
| [Node.js](http://nodejs.org)*               | `~ ^8`      |
| npm (comes with Node)                       | `~ ^5`      |
| Docker**                                    | `>=17.04.0` |

> _*Node 8 is now a required prerequisite for this project._
> _Updating to the latest release of other prerequisites is recommended._

If Node or Docker are already installed on your machine, run the following commands to validate the versions:

```shell
$ node -v
$ docker -v
```
If your versions are lower than the prerequisite versions, you should update.

> _**If you are running an older OS (Mac, Windows, or Linux), the latest version of Docker may not be available to you.
You may have to install Docker Toolbox instead, which should still run this application. If you are unable to successfully
run the app using Docker Toolbox, please [open an issue](https://github.com/FCC-Alumni/alumni-network/issues/new)._

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
- All dependencies are installed in a Docker container to prevent issues with non-Linux systems.
- Should you ever need to install dependencies, please be sure to install them in the appropriate directory.
- Before installing new dependencies you should start a shell session in docker with `docker run -it -v "$PWD":/app/ -w /app/ node:8.1.3 bash`
- `npm setup` can also be run again should you ever need to clear or fix either `node_modules` folder.

**Secrets and API keys:**
- This project utilizes a few APIs, but only one is absolutely crucial for the app to run: GitHub. Since user authentication is based on a `PassportJS` GitHub strategy, you must have a GitHub ID and a GitHub secret for the app to run, otherwise you will be unable to login.
- To get started, go to your GitHub account, and go to `Settings` > `OAuth Apps` > `Register a new application`.
- Call your application something like `local-fccan`, give it a homepage of `http://localhost:8080` (this doesn't really matter for now), and **most importantly**, give it an "Authorization callback URL" of `http://localhost:8080/auth/github/callback` (8080 is the port the proxied express server will be running on).
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


### Running the App
- In a terminal run `npm run dev`
- This will set up mongo, and both the backend and frontend servers, as well as populate the database.
- If all of this worked, your app should be up and running! Open a new browser window (we recommend using Chrome), and navigate to http://localhost:3000.

### If you are not FCC Certified, Please Read!
> **_NOTE:_** Our registration process requires that users have a GitHub account, a freeCodeCamp account, and at least one FCC certification to join. However, we do not want this limitation to prevent potential contributors from gaining access to the application for development.

If you are not FCC certified, we have included a workaround setting that can be changed for development only:
- In your text editor, open the file `server.js`, located in the project's root directory.
- On line `~15`, you should see the following `export` statement:
```js
export const isAllowedForDev = false;
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
$ docker exec -it alumninetwork_mongo_1 /usr/bin/mongo
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

### Make Changes
This bit is up to you! Find an issue on GitHub that looks like it needs some love, or suggest a new feature that needs implementing and build it! We're excited to see what you come up with!

### Squash Your Commits
When you make a pull request, all of your changes need to be in one commit.

If you have made more than one commit, then you will need to _squash_ your commits.

To do this, see [Squashing Your Commits](http://forum.freecodecamp.org/t/how-to-squash-multiple-commits-into-one-with-git/13231) (thanks for the guide freeCodeCamp!).

### Creating A Pull Request

#### What is a Pull Request?

A pull request (PR) is a method of submitting proposed changes to the FCCAN
Repo (or any Repo, for that matter). You will make changes to copies of the
files which make up FCCAN in a personal fork, then apply to have them
accepted by FCCAN proper.

#### Need Help?

There are only a few FCCAN issue / GitHub mods for now, so our resources may be stretched a bit thin, but feel free to @mention @no-stack-dub-sack or @bonham000 if you have an issue that you need help with, we will respond as best we can in as timely manner as possible. Otherwise, don't forget &mdash; Google is your best friend!

#### Important: ALWAYS EDIT ON A BRANCH

Take away only one thing from this document: Never, **EVER**
make edits to the `master` branch. ALWAYS make a new branch BEFORE you edit
files. If your `master` branch _does_ get out of sync, you can bring it back in line with master by doing the following:

```bash
# adds the main repo as a remote on your machine. Only needs to be done once.
git remote add upstream git@github.com:FCC-Alumni/alumni-network.git

# checkout master if you haven't already
git checkout master

# fetch the latest upstream code
git fetch --all

# resets your current branch to match latest upstream code
git reset --hard upstream/master

# overwrite master on your fork in GitHub with the code you just reset
git push --force
```

##### Editing your Local Fork

1.  Perform the maintenance step of rebasing `master`.
2.  Ensure you are on the `master` branch using `git status`:

```bash
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.

nothing to commit, working directory clean
```

3.  If you are not on master or your working directory is not clean, resolve
    any outstanding files/commits and checkout master `git checkout master`

4.  Create a branch off of `master` with git: `git checkout -B branch/name-here`
    **Note:** Branch naming is important. Use a name like `fix/short-fix-description`
    or `feature/short-feature-description`.

5.  Edit your file(s) locally with the editor of your choice

6.  Check your `git status` to see unstaged files.

7.  Add your edited files: `git add path/to/filename.ext` You can also do: `git
    add .` to add all unstaged files. Take care, though, because you can
    accidentally add files you don't want added. Review your `git status` first.

8.  Commit your edits: `git commit -m "Brief Description of Commit"`. Do not add the issue number in the commit message.

9.  Squash your commits, if there are more than one.

10.  Push your commits to your GitHub Fork: `git push -u origin branch/name-here`

### Common Steps

1.  Once the edits have been committed, you will be prompted to create a pull
    request on your fork's GitHub Page.

2.  By default, all pull requests should be against the FCCAN main repo `master`
    branch.

3.  Submit a pull request from your branch to FCCAN's `master` branch.

4.  The title (also called the subject) of your PR should be descriptive of your
    changes and succinctly indicates what is being fixed.
    -   **Do not add the issue number in the PR title or commit message.**
    -   Examples: `correct typo in preferences page copy`

5.  In the body of your PR include a more detailed summary of the changes you
    made and why.
    -   If the PR is meant to fix an existing bug/issue then, at the end of
        your PR's description, append the keyword `closes` and #xxx (where xxx
        is the issue number). Example: `closes #124`. This tells GitHub to
        close the existing issue, if the PR is merged.

6.  Indicate if you have tested on a local copy of the site or not.
