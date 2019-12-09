'use strict';

const ƒ_type = require('../index');
const IS_BASE64 = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

module.exports = class ƒ_array_buffer extends ƒ_type {
    constructor(schema, key, input, options) {
        super(schema, key, input, options);
        this.input = ArrayBuffer;
    }

    static evaluate(input, type) {
        return type === 'object' && input instanceof ArrayBuffer
            || type === 'function' && input === ArrayBuffer
            || type === 'string' && IS_BASE64.test(input)
        ;
    }

    static get priority() {
        return 3;
    }

    expose(property) {
        if (property.value === undefined) return property.value;
        return module.exports.base64.decode(property.value);
    }

    flatten(value) {
        if (value === undefined) return value;
        if (typeof value === 'string') return value;
        return module.exports.base64.encode(value);
    }

    validate(value) {
        if (value === undefined) return;
        if (!value instanceof this.input && !(typeof value === 'string' && IS_BASE64.test(value))) {
            throw this.createIncorrectTypeError('ArrayBuffer || base64 || undefined', value);
        }
    }

    toJSON() {
        return this.input.name;
    }
};

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

module.exports.base64 = {
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
        const length = module.exports.base64.count(value);
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
