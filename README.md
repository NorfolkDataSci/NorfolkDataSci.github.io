# NorfolkDataSci.github.io
Home page for the Norfolk Data Science community

| | |
|---|---|
| ![Group Logo](./assets/images/norfolk-ds-logo.png?raw=true)  | **Norfolk Data Science is**: A group of professionals in Norfolk, VA building skills in the field of data science through speakers, tutorials, and hands-on data projects for social good. |

## Contributing
In order to see changes on your local branch, you will need to set up Jekyll to render the site locally. Github provides a great tutorial on how to do this. Below is a summary, but a more complete explanation can be found [here](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/)

*** 

Check for ruby
```bash
$ ruby --version
```
	
Install bundler
```bash
$ gem install bundler
```
Create a file called `Gemfile` in the root of your project and add the following lines:
```bash
source 'https://rubygems.org'
gem 'github-pages', group: :jekyll_plugins
```
Install Jekyll dependencies
```bash
$ bundle install
```	
Build the site locally
```bash
$ bundle exec jekyll serve
```

If you run into any problems installing Jekyll and Bundle on OSX, make sure you have `Xcode Command Line Tools` up-to-date by running 
```bash
$ xcode-select --install
```