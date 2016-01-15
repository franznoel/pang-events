# pang-events
Pang-events is a simple event manager where you can place events and invite people. 

## Installation
Follow these steps to install pang-events in your local directory:
- Install Nodejs in your computer
- Run `git clone https://github.com/fritzdenim/pang-events` to clone to your projects folder.
- Run `<Project Folder>/pang-events/app`
- Run `npm install`
- Run `npm install -g serve` to install NodeJs server.
- Run `serve` inside the <Project Folder>/pang-events/app.

## User Guide

### Adding Events
After signing up and logging in, you can add an event

Fill out the following fields:
 - Event Information: name/title, host, type
 - Address
 - Start and End Time
 - Description
 - Guests (email)

Note: When adding a guest, saving the event is required. Otherwise, guest list will not be updated.

### Event Search
Users should type the specific name in the Event Search to find the correct event title.

### User Authentication
You can sign up and sign in with your username and password using Firebase password authentication.

Resetting your password includes an e-mail.

In the users profile, users can also reset their password.

Future plans include using Google and Facebook authentication.

