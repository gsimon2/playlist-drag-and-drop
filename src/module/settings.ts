export const registerSettings = () => {
	// Register any custom module settings here
	game.settings.register('playlist-drag-and-drop', 'enable-drag-and-drop', {
        name: 'Enable drag and drop',
        hint: 'Allows playlist tracks to be dragged onto the sound layer to create sound icons',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    });
};
