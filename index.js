
const { Client, ActivityType  , 
    GatewayIntentBits,SlashCommandBuilder, 
    EmbedBuilder,REST, Routes,PermissionsBitField   ,ContextMenuCommandBuilder,ButtonStyle, ActionRowBuilder ,StringSelectMenuBuilder, StringSelectMenuOptionBuilder,ButtonBuilder ,Events, ModalBuilder , TextInputBuilder, TextInputStyle, Message} = require('discord.js');
    
    const info = require('./config.js')
    const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  presence: {
    activities: [{
      type: ActivityType.Custom, 
      name: info.name, 
      state: info.state,
    }],
  }
  });


 

  
  const fs = require('fs');
  client.login(info.token).catch(error => console.log(`
  You forgot to write a [token]`))
  const private = info.private;
const servers = info.servers;


client.on('guildCreate',async (guild) =>{
  if(private == true){
      if (servers.includes (guild.id)) return;
      else{
          guild.leave();
      }
         }
         else if(private == false){
          return;
      }
  })

  client.on(`ready`, () => {
  client.guilds.cache.forEach(guild => {
if(private == true){
  if (servers.includes (guild.id)) return;
  else{
      guild.leave();
  }
     }
     else if(private == false){
      return;
  }
  });
  }); 

client.on('ready', () => {
    console.log(`${client.user.username} Is Online !`);
  });


  client.on("ready", () => {
    const cmdsg = [];



    let reports23 = new SlashCommandBuilder()
    .setName("report_channel")
    .setDescription("set report channel")
    .addChannelOption(p =>
        p.setName("select_r_channel")

                    .setDescription("choose channel  to reports"))
    let reports12 = new SlashCommandBuilder()
    .setName("report")
    .setDescription("report to member or player")
    cmdsg.push(reports23);
    cmdsg.push(reports12);
    const rest = new REST({version: 9}).setToken(info.token);

    try {

    rest.put(
    Routes.applicationCommands(client.user.id),
    { body: cmdsg },
    )
} catch (error) {
    console.error("error")
    }
    })






    client.on("interactionCreate", async message => {
        if (!message.isCommand()) return;

  const { commandName } = message;
if (commandName === 'report_channel') {
  let mm = message.options.getChannel("select_r_channel");
  if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return;
  } 
  else{
    if (!mm){
      message.reply({content: `please mention channel`, ephemeral: true})
    }
    else{
      let data = fs.readFileSync('reports.json');
      let jsonData = JSON.parse(data);
      jsonData["reports_"+message.guild.id] = { info : {channel: mm.id} };
      fs.writeFileSync('reports.json', JSON.stringify(jsonData));
      message.reply({content: `done select`, ephemeral: true})
    }
  }
  }
  if(commandName === 'report'){
    const modal = new ModalBuilder()
			.setCustomId('myModal_reportmodalr')
			.setTitle('report to player');
      const favoriteColorInput = new TextInputBuilder()
			.setCustomId('report_name')
      .setMaxLength(40)
			.setLabel("the name of the player or member") 
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('report_reason')
			.setLabel(" type report reason")
      .setMaxLength(999)
			.setStyle(TextInputStyle.Short);
      
 
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
		modal.addComponents(firstActionRow, secondActionRow);
    message.showModal(modal)
  }
})
client.on(Events.InteractionCreate, interaction => {
  if (interaction.customId === 'myModal_reportmodalr') {
	if (!interaction.isModalSubmit()) return;
	const favoriteColor = interaction.fields.getTextInputValue('report_name');
	const hobbies = interaction.fields.getTextInputValue('report_reason');
     let data = fs.readFileSync('reports.json');
      let jsonData = JSON.parse(data);
      let psps1 =  jsonData["reports_"+interaction.guild.id]
    if(!psps1){
      interaction.reply({content: `the owners don't set this command`, ephemeral: true})
    }
    else{
      let chwlcome =  jsonData["reports_"+interaction.guild.id]
      const Embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('** new report **')
      .setDescription(`
      name the member: \`${favoriteColor}\`
      report reason: \`${hobbies}\`
      `)
      .setFooter({ text: `this report come from '${interaction.user.username}' `});
      interaction.reply({content: `done report it`, ephemeral: true})
      client.channels.cache.get(chwlcome.info.channel).send({ embeds: [Embed] })
    }
  }
});
client.on("messageCreate",message=>{
  if(message.content.startsWith("#help")){
    if(message.author.bot || message.channel.type == "dm") return message.reply("Server only commands")
    const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('**help command**')
    .setDescription(`
    **
    \`/report_channel\` : set reports channel
    \`/report\` : report to member
    **
    
    `)
    .setTimestamp()
    .setFooter({ text: 'by mrlejen'});
  
  message.channel.send({ embeds: [embed] });
  }
  })
