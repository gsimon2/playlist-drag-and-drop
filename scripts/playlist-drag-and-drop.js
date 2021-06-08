import { registerSettings } from './settings.js';

Hooks.once('init', async function() {
	console.log('playlist-drag-and-drop | Initializing playlist-drag-and-drop');

	// Register custom module settings
	registerSettings();
});

Hooks.on("renderPlaylistDirectory", (app, html, data) => {
	const soundElements = html.find('li.sound.flexrow');
	soundElements.each((index, el) => {
		try {
			const dataSoundId = el.getAttribute('data-sound-id');

			if (!dataSoundId) {
				return;
			}
	
			el.draggable = true;
			el.ondragend = (e) => addSoundToSoundLayer(dataSoundId, e);
		} catch (e) {
			console.error(`playlist-drag-and-drop | Failed to make sound element ${el} draggable. Error: ${e}`);
		}
	});
});

const addSoundToSoundLayer = (dataSoundId, e) => {
	const soundPath = getSoundPathFromId(dataSoundId);

	if (!soundPath) {
		console.error(`Could not make dataSoundId ${dataSoundId} to a file path`);
		return;
	}

	var data = {
        t: "l",
		x: 0,
		y: 0,
        path: soundPath,
        radius: game.settings.get('playlist-drag-and-drop', 'default-radius'),
        easing: game.settings.get('playlist-drag-and-drop', 'enable-easing'),
        repeat: game.settings.get('playlist-drag-and-drop', 'enable-repeat'),
        volume: game.settings.get('playlist-drag-and-drop', 'default-volume')
    };

	convertXYtoCanvas(data, e);
    AmbientSound.create(data);
	canvas.layers[8].activate();
};

const getSoundPathFromId = (soundId) => {
	try {
		const playlistSounds = Array.from(game.playlists.values()).flatMap((playlist) => Array.from(playlist.sounds.values()));
		return playlistSounds.find(playlistSound => playlistSound.id === soundId).path;
	} catch (e) {
		console.error(`playlist-drag-and-drop | Failed to get sound object from soundId: ${soundId}. Error: ${e}`);
		return '';
	}
};

const convertXYtoCanvas = (data, event) => {
    const [x, y] = [event.clientX, event.clientY];
    const t = canvas.stage.worldTransform;
    data.x = (x - t.tx) / canvas.stage.scale.x;
    data.y = (y - t.ty) / canvas.stage.scale.y;
};