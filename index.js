require("dotenv/config")

const commands = require("./config.json")

const users = []

const command1 = []
const command2 = []

let Capitan1 = {}
let Capitan2 = {}

const {
  Client,
  IntentsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
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
    content: `0_0 \n @everyone, Регистрация на турнир открыта! Участников: ${users.length}`,
    components: [buttonRow]
  })

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button
  })

  // Регистрация
  collector.on("collect", async (interaction) => {
    // Регистрация
    if (interaction.customId === "register") {
      // Пользователь уже зарегистрирован
      if (users.some((user) => user.id === interaction.user.id)) {
        // return interaction.reply(
        //   `${interaction.user}, Вы уже были зарегистрированы!`
        // )
      }
      // Success
      else {
        // await interaction.reply(
        //   `${
        //     interaction.user
        //   }, Вы успешно зарегистрировались на турнир! Участники: ${
        //     users.length + 1
        //   }`
        // )
        users.push(interaction.user)
        console.log(users.map((user) => user.username))

        reply.edit({
          content: `0_0 \n @everyone, Регистрация на турнир открыта! Участников: ${users.length}`
        })
      }
    }
    // Отмена регистрации
    if (interaction.customId === "cancel") {
      // Sucess
      if (users.some((user) => user.id === interaction.user.id)) {
        // interaction.reply(
        //   `${interaction.user}, Вы отменили регистрацию! Участники: ${
        //     users.length - 1
        //   }`
        // )

        const index = users.findIndex(
          (users) => users.id === interaction.user.id
        )

        if (index !== -1) {
          users.splice(index, 1)
        }
        console.log(users.map((user) => user.username))
        reply.edit({
          content: `0_0 \n @everyone, Регистрация на турнир открыта! Участников: ${users.length}`
        })
      }
      // else {
      //   return interaction.reply(
      //     `${interaction.user}, Вы не были зарегистрированы!`
      //   )
      // }
    }
  })

  // Если регистрация закончилась - истек таймер
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
  if (message.content !== commands.prefix + commands.commandSelectCapitns)
    return

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

    const Random = new ButtonBuilder()
      .setCustomId("random")
      .setLabel("Случайные команды")
      .setStyle(ButtonStyle.Primary)

    const CapRow = new ActionRowBuilder().addComponents(Cap1, Cap2, Random)

    const reply = await message.reply({
      content: `0_0 \n @everyone, Кто капитаны?`,
      components: [CapRow]
    })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button
    })

    // Action with btns
    collector.on("collect", async (interaction) => {
      // Cap 1
      if (interaction.customId === "cap1") {
        // Пользователь зарегистрирован?
        if (users.some((user) => user.id === interaction.user.id)) {
          Capitan1 = interaction.user
          Cap1.setDisabled(true)
          await reply.edit({
            content: `0_0 \n @everyone, Кто капитаны? Капитан 1 - ${Capitan1}, Капитан 2 -${Capitan2}`
          })
        } else {
          await interaction.reply(
            `${interaction.user}, Вы не были зарегистрированы!`
          )
        }
      }
      // Cap 2
      if (interaction.customId === "cap2") {
        // Пользователь зарегистрирован?
        if (users.some((user) => user.id === interaction.user.id)) {
          Capitan2 = interaction.user
          Cap1.setDisabled(true)
          await reply.edit({
            content: `0_0 \n @everyone, Кто капитаны? Капитан 1 - ${Capitan1}, Капитан 2 -${Capitan2}`
          })
        } else {
          await interaction.reply(
            `${interaction.user}, Вы не были зарегистрированы!`
          )
        }
      }
      // Random
      if (interaction.customId === "random") {
        const shuffled = [...users].sort(() => 0.5 - Math.random())
        shuffled.forEach((user, index) => {
          index % 2 === 0 ? command1.push(user) : command2.push(user)
        })
        await interaction.message.edit(
          "0_0 \n @everyone, Команды распределены!"
        )
      }
    })
  }
  // Error
  else {
    message.reply("Неверное количество участников!")
    return
  }
})
// Случайное распределение

// Show commands
client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (message.content !== commands.prefix + commands.commandDraft) return
  const CommandsEmbed = new EmbedBuilder()
    .setColor("#910000")
    .setTitle("Команды")
    .addFields(
      {
        name: "Команда 1",
        value: command1.map((user) => user.username).join(", "),
        inline: true
      },
      {
        name: "Команда 2",
        value: command2.map((user) => user.username).join(", "),
        inline: true
      }
    )

  await message.reply({embeds: [CommandsEmbed]})
})

// Запуск бота
client.login(process.env.TOKEN)
