# AngularStarters - Supabase Hackathon Project

[![Netlify Status](https://api.netlify.com/api/v1/badges/e41adaa8-41de-4683-b15e-3907d49d6840/deploy-status)](https://app.netlify.com/sites/sharp-khorana-bcaab1/deploys)

Angular Starters is my Supabase Hackathon submission. It is a website that allows users to submit their Open Source starter projects using their favorite libraries and services, all written in Angular, for the benefit of the Angular Community.

As of late I have been developing in React and React Native, but I have a true love and passion for Angular. I've been meaning to create this application for over a year, in fact I started it over a year ago, but got discouraged due to the difficulty of the serverless platform I was previously using. When I heard of Supabase, and subsequently their hackathon event, I thought this would be the perfect opportunity to give it a go. Hope you enjoy!

## Submission Info

- Live site at [angularstarters.io](https://angularstarters.io) hosted by Netlify
- YouTube demo [video](https://youtu.be/_8zkXY7QBHM).
- My [twitter](https://twitter.com/jacobneterer)

## Use of Supabase

I used supabase to manage user accounts that can submit starter projects to be displayed on the Angular Starters site. Below is a detailed explanation.

### Auth

Users can sign up/sign in with their GitHub account.

Admins are invited via email and can sign in via requesting a magic link.

### Database Tables

- `profiles` - for storing user profile data given by GitHub on sign up/sign in
- `starters` - for storing starter project data
- `starter_revisions` - for storing any revisions the user wants to make to a starter while their revisions are being reviewed by admins
- `starter_activity` - for storing any activity events associated with the starter (starter created, status changed, comment made, etc)

### Buckets

- `starter-covers` - a bucket for storing all starter covers

### Policies

Unauthenticated users can view any starter.

Authenticated users have access to all of their starter data (including activities and revisions).

Admins can access all data.

## Other

Huge shoutout to [TailwindUI](https://tailwindui.com/). Without my subscription I could've never designed this in such little time without it.

## Future enhancements

1. Side-by-side revision view
2. Ability to cancel (delete) a revision request
3. Add search for starters
4. Determine starter dependencies on starter details page
5. Determine angular version

## Angular Info

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
