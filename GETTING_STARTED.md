## Getting Started

#### Setting Up Your System

1. Install [Git](https://git-scm.com/) or your favorite Git client.
2. (Optional) [Setup an SSH Key](https://help.github.com/articles/generating-an-ssh-key/) for GitHub.
3. Create a parent projects directory on your system.

#### Forking freeCodeCamp Alumni Network

1. Go to the freeCodeCamp Alumni Network (FFCAN) repository: <https://github.com/FCC-Alumni/alumni-network>
2. Click the "Fork" Button in the upper right hand corner of the interface ([More Details Here](https://help.github.com/articles/fork-a-repo/))
3. After the repository has been forked, you will be taken to your copy of the FCCAN repo at `yourUsername/alumni-network`

#### Cloning Your Fork

1. Open a Terminal / Command Line / Bash Shell in your projects directory (_i.e.: `/yourprojectdirectory/`_)
2. Clone your fork of FCCAN

```shell
$ git clone https://github.com/<yourUsername>/alumni-network.git
```

##### (make sure to replace `<yourUsername>` with your GitHub Username)

This will download the entire FCCAN repo to your project's directory.

#### Setup Your Upstream

1. Change directory to the new FCCAN directory (`cd alumni-network`)
2. Add a remote to the official FCCAN repo:

```shell
$ git remote add upstream https://github.com/FCC-Alumni/alumni-network.git
```

Congratulations, you now have a local copy of the FCCAN repo!

#### Maintaining Your Fork

Now that you have a copy of your fork, there is work you will need to do to keep it current.

##### **Rebasing from Upstream**

Do this prior to every time you create a branch for a PR:

1. Make sure you are on the `master` branch

```shell
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
```
  > _If your aren't on `master`, resolve outstanding files / commits and checkout the `master` branch_

```shell
$ git checkout master
```

2. Do a pull with rebase against `upstream`

```shell
$ git pull --rebase upstream master
```
  > _This will pull down all of the changes to the official master branch, without making an additional commit in your local repo._

3. (_Optional_) Force push your updated master branch to your GitHub fork

```shell
$ git push origin master --force
```
  > This will overwrite the master branch of your fork.

### Create A Branch

Before you start working, you will need to create a separate branch specific to the issue / feature you're working on. You will push your work to this branch.

#### Naming Your Branch

Name the branch something like `fix/xxx` or `feature/xxx` where `xxx` is a short description of the changes or feature you are attempting to add. For example `fix/email-login` would be a branch where you fix something specific to email login.

#### Adding Your Branch

To create a branch on your local machine (and switch to this branch):

```shell
$ git checkout -b [name_of_your_new_branch]
```
For example:
```shell
$ git checkout -b fix/minor-typo
```
and to push to GitHub:

```shell
$ git push origin fix/minor-type
```

##### If you need more help with branching, take a look at _[this](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches)_.
