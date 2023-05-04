import 'dotenv/config';

import tmi from 'tmi.js';
import trackAttendance from './controllers';
import User from './models/user';
import Channel from './models/channel';

import express from 'express';
import cors from 'cors';

import passport from 'passport';
import twitchStrategy from 'passport-twitch-new';

import { readOrCreateWithId } from './controllers/firestore';

const PORT = process.env.PORT || 8080;
const app = express();


// const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);


app.use(cors());

app.use(passport.initialize());


passport.use(new twitchStrategy.Strategy({
  clientID: process.env.TWITCH_CLIENT_ID,
  clientSecret: process.env.TWITCH_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV == 'production' ? `${process.env.API_URL}/auth/twitch/callback` : `http://localhost:8080/auth/twitch/callback`,
  scope: "channel:moderate chat:edit chat:read"
},
async function(accessToken, refreshToken, profile, done) {
  profile.accessToken = accessToken
  profile.refreshToken = refreshToken
 

  await readOrCreateWithId('channels', profile.id, {
    channel_name: profile.login,
    refresh_token: refreshToken
  })
  
  done(null, profile)
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get("/auth/twitch", passport.authenticate("twitch"));
app.get("/auth/twitch/callback", passport.authenticate("twitch", { failureRedirect: "/error" }), function(req, res) {
    // Successful authentication, redirect home.



    res.redirect("/success");
    
});
app.get('/success', (req, res) => {
  res.send('Successful login')
})
app.get('/error', (req, res) => {
  res.send('Failure')
})



const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [
    process.env.TWITCH_CHANNEL
  ],
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  }
});

client.connect().catch(console.error);

client.on('message', async (channel, tags, message, self) => {
if (self) return;

if (message.toLowerCase() === '!hello') {
client.say(channel, `@${tags.username}, hey, how are you doing?`);
}

if (message.toLowerCase() === '!present' || message.toLowerCase() === '!출첵') {
 
const newUser: User = new User();
newUser.username = tags.username;
newUser.twitch_user_id = tags['user-id'];
newUser.twitch_uuid = tags.id;

const newChannel: Channel = new Channel();
newChannel.channel_id = channel.slice(1);
newChannel.channel_name = channel.slice(1);
const attendance = await trackAttendance(newChannel, newUser);
  if (attendance > 0) client.say(channel, `@${tags.username}, welcome back for the ${attendance} times!`);
  else client.say(channel, `@${tags.username}, welcome to my channel!`);
}

});


app.listen(PORT, () => console.log('API is running', PORT));