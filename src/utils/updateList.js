import fs from "fs";

export async function updateListMessage(client, storage, storageFile) {
  const channel = await client.channels.fetch(process.env.LIST_CHANNEL);

  const today = new Date();

  // Abgelaufene Abmeldungen löschen
  storage.abmeldungen = storage.abmeldungen.filter((a) => {
    return new Date(a.bis + "T23:59:59") >= today;
  });

  // Text für die Nachricht erstellen
  let text = "📌 **Aktuelle Abmeldungen:**\n";
  if (storage.abmeldungen.length === 0) {
    text += "> Keine Abmeldungen vorhanden.";
  } else {
    storage.abmeldungen.forEach((a) => {
      text += `• **${a.user}** – ${a.von} bis ${a.bis}\n`;
    });
  }

  let msg;
  try {
    msg = await channel.messages.fetch(storage.listMessageId);
    await msg.edit(text);
  } catch {
    msg = await channel.send(text);
    storage.listMessageId = msg.id;
  }

  // Speicher aktualisieren
  fs.writeFileSync(storageFile, JSON.stringify(storage, null, 2));
}
