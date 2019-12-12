'use strict';

const REGEX_BASE64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

module.exports = {
    chars, lookup,

    count(value) {
        let length = value.length * 0.75, p = 0;

        if (value[value.length - 1] === "=") {
            length--;
            if (value[value.length - 2] === "=") {
                length--;
            }
        }
        return length;
    },

    match(value) {
        return value.match(REGEX_BASE64);
    },

    test(value) {
        return REGEX_BASE64.test(value);
    },

    encode(buffer) {
        const bytes = new Uint8Array(buffer);
        let encoded = "";
        for (let idx = 0, length = bytes.length; idx < length; idx += 3) {
            encoded += chars[bytes[idx] >> 2];
            encoded += chars[((bytes[idx] & 3) << 4) | (bytes[idx + 1] >> 4)];
            encoded += chars[((bytes[idx + 1] & 15) << 2) | (bytes[idx + 2] >> 6)];
            encoded += chars[bytes[idx + 2] & 63];
        }

        if ((bytes.length % 3) === 2) {
            encoded = encoded.substring(0, encoded.length - 1) + "=";
        } else if (bytes.length % 3 === 1) {
            encoded = encoded.substring(0, encoded.length - 2) + "==";
        }

        return encoded;
    },

    decode(value) {
        const length = module.exports.count(value);
        let p = 0, encoded1, encoded2, encoded3, encoded4;
        let buffer = new ArrayBuffer(length), bytes = new Uint8Array(buffer);
        for (let idx = 0; idx < value.length; idx += 4) {
            encoded1 = lookup[value.charCodeAt(idx)];
            encoded2 = lookup[value.charCodeAt(idx + 1)];
            encoded3 = lookup[value.charCodeAt(idx + 2)];
            encoded4 = lookup[value.charCodeAt(idx + 3)];

            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return buffer;
    },
};
