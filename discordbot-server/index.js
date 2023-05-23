// This bot allows you to turn an EC2 instance on to save money

// Import required modules
const { Client, Intents } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const AWS = require("aws-sdk");

// Replace with your Discord bot token, AWS access key, and secret access key.
const token = "";
const INSTANCE_ID = "";
const GUILD_ID = "";
const CLIENT_ID = "";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Configure AWS SDK
AWS.config.update({
  region: ""
});

const ec2 = new AWS.EC2();

const startInstance = async () => {
  const params = {
    InstanceIds: [INSTANCE_ID],
  };
  try {
    const result = await ec2.startInstances(params).promise();
    return result.StartingInstances[0].CurrentState.Name;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};

const getInstanceStatus = async () => {
  const params = {
    InstanceIds: [INSTANCE_ID],
  };
  try {
    const result = await ec2.describeInstances(params).promise();
    const instance = result.Reservations[0].Instances[0];
    return instance.State.Name;
  } catch (error) {
    console.error(error);
    return "Error";
  }
};

const commands = [
    new SlashCommandBuilder()
      .setName("msc")
      .setDescription("Control the EC2 instance")
      .addSubcommand((subcommand) =>
        subcommand.setName("start").setDescription("Start the EC2 instance")
      )
      .addSubcommand((subcommand) =>
        subcommand.setName("status").setDescription("Get the current status of the EC2 instance")
      ),
  ].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Successfully registered slash commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.once("ready", () => {
  console.log("Bot is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "msc") {
    if (interaction.options.getSubcommand() === "start") {
      const status = await startInstance();

      if (status === "pending") {
        await interaction.reply("Start command successfully sent");
      } else {
        await interaction.reply(`Error: instance could not be started. Current state: ${status}`);
      }
    } else if (interaction.options.getSubcommand() === "status") {
      const status = await getInstanceStatus();
      
      if (status === "Error") {
        await interaction.reply("Error: Unable to fetch the current status of the EC2 instance.");
      } else {
        await interaction.reply(`Current status of instance: ${status}`);
      }
    }
  }
});

client.login(token);