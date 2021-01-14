import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { addRoleToUser, init, onMessage, removeRoleFromUser } from './helpers/discordHelper.mjs';

dotenv.config();
init();

const authServerUrl = `${process.env.AUTH_SERVER_URL}:${process.env.AUTH_SERVER_PORT}`;

onMessage(
  /(allow|deny) (.+)/,
  async ({ matches, message }) => {
    const mentions = message.mentions.users.array();

    if (!mentions.length) {
      message.channel.send('Please mention the player you want to update the status for!');
      return;
    }

    const [, action, rest] = matches;
    const data = {
      allowedOnServer: action === 'allow'
    };

    const [, steamId] = rest.match(/\s(\d{17})$/) || [];

    if (steamId) {
      data.steamId = steamId;
    }

    const response = await fetch(
      `${authServerUrl}/players/${mentions[0].username}:${mentions[0].discriminator}`,
      {
        body: JSON.stringify(data),
        headers: {
          'Auth-Secret': process.env.AUTH_SECRET,
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    );
    const json = await response.json();

    if (process.env.SERVER_ACCESS_ROLE) {
      if (action === 'allow') {
        addRoleToUser(mentions[0], process.env.SERVER_ACCESS_ROLE);
      } else {
        removeRoleFromUser(mentions[0], process.env.SERVER_ACCESS_ROLE);
      }
    }

    message.channel.send(json.message);
  },
  { adminOnly: true }
);

onMessage(
  /delete/,
  async ({ message }) => {
    const mentions = message.mentions.users.array();

    if (!mentions.length) {
      message.channel.send('Please mention the player you want to update the status for!');
      return;
    }

    const response = await fetch(
      `${authServerUrl}/players/${mentions[0].username}:${mentions[0].discriminator}`,
      {
        headers: {
          'Auth-Secret': process.env.AUTH_SECRET
        },
        method: 'DELETE'
      }
    );
    const json = await response.json();

    if (process.env.SERVER_ACCESS_ROLE) {
      removeRoleFromUser(mentions[0], process.env.SERVER_ACCESS_ROLE);
    }

    message.channel.send(json.message);
  },
  { adminOnly: true }
);

onMessage(/status/, async ({ message }) => {
  const mentions = message.mentions.users.array();
  let user = message.member.user;

  if (mentions.length) {
    user = mentions[0];
  }

  const response = await fetch(`${authServerUrl}/players/${user.username}:${user.discriminator}`);
  const playerInfo = await response.json();

  if (response.status === 400) {
    message.channel.send(`No data found for ${user}`);
  } else {
    message.channel.send(
      `Status for ${user}: ${playerInfo.allowedOnServer ? 'Allowed ✅' : 'Denied ❌'}`
    );
  }
});
