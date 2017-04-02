# neighborhood-map
This is my fourth project in Udacity's 
[Full Stack Web Development Nanodegree](https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd004). This project focused on the 
use of third party APIs in webpages, as well as using JavaScript.

## Files
### index.html
Contains html to display webpage.
### app.js
Contains all of the JavaScript I wrote, including API calls and Knockout code.
### knockout-3.4.2.js
Contains code downlaoded from knockout.js.com. This code sets up the MVVM structure.
### main.css
Contains all syles used for index.html

## Requirements
1. Clone repository
2. Open app.js in an editor
3. On line 66, replace e8145af40a88765c with your own Wunderground api key (for instructions on obtaining a key, see below)
4. Open index.html in an editor
5. On line 39, replace AIzaSyAGg6jzODABTeFl6vl5GIk17Wg_vgns9dA with your own Google Maps API key (for instructions on obtaining a key, see below)
6. Open index.html in your browser

#### Getting a Wunderground API Key
1. Visit [https://www.wunderground.com/weather/api/](https://www.wunderground.com/weather/api/)
2. Sign in or create a free account
3. Open the menu in the upper right and select Weather API for developers
4. Click 'Explore My Options'
5. Select the Stratus Plan and scroll down
6. Select Developer (Should be $0/month) 
7. Click "Purchase Key"
8. You will get a validation email, confirm your email and then your key will be available!

#### Getting a Google Maps API Key
1. Visit [https://console.developers.google.com](https://console.developers.google.com)
2. Sign in with your Google - i.e. yourname@gmail.com. If you don't have one, you can go to [accounts.google.com](accounts.google.com) to create one for free.
3. Click on "Select a Project" and then "Create a Project" in the upper right side of the screen.
4. Name your project something descriptive. Select whether you'd like to receive updates (usually a good idea) and select whether you agree to the terms of service. 
5. Click the "Create" button.
6. Click on the "Google Maps JavaScript API" under "Google Maps APIs" 
7. Click the "Enable" button
8. Repeat steps 6 and 7 for the following APIs: 
- Google Streetview Image API
- Google Maps Geocoding API
- Google Maps Distance Matrix API
- Google Maps Geolocation API
9. Click the “Credentials” menu item on the left of the screen
10. Click the “Create Credentials” button
11. Select “API Key” from the options that appear.
12. Select the “Browser Key” button
13. Name your API Key something descriptive. It should reflect your intended use of the key. Click the “Create” button.
14. Repeat steps 10 and 11 for “Server Key,” if you will be making server-side requests. You can access these keys at any time by visiting the “Credentials” sub-menu under the “API Manager” menu
