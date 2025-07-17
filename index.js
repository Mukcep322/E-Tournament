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
  if (message.content !== "qwe") return

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

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 100_000
  })

  const users = []

  // const filter = (i) => i.user.id === message.author.id

  collector.on("collect", (interaction) => {
    // Регистрация
    if (interaction.customId === "register") {
      // Пользователь уже зарегистрирован
      if (users.some((user) => user.id === interaction.user.id)) {
        return interaction.reply(
          `${interaction.user}, Вы уже были зарегистрированы!`
        )
      } else {
        interaction.reply(
          `${interaction.user}, Вы успешно зарегистрировались на турнир!`
        )
        users.push(interaction.user)
        console.log(users)
      }
    }
    // Отмена регистрации
    if (interaction.customId === "cancel") {
      // Sucess
      if (users.some((user) => user.id === interaction.user.id)) {
        interaction.reply(`${interaction.user}, Вы отменили регистрацию!`)

        const index = users.findIndex(
          (users) => users.id === interaction.user.id
        )

        if (index !== -1) {
          users.splice(index, 1)
        }
      } else {
        return interaction.reply(
          `${interaction.user}, Вы не были зарегистрированы!`
        )
      }
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

client.login(process.env.TOKEN)
