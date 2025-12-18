# Summer's Music Recommender

A web application that connects to Spotify and various radio stations to discover new music.

---

## Features

* Connects securely to a Spotify account using OAuth 2.0
* Displays the currently playing track on radio stations
* Shows the recent tracks played for the radio stations
* Responsive layout for desktop and mobile

---

## Authentication

Authentication is handled on the backend using **Spotify OAuth 2.0** to keep credentials secure.

Required Spotify scopes:

```txt
streaming
user-read-playback-state
user-modify-playback-state
user-read-currently-playing
```

A **Spotify Premium account** is required for full in-app playback.

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
KEXP_API_BASE=http://live.kexp.org/api/v2
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri (I used ngrok for this)
```

---

### Run the Application

```bash
npm start
```

Then open:

```
http://localhost:5000
```

---

## Project Structure

```txt
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── routes/
│   └── spotify.js
├── server.js
├── .env (ignored)
├── .gitignore
└── README.md
```

---

## Limitations

* Spotify Premium is required for full playback
* Some tracks may not provide preview URLs
* Rate limits apply based on Spotify API usage

---

## License

This project is intended for personal and educational use.

