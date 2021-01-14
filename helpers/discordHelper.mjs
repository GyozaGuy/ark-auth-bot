import Discord from 'discord.js';

const defaultOptions = {
  adminOnly: false,
  caseSensitive: false,
  exactMatch: true,
  requirePrefix: true
};
let client;
let messageProcessors = [];

export async function addRoleToUser(user, roleName) {
  const member = await getMemberFromMentionedUser(user);
  const role = await getRoleByName(roleName);
  member.roles.add(role);
}

export async function getMemberFromMentionedUser(user) {
  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  return guild.members.fetch(user.id);
}

export async function getRoleByName(roleName) {
  const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID);
  const roles = guild.roles.cache.array();
  return roles.find(role => role.name === roleName);
}

export function init() {
  client = new Discord.Client();

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}`);
  });

  client.on('message', message => {
    if (message.author.bot) {
      return;
    }

    messageProcessors.forEach(({ callback, options, regEx }) => {
      if (options.adminOnly && !message.member.hasPermission('ADMINISTRATOR')) {
        return;
      }

      const matches = message.content.match(regEx);

      if (matches) {
        callback({ client, matches, message });
      }
    });
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}

export function onMessage(matcher, callback, messageOptions) {
  const options = { ...defaultOptions, ...messageOptions };
  let regEx = matcher;

  if (matcher instanceof RegExp) {
    let regExSource = regEx.source;

    if (options.requirePrefix && !regExSource.startsWith(process.env.PREFIX)) {
      if (regExSource.startsWith('^')) {
        regExSource = regExSource.substr(1);
      }

      regEx = new RegExp(`${process.env.PREFIX} ${regExSource}`);
    }
  } else {
    let regExString = `${options.requirePrefix ? `${process.env.PREFIX} ` : ''}${matcher}`;

    if (options.exactMatch) {
      regExString = `^${regExString}$`;
    }

    regEx = new RegExp(regExString, options.caseSensitive ? '' : 'i');
  }

  messageProcessors.push({ callback, options, regEx });
}

export async function removeRoleFromUser(user, roleName) {
  const member = await getMemberFromMentionedUser(user);
  const role = await getRoleByName(roleName);
  member.roles.remove(role);
}
