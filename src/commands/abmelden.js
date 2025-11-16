import fs from "fs";

export const abmeldenCommand = {
  name: "abmelden",
  description: "Melde dich für einen Zeitraum ab.",
  options: [
    {
      name: "von",
      type: 3,
      required: true,
      description: "Startdatum YYYY-MM-DD",
    },
    {
      name: "bis",
      type: 3,
      required: true,
      description: "Enddatum YYYY-MM-DD",
    },
  ],
};

export async function executeAbmelden(
  interaction,
  storage,
  storageFile,
  updateList,
) {
  const von = interaction.options.getString("von");
  const bis = interaction.options.getString("bis");

  storage.abmeldungen.push({
    user: interaction.user.tag,
    userId: interaction.user.id,
    von,
    bis,
  });

  fs.writeFileSync(storageFile, JSON.stringify(storage, null, 2));

  await updateList();

  await interaction.reply({
    content: "✔ Deine Abmeldung wurde gespeichert.",
    flags: 64,
  });
}
