# AWS-optimized Minecraft

This is a collection of files to make it simple to set up a Minecraft server that is optimized for use in the cloud.

## Default actions

The default setup will utilize `netstat` to scan for active TCP connections to 25565 every minute. When there are no connected users, a shutdown will be scheduled 15 minutes into the future. If a user connects within those 15 minutes, the shutdown is cancelled.

Once the server is shut down, the discordbot-server comes into play. After adjusting the variables and adding the bot to your Discord channel, can turn on your Minecraft server with the command `/msc start` and check the status with `/msc status`.

## Warning

Please scope the IAM profile for the Discord bot appropriately, and assign the entire instance an IAM role isntead of hard-coding AWS keys.