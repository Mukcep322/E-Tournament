require("dotenv/config")

const commands = require("./config.json")

const {
  Client,
  IntentsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  PresenceUpdateStatus
} = require("discord.js")

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

// Сообщение об успешном запуске бота
client.on("ready", () => {
  console.log(`${client.user.username} is ready`)
  client.user.setStatus(PresenceUpdateStatus.DoNotDisturb)
})

const users = []
// Команда открытия регистрации
client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.content !== commands.prefix + commands.commandRegister) return

  const RegisterButton = new ButtonBuilder()
    .setCustomId("register")
    .setLabel("Зарегистрироваться")
    .setStyle(ButtonStyle.Primary)

  const CancelButton = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Отмена регистрации")
    .setStyle(ButtonStyle.Danger)

  const buttonRow = new ActionRowBuilder().addComponents(
    RegisterButton,
    CancelButton
  )

  const reply = await message.reply({
    content: `0_0 \n @everyone, Регистрация на турнир открыта`,
    components: [buttonRow]
  })

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button
  })

  collector.on("collect", async (interaction) => {
    // Регистрация
    if (interaction.customId === "register") {
      // Пользователь уже зарегистрирован
      if (users.some((user) => user.id === interaction.user.id)) {
        return interaction.reply(
          `${interaction.user}, Вы уже были зарегистрированы!`
        )
      }
      // Success
      else {
        await interaction.reply(
          `${
            interaction.user
          }, Вы успешно зарегистрировались на турнир! Участники: ${
            users.length + 1
          }`
        )
        users.push(interaction.user)
        console.log(users.map((user) => user.username))
      }
    }
    // Отмена регистрации
    if (interaction.customId === "cancel") {
      // Sucess
      if (users.some((user) => user.id === interaction.user.id)) {
        interaction.reply(
          `${interaction.user}, Вы отменили регистрацию! Участники: ${
            users.length - 1
          }`
        )

        const index = users.findIndex(
          (users) => users.id === interaction.user.id
        )

        if (index !== -1) {
          users.splice(index, 1)
        }
        console.log(users.map((user) => user.username))
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

// драфт капитанов
client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.content !== commands.commandSelectCapitns) return

  // Success
  if (users.length < 10) {
    // Count of members
    const nicknames = users.map((user) => user).join(`, `)
    message.reply(`X_X \n**Список участников:**\n${nicknames}`)

    // Button Capitans
    const Cap1 = new ButtonBuilder()
      .setCustomId("cap1")
      .setLabel("Капитан 1")
      .setStyle(ButtonStyle.Success)

    const Cap2 = new ButtonBuilder()
      .setCustomId("cap2")
      .setLabel("Капитан 2")
      .setStyle(ButtonStyle.Danger)

    const CapRow = new ActionRowBuilder().addComponents(Cap1, Cap2)

    const reply = await message.reply({
      content: `0_0 \n @everyone, Кто капитаны?`,
      components: [CapRow]
    })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button
    })

    // Action with btns
    collector.on("collect", (interaction) => {
      // Cap 1
      if (interaction.customId === "cap1") {
        // Пользователь зарегистрирован?
        if (users.some((user) => user.id === interaction.user.id)) {
          //
        } else {
          interaction.reply(`${interaction.user}, Вы не были зарегистрированы!`)
        }
      }
      // Cap 2
      if (interaction.customId === "cap2") {
        Capitan2 = interaction.user
        console.log(Capitan2.username)
      }
    })
  }

  // Error
  else {
    message.reply("Неверное количество участников!")
    return
  }
})

client.on("messageCreate", async (message) => {
  if (message.content === commands.commandDraft) {
    const members = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    const shuffled = [...members].sort(() => Math.random() - 0.5)

    const command1 = shuffled.slice(0, 5)
    const command2 = shuffled.slice(5)

    console.log(`Команда 1 (${command1.length}):`, command1)
    console.log(`Команда 2 (${command2.length}):`, command2)
  }
})

// Запуск бота
client.login(process.env.TOKEN)
