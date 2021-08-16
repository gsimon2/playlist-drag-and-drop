import constants from '../constants.js'; 

export const registerSettings = () => {
    game.settings.register('playlist-drag-and-drop', 'enable-easing', {
        name: 'Enable sound easing',
        hint: 'Enable ambient sound easing property',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register('playlist-drag-and-drop', 'enable-repeat', {
        name: 'Enable sound repeat',
        hint: 'Enable ambient sound repeat property',
        scope: 'world',
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register('playlist-drag-and-drop', 'default-radius', {
        name: 'Default sound radius',
        hint: 'Default value for ambient sound radius property',
        scope: 'world',
        config: true,
        default: 20,
        type: Number,
    });

    game.settings.register('playlist-drag-and-drop', 'default-volume', {
        name: 'Default sound volume',
        hint: 'Default value for ambient sound valume property [0 - 1.0]',
        scope: 'world',
        config: true,
        default: 1.0,
        type: Number,
    });

    game.settings.register('playlist-drag-and-drop', 'require-hotkey', {
        name: `Require key to enable drag actions`,
        hint: `Require a hotkey to be held to enable the the dragging of a sound track onto a scene`,
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register('playlist-drag-and-drop', 'hotkey', {
        name: `Hotkey`,
        hint: `Sets the hotkey that enables drag actions, if required.`,
        scope: 'world',
        config: true,
        default: constants.hotkeyOptions.CTRL,
        type: String,
        choices: constants.hotkeyOptions
    });
};
