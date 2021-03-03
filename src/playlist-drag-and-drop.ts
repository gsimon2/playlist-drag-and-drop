import { registerSettings } from './module/settings.js';

Hooks.once('init', async function() {
	console.log('playlist-drag-and-drop | Initializing playlist-drag-and-drop');

	// Register custom module settings
	registerSettings();
});

Hooks.on("renderPlaylistDirectory", (app, html: JQuery, data) => {
	if (!game.settings.get('playlist-drag-and-drop', 'enable-drag-and-drop')) {
		return;
	}

	const soundElements = html.find('li.sound.flexrow');
	soundElements.each((index: number, el: HTMLElement) => {
		try {
			const dataSoundId = el.getAttribute('data-sound-id');

			if (!dataSoundId) {
				return;
			}
	
			el.draggable = true;
			el.ondragend = (e: DragEvent) => addSoundToSoundLayer(dataSoundId, e);
		} catch (e) {
			console.error(`playlist-drag-and-drop | Failed to make sound element ${el} draggable. Error: ${e}`);
		}
	});
});

const addSoundToSoundLayer = (dataSoundId: string, e: DragEvent) => {
	const soundPath = getSoundPathFromId(dataSoundId);

	if (!soundPath) {
		console.error(`Could not make dataSoundId ${dataSoundId} to a file path`);
		return;
	}

	var data: AmbientSoundObject = {
        t: "l",
		x: 0,
		y: 0,
        path: soundPath,
        radius: 20,
        easing: true,
        repeat: true,
        volume: 1.0
    };

	convertXYtoCanvas(data, e);
    AmbientSound.create(data);
	canvas.layers[9].activate();
};

const getSoundPathFromId = (soundId: string): string => {
	try {
		const playlistSounds = Array.from(game.playlists.values()).flatMap((playlist: Playlist) => playlist.sounds);
		return playlistSounds.find(soundObject => soundObject._id === soundId).path;
	} catch (e) {
		console.error(`playlist-drag-and-drop | Failed to get sound object from soundId: ${soundId}. Error: ${e}`);
		return '';
	}
};

// Function Credit - https://github.com/cswendrowski/FoundryVTT-Drag-Upload/blob/master/dragupload.js
const convertXYtoCanvas = (data: AmbientSoundObject, event: DragEvent) => {
    const [x, y] = [event.clientX, event.clientY];
    const t = canvas.stage.worldTransform;
    data.x = (x - t.tx) / canvas.stage.scale.x;
    data.y = (y - t.ty) / canvas.stage.scale.y;
};