# ark-auth-bot

A basic Discord bot to use with [ark-auth-server](https://github.com/GyozaGuy/ark-auth-server).

# Installation

```shell
git clone https://github.com/GyozaGuy/ark-auth-bot
cd ark-auth-bot
npm install
```

# Configuration

Copy `.env.template` to `.env`. And modify the contents to match your environment.

## .env file values

- `AUTH_SECRET`: A value that matches the `AUTH_SECRET` value used by the auth server
- `AUTH_SERVER_PORT`: The port used by the auth server
- `AUTH_SERVER_URL`: The URL used by the auth server
- `DISCORD_BOT_TOKEN`: The token for the Discord bot that will be used for this functionality
- `DISCORD_GUILD_ID`: The guild ID of your Discord server
- `PREFIX`: The prefix to be used before bot messages
- `SERVER_ACCESS_ROLE` (optional): A role to add and remove from users to indicate server access

## Sample .env

```shell
AUTH_SECRET=somesecretvalue
AUTH_SERVER_PORT=3000
AUTH_SERVER_URL=http://localhost
DISCORD_BOT_TOKEN=your-discord-bot-token-here
DISCORD_GUILD_ID=your-discord-guild-id-here
PREFIX=~auth
SERVER_ACCESS_ROLE=server-access
```

# Starting the bot

```shell
npm start
```

# Bot commands

These examples assume the `PREFIX` is set to `~auth`.

**Adding a player to the database**

This command also allows the player access to the server automatically.

```
~auth allow @PlayerName 12345678987654321
```

**Authorizing a player**

```
~auth allow @PlayerName
```

**Denying server access**

```
~auth deny @PlayerName
```

**Checking a player's server access status**

```
~auth status @PlayerName
```

If run without tagging a player, `~auth status` will check your own status.

**Deleting a player from the database**

```
~auth delete @PlayerName
```
