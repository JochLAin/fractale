'use strict';

const reset = "\x1b[0m";

const console = Object.assign({}, global.console, {
    color: {
        black: (text) => `\x1b[30m${text}${reset}`,
        blue: (text) => `\x1b[34m${text}${reset}`,
        crimson: (text) => `\x1b[38m${text}${reset}`,
        cyan: (text) => `\x1b[36m${text}${reset}`,
        green: (text) => `\x1b[32m${text}${reset}`,
        magenta: (text) => `\x1b[35m${text}${reset}`,
        red: (text) => `\x1b[31m${text}${reset}`,
        white: (text) => `\x1b[37m${text}${reset}`,
        yellow: (text) => `\x1b[33m${text}${reset}`,
    },
    background: {
        black: (text) => `\x1b[40m${text}${reset}`,
        blue: (text) => `\x1b[44m${text}${reset}`,
        crimson: (text) => `\x1b[48m${text}${reset}`,
        cyan: (text) => `\x1b[46m${text}${reset}`,
        green: (text) => `\x1b[42m${text}${reset}`,
        magenta: (text) => `\x1b[45m${text}${reset}`,
        red: (text) => `\x1b[41m${text}${reset}`,
        white: (text) => `\x1b[47m${text}${reset}`,
        yellow: (text) => `\x1b[43m${text}${reset}`,
    },
    decoration: {
        blink: (text) => `\x1b[5m${text}${reset}`,
        bold: (text) => `\x1b[1m${text}${reset}`,
        dim: (text) => `\x1b[2m${text}${reset}`,
        hidden: (text) => `\x1b[8m${text}${reset}`,
        reverse: (text) => `\x1b[7m${text}${reset}`,
        underline: (text) => `\x1b[4m${text}${reset}`,
    },

    colorize: (text, color, background, ...decorations) => {
        if (color) {
            text = console.color[color](text);
        }
        if (background) {
            text = console.background[background](text);
        }
        for (let index in decorations) {
            text = console.decoration[decorations[index]](text);
        }

        return text;
    }
});

module.exports = console;