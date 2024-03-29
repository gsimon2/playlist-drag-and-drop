import constants from '../constants.js';
import { registerSettings } from './settings.js';

var clientX = 0;
var clientY = 0;

Hooks.once('init', async function() {
	console.log('playlist-drag-and-drop | Initializing playlist-drag-and-drop');

	// Register custom module settings
	registerSettings();

	// Handle firefox not populating client coordinates on drag events
	document.ondragover = (e) => {clientX = e.clientX; clientY = e.clientY;};
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
			el.ondragstart = (e) => checkHotKeyRequirements(e);
			el.ondragend = (e) => addSoundToSoundLayer(dataSoundId, e);
		} catch (e) {
			console.error(`playlist-drag-and-drop | Failed to make sound element ${el} draggable. Error: ${e}`);
		}
	});
});

const checkHotKeyRequirements = (e) => {
	if (game.settings.get('playlist-drag-and-drop', 'require-hotkey')) {
		const hotkey = constants.hotkeyOptions[game.settings.get('playlist-drag-and-drop', 'hotkey')];

		switch (hotkey) {
			case constants.hotkeyOptions.CTRL:
				return e.ctrlKey && !e.altKey;
			case constants.hotkeyOptions.ALT:
				return e.altKey && !e.ctrlKey;
			case constants.hotkeyOptions.CTRLALT:
				return e.ctrlKey && e.altKey;
			default:
				return false;
		}
	}

	return true;
};

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
	canvas.scene.createEmbeddedDocuments('AmbientSound', [data], {});
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
    const [x, y] = [event.clientX || clientX, event.clientY || clientY];
    const t = canvas.stage.worldTransform;
    data.x = (x - t.tx) / canvas.stage.scale.x;
    data.y = (y - t.ty) / canvas.stage.scale.y;
};