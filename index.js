require("dotenv/config")

const {
  Client,
  IntentsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType
} = require("discord.js")

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

client.on("ready", () => {
  console.log(`${client.user.username} is ready`)
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.content !== "Qwe") return

  const RegisterButton = new ButtonBuilder()
    .setCustomId("register")
    .setLabel("Register")
    .setStyle(ButtonStyle.Primary)

  const CancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Danger)

  const buttonRow = new ActionRowBuilder().addComponents(
    RegisterButton,
    CancelButton
  )

  const reply = await message.reply({
    content: "Регистрация на турнир открыта",
    components: [buttonRow]
  })

  const filter = (i) => i.user.id === message.author.id

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    filter,
    time: 100_000
  })

  collector.on("collect", (interaction) => {
    if (interaction.customId === "register") {
      interaction.reply("Вы успешно зарегистрировались на турнир!")
    }
    if (interaction.customId === "cancel") {
      interaction.reply("Вы стали капитаном!")
    }
  })

  collector.on("end", () => {
    RegisterButton.setDisabled(true)
    CancelButton.setDisabled(true)

    reply.edit({
      content: "Регистрация на турнир закрыта",
      components: [buttonRow]
    })
  })
})

client.login(
  "MTM5NDczOTQwMDAwNDQ3Mjk5Mw.Gc1S_S.rVpiPOkLQi_DXR0j84JWWBD_cEU8enLIUbrHVg"
)
