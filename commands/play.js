const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType} = require("@discordjs/voice")
const ytdl = require('ytdl-core-discord');
const ytSearch = require('yt-search');


module.exports = {
  name: 'play',
  description: 'Joins and starts playing a video from Youtube',
  async execute(message, args){
    const voiceChannel = message.member.voice.channel;

    const noPermissions = "You do not have the correct permissions for this command!";
    const noArgs = "You need a second arguement!";

    if (!voiceChannel) return message.channel.send('You need to be in a voice channel to use this command');
    const permissions = voiceChannel.permissionsFor(message.client.user)
    if (!permissions.has('CONNECT')) return message.channel.send(noPermissions);
    if (!permissions.has('SPEAK')) return message.channel.send(noPermissions);
    if (!args.length) return message.channel.send(noArgs);

    const videoFinder = async (query) => {
      const videoResults = await ytSearch(query);
      return (videoResults.videos.length > 1) ? videoResults.videos[0] : null;
    };

    const video = await videoFinder(args.join(' '));


    const VoiceConnection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });


    if (video) {
      const resource = createAudioResource(await ytdl(video.url), {
        inputType: StreamType.Opus
        // filter: 'audioonly',
        // quality: 'highestaudio',
        // inlineVolume: true
      });

      // resource.volume.setVolume(0.2);
      const player = createAudioPlayer();
      VoiceConnection.subscribe(player);
      player.play(resource);

      await message.reply(`:thumbs up: Now playing ***${video.title}***`);
    } else {
      message.channel.send('No videos results found.');
    }

  }
}
