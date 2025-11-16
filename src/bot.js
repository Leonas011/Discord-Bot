import fs from "fs";
import path from "path";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { abmeldenCommand, executeAbmelden } from "./commands/abmelden.js";
import { updateListMessage } from "./utils/updateList.js";

dotenv.config();

// Absoluter Pfad zu storage.json in /src
const storageFile = path.join("src", "storage.json");

// Storage laden oder neu erstellen
let storage;
try {
  storage = JSON.parse(fs.readFileSync(storageFile, "utf8"));
} catch {
  storage = { abmeldungen: [], listMessageId: null };
  fs.writeFileSync(storageFile, JSON.stringify(storage, null, 2));
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Ready Event v15
client.once("ready", async () => {
  console.log(`🔥 Bot online als ${client.user.tag}`);

  // Slash Commands registrieren
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(client.user.id, process.env.GUILD),
    { body: [abmeldenCommand] },
  );
  console.log("✔ Slash Commands registriert");

  // Liste beim Start aktualisieren
  await updateListMessage(client, storage, storageFile);
});

// Command Handling
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  console.log("Command ausgelöst:", interaction.commandName);

  if (interaction.commandName === "abmelden") {
    await executeAbmelden(interaction, storage, storageFile, async () => {
      await updateListMessage(client, storage, storageFile);
    });
  }
});

client.login(process.env.TOKEN);
