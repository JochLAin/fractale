'use strict';

const percent = (value) => {
    if (typeof value === 'string' && value.indexOf('%') === value.length -1) {
        value = Number(value.slice(0, -1)) / 100;
    }
    return value ? Number(value) : 0;
};

/**
 * @author Jocelyn Faihy <jocelyn@faihy.fr>
 */
const Color = module.exports = class Color {
    constructor(props, model) {
        this.initialize();
        if (props) this.parse(props, model);
    }

    get(key) {
        const keys = ['red', 'r', 'green', 'g', 'blue', 'b', 'hue', 'h', 'saturation', 's', 'lightness', 'l', 'alpha', 'a'];
        if (keys.includes(key)) {
            return this[key];
        } else if (key === 'hex') {
            return this.hex();
        } else if (key === 'hsl') {
            return this.hsl();
        } else if (key === 'rgb') {
            return this.rgb();
        }
    }

    set(key, value) {
        if (['red', 'r'].includes(key)) {
            this.red = value;
        }
        if (['green', 'g'].includes(key)) {
            this.green = value;
        }
        if (['blue', 'b'].includes(key)) {
            this.blue = value;
        }
        if (['hue', 'h'].includes(key)) {
            this.hue = value;
        }
        if (['saturation', 's'].includes(key)) {
            this.saturation = value;
        }
        if (['lightness', 'l'].includes(key)) {
            this.lightness = value;
        }
        if (['alpha', 'a'].includes(key)) {
            this.alpha = value;
        }
        return this;
    }

    hex() {
        let hex = '#';
        hex += (this.red || 0).toString(16).padStart(2, '0').toUpperCase();
        hex += (this.green || 0).toString(16).padStart(2, '0').toUpperCase();
        hex += (this.blue || 0).toString(16).padStart(2, '0').toUpperCase();
        if (this.alpha !== 1) {
            hex += Math.floor(this.alpha * 255).toString(16).padStart(2, '0').toUpperCase();
        }
        return hex;
    }

    hsl() {
        if (this.alpha !== 1) {
            return `hsla(${this.hue}, ${Math.round((this.saturation || 0) * 100)}%, ${Math.round((this.lightness || 0) * 100)}%, ${Math.round(this.alpha * 100)}%)`;
        }
        return `hsl(${(this.hue || 0)}, ${Math.round((this.saturation || 0) * 100)}%, ${Math.round((this.lightness || 0) * 100)}%)`;
    }

    rgb() {
        if (this.alpha !== 1) {
            return `rgba(${(this.red || 0)}, ${(this.green || 0)}, ${(this.blue || 0)}, ${Math.round(this.alpha * 100)}%)`;
        }
        return `rgb(${(this.red || 0)}, ${(this.green || 0)}, ${(this.blue || 0)})`;
    }

    yiq() {
        return (((this.red * 299) + (this.green * 587) + (this.blue * 114)) / 1000) >= Color.YIQ_THRESHOLD;
    }

    initialize() {
        Object.defineProperty(this, 'red', {
            get() { return this._red },
            set(red) {
                this._red = percent(red);
                if (this.auto_recompute) {
                    this.computeHSL();
                }
            },
        });
        Object.defineProperty(this, 'blue', {
            get() { return this._blue },
            set(blue) {
                this._blue = percent(blue);
                if (this.auto_recompute) {
                    this.computeHSL();
                }
            },
        });
        Object.defineProperty(this, 'green', {
            get() { return this._green },
            set(green) {
                this._green = percent(green);
                if (this.auto_recompute) {
                    this.computeHSL();
                }
            },
        });
        Object.defineProperty(this, 'alpha', {
            get() { return this._alpha },
            set(alpha) { this._alpha = percent(alpha); },
        });
        Object.defineProperty(this, 'hue', {
            get() { return this._hue },
            set(hue) {
                this._hue = percent(hue);
                if (this.auto_recompute) {
                    this.computeRGB();
                }
            },
        });
        Object.defineProperty(this, 'saturation', {
            get() { return this._saturation },
            set(saturation) {
                this._saturation = percent(saturation);
                if (this.auto_recompute) {
                    this.computeRGB();
                }
            },
        });
        Object.defineProperty(this, 'lightness', {
            get() { return this._lightness },
            set(lightness) {
                this._lightness = percent(lightness);
                if (this.auto_recompute) {
                    this.computeRGB();
                }
            },
        });

        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.hue = 0;
        this.saturation = 0;
        this.lightness = 0;
        this.alpha = 1;
        this.auto_recompute = true;
    }

    parse(data, model) {
        this.auto_recompute = false;
        switch (typeof data) {
            case 'number':
                data &= 0xFFFFFF;
                this.red = (data >> 16) & 0xFF;
                this.green = (data >> 8) & 0xFF;
                this.blue = data & 0xFF;
                this.computeHSL();
                break;
            case 'string':
                if (data.match(Color.RGB_REGEX)) {
                    const match = data.match(Color.RGB_REGEX);
                    this.red = match[1];
                    this.green = match[2];
                    this.blue = match[3];
                    if (match[4]) {
                        this.alpha = match[4];
                    }
                    this.computeHSL();
                } else if (data.match(Color.HSL_REGEX)) {
                    const match = data.match(Color.HSL_REGEX);
                    this.hue = match[1];
                    this.saturation = match[2];
                    this.lightness = match[3];
                    if (match[4]) {
                        this.alpha = match[4];
                    }
                    this.computeRGB();
                } else if (data.match(Color.HEX_REGEX)) {
                    const match = data.match(Color.HEX_REGEX);
                    if (match[1].length === 3) {
                        this.red = parseInt(match[1].charAt(0), 16) * 0x11;
                        this.green = parseInt(match[1].charAt(1), 16) * 0x11;
                        this.blue = parseInt(match[1].charAt(2), 16) * 0x11;
                        this.computeHSL();
                    } else if (match[1].length === 4) {
                        this.red = parseInt(match[1].charAt(0), 16) * 0x11;
                        this.green = parseInt(match[1].charAt(1), 16) * 0x11;
                        this.blue = parseInt(match[1].charAt(2), 16) * 0x11;
                        this.alpha = parseInt(match[1].charAt(3), 16) * 0x11;
                        this.computeHSL();
                    } else if (match[1].length === 6) {
                        this.red = parseInt(match[1].substr(0, 2), 16);
                        this.green = parseInt(match[1].substr(2, 2), 16);
                        this.blue = parseInt(match[1].substr(4, 2), 16);
                        this.computeHSL();
                    } else if (match[1].length === 8) {
                        this.red = parseInt(match[1].substr(0, 2), 16);
                        this.green = parseInt(match[1].substr(2, 2), 16);
                        this.blue = parseInt(match[1].substr(4, 2), 16);
                        this.alpha = parseInt(match[1].substr(6, 2), 16);
                        this.computeHSL();
                    }
                } else {
                    throw new Error(`Unknown format for "${data}"`);
                }
                break;
            case 'object':
                if (data instanceof Color) {
                    this.color = data.color;
                } else if (Array.isArray(data)) {
                    switch (model) {
                        case 'hsl':
                        case 'hsla':
                            this.hue = data[0];
                            this.saturation = data[1];
                            this.lightness = data[2];
                            if (data[3]) {
                                this.alpha = data[3];
                            }
                            this.computeRGB();
                            break;
                        case 'rgb':
                        case 'rgba':
                            this.red = data[0];
                            this.green = data[1];
                            this.blue = data[2];
                            if (data[3]) {
                                this.alpha = data[3];
                            }
                            this.computeHSL();
                            break;
                        default:
                            for (const index in data) {
                                this.red = data[0];
                                this.blue = data[1];
                                this.green = data[2];
                                if (data.length === 4) this.alpha = data[3];
                                if (data.length >= 6) this.hue = data[3];
                                if (data.length >= 6) this.saturation = data[4];
                                if (data.length >= 6) this.lightness = data[5];
                                if (data.length >= 7) this.alpha = data[6];
                            }
                    }
                } else {
                    const keys = Object.keys(data);
                    if (['red', 'r', 'green', 'g', 'blue', 'b'].some(key => keys.includes(key))) {
                        if (['red', 'r'].some(key => keys.includes(key))) {
                            this.red = data.red || data.r;
                        }
                        if (['green', 'g'].some(key => keys.includes(key))) {
                            this.green = data.green || data.g;
                        }
                        if (['blue', 'b'].some(key => keys.includes(key))) {
                            this.blue = data.blue || data.b;
                        }
                        this.computeHSL();
                    }
                    if (['hue', 'h', 'saturation', 's', 'lightness', 'l'].some(key => keys.includes(key))) {
                        if (['hue', 'h'].some(key => keys.includes(key))) {
                            this.hue = data.hue || data.h;
                        }
                        if (['saturation', 's'].some(key => keys.includes(key))) {
                            this.saturation = data.saturation || data.s;
                        }
                        if (['lightness', 'l'].some(key => keys.includes(key))) {
                            this.lightness = data.lightness || data.l;
                        }
                        this.computeRGB();
                    }
                    if (['alpha', 'a'].some(key => keys.includes(key))) {
                        this.alpha = data.alpha || data.a;
                    }
                }
                break;
            default:
                this.red = 0;
                this.green = 0;
                this.blue = 0;
                this.computeHSL();
                break;
        }
        this.auto_recompute = true;
    }

    computeRGB() {
        const hue = this.hue / 360;
        const { saturation, lightness } = this;
        let red, green, blue;

        if (saturation === 0) {
            red = green = blue = lightness;
        } else {
            const calculate = (tmp_1, tmp_2, tmp_color) => {
                if (tmp_color < 0) {
                    tmp_color += 1;
                }
                if (tmp_color > 1) {
                    tmp_color -= 1;
                }

                if (tmp_color < 1 / 6) {
                    return tmp_2 + (tmp_1 - tmp_2) * 6 * tmp_color;
                }
                if (tmp_color < 1 / 2) {
                    return tmp_1;
                }
                if (tmp_color < 2 / 3) {
                    return tmp_2 + (tmp_1 - tmp_2) * (2 / 3 - tmp_color) * 6;
                }
                return tmp_2;
            };

            let tmp_1;
            if (lightness < 0.5) {
                tmp_1 = lightness * (1 + saturation);
            } else {
                tmp_1 = lightness + saturation - lightness * saturation;
            }
            const tmp_2 = 2 * lightness - tmp_1;

            red = calculate(tmp_1, tmp_2, hue + 1 / 3);
            green = calculate(tmp_1, tmp_2, hue);
            blue = calculate(tmp_1, tmp_2, hue - 1 / 3);
        }

        this.auto_recompute = false;
        this.red = Math.round(red * 255);
        this.green = Math.round(green * 255);
        this.blue = Math.round(blue * 255);
        this.auto_recompute = true;
    }

    computeHSL() {
        const red = this.red / 255;
        const green = this.green / 255;
        const blue = this.blue / 255;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const lightness = (max + min) / 2;
        let hue, saturation;

        if (max === min) {
            hue = saturation = 0;
        } else {
            if (lightness < 0.5) {
                saturation = (max - min) / (max + min);
            } else {
                saturation = (max - min) / (2 - max - min);
            }
            switch (max) {
                case red:
                    hue = (green - blue) / (max - min);
                    break;
                case green:
                    hue = 2 + (blue - red) / (max - min);
                    break;
                case blue:
                    hue = 4 + (red - green) / (max - min);
                    break;
            }
            hue *= 60;
            hue = hue < 0 ? hue + 360 : hue;
        }

        this.auto_recompute = false;
        this.hue = Math.round(hue);
        this.saturation = Number(saturation.toFixed(2));
        this.lightness = Number(lightness.toFixed(2));
        this.auto_recompute = true;
    }
};

Color.YIQ_THRESHOLD = 150;

Color.RGB_REGEX = /^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\);?$/i;
Color.HSL_REGEX = /^hsla?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+%?)\s*[,\s]\s*([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?)\s*)?\);?$/i;
Color.HEX_REGEX = /^#([0-9a-f]+)$/i;
Color.test = function test(value) {
    const _typeof = typeof value;
    if (_typeof === 'number') return true;
    if (_typeof === 'string') {
        return Color.RGB_REGEX.test(value)
            || Color.HSL_REGEX.test(value)
            || Color.HEX_REGEX.test(value)
        ;
    }
    return _typeof === 'object';
};

Color.create = function create(props, model) {
    return new Color(props, model);
};

Color.fromHex = function fromHex(props, model) {
    return Color.create(props, model);
};

Color.fromRGB = function fromRGB(props) {
    return Color.create(props, 'rgb');
};

Color.fromHSL = function fromRGB(props) {
    return Color.create(props, 'hsl');
};

Color.toHex = function toHex(props, model) {
    return Color.create(props, model).hex();
};

Color.toHSL = function toHSL(props, model) {
    return Color.create(props, model).hsl();
};

Color.toRGB = function toRGB(props, model) {
    return Color.create(props, model).rgb();
};

Color.getYIQ = function getYIQ(props, model) {
    return Color.create(props, model).yiq();
};

Color.BOOTSTRAP = {
    purple: '#6f42c1',
    pink: '#e83e8c',
    red: '#dc3545',
    orange: '#fd7e14',
    yellow: '#ffc107',
    green: '#28a745',
    teal: '#20c997',
    cyan: '#17a2b8',
    blue: '#007bff',
    indigo: '#6610f2',
};

Color.MATERIAL = {
    red: { 50: "#FFEBEE", 100: "#FFCDD2", 200: "#EF9A9A", 300: "#E57373", 400: "#EF5350", 500: "#F44336", 600: "#E53935", 700: "#D32F2F", 800: "#C62828", 900: "#B71C1C", A100: "#FF8180", A200: "#FF5252", A400: "#FF1744", A700: "#D50000" },
    pink: { 50: "#FCE4EC", 100: "#F8BBD0", 200: "#F48FB1", 300: "#F06292", 400: "#EC407A", 500: "#E91E63", 600: "#D81B60", 700: "#C2185B", 800: "#AD1457", 900: "#880E4F", A100: "#FF80AB", A200: "#FF4081", A400: "#F50057", A700: "#C51162" },
    purple: { 50: "#F3E5F5", 100: "#E1BEE7", 200: "#CE93D8", 300: "#BA68C8", 400: "#AB47BC", 500: "#9C27B0", 600: "#8E24AA", 700: "#7B1FA2", 800: "#6A1B9A", 900: "#4A148C", A100: "#EA80FC", A200: "#E040FB", A400: "#D500F9", A700: "#AA00FF" },
    purple_deep: { 50: "#EDE7F6", 100: "#D1C4E9", 200: "#B39DDB", 300: "#9575CD", 400: "#7E57C2", 500: "#673AB7", 600: "#5E35B1", 700: "#512DA8", 800: "#4527A0", 900: "#311B92", A100: "#B388FF", A200: "#7C4DFF", A400: "#651FFF", A700: "#6200EA" },
    indigo: { 50: "#E8EAF6", 100: "#C5CAE9", 200: "#9FA8DA", 300: "#7986CB", 400: "#5C6BC0", 500: "#3F51B5", 600: "#3949AB", 700: "#303F9F", 800: "#283593", 900: "#1A237E", A100: "#8C9EFF", A200: "#536DFE", A400: "#3D5AFE", A700: "#304FFE" },
    blue: { 50: "#E3F2FD", 100: "#BBDEFB", 200: "#90CAF9", 300: "#64B5F6", 400: "#42A5F5", 500: "#2196F3", 600: "#1E88E5", 700: "#1976D2", 800: "#1565C0", 900: "#0D47A1", A100: "#82B1FF", A200: "#448AFF", A400: "#2979FF", A700: "#2962FF" },
    blue_weak: { 50: "#E1F5FE", 100: "#B3E5FC", 200: "#81D4FA", 300: "#4FC3F7", 400: "#29B6F6", 500: "#03A9F4", 600: "#039BE5", 700: "#0288D1", 800: "#0277BD", 900: "#01579B", A100: "#80D8FF", A200: "#40C4FF", A400: "#00B0FF", A700: "#0091EA" },
    cyan: { 50: "#E0F7FA", 100: "#B2EBF2", 200: "#80DEEA", 300: "#4DD0E1", 400: "#26C6DA", 500: "#00BCD4", 600: "#00ACC1", 700: "#0097A7", 800: "#00838F", 900: "#006064", A100: "#84FFFF", A200: "#18FFFF", A400: "#00E5FF", A700: "#00B8D4" },
    teal: { 50: "#E0F2F1", 100: "#B2DFDB", 200: "#80CBC4", 300: "#4DB6AC", 400: "#26A69A", 500: "#009688", 600: "#00897B", 700: "#00796B", 800: "#00695C", 900: "#004D40", A100: "#A7FFEB", A200: "#64FFDA", A400: "#1DE9B6", A700: "#00BFA5" },
    green: { 50: "#E8F5E9", 100: "#C8E6C9", 200: "#A5D6A7", 300: "#81C784", 400: "#66BB6A", 500: "#4CAF50", 600: "#43A047", 700: "#388E3C", 800: "#2E7D32", 900: "#1B5E20", A100: "#B9F6CA", A200: "#69F0AE", A400: "#00E676", A700: "#00C853" },
    green_weak: { 50: "#F1F8E9", 100: "#DCEDC8", 200: "#C5E1A5", 300: "#AED581", 400: "#9CCC65", 500: "#8BC34A", 600: "#7CB342", 700: "#689F38", 800: "#558B2F", 900: "#33691E", A100: "#CCFF90", A200: "#B2FF59", A400: "#76FF03", A700: "#64DD17" },
    lime: { 50: "#F9FBE7", 100: "#F0F4C3", 200: "#E6EE9C", 300: "#DCE775", 400: "#D4E157", 500: "#CDDC39", 600: "#C0CA33", 700: "#AFB42B", 800: "#9E9D24", 900: "#827717", A100: "#F4FF81", A200: "#EEFF41", A400: "#C6FF00", A700: "#AEEA00" },
    yellow: { 50: "#FFFDE7", 100: "#FFF9C4", 200: "#FFF59D", 300: "#FFF176", 400: "#FFEE58", 500: "#FFEB3B", 600: "#FDD835", 700: "#FBC02D", 800: "#F9A825", 900: "#F57F17", A100: "#FFFF8D", A200: "#FFFF00", A400: "#FFEA00", A700: "#FFD600" },
    amber: { 50: "#FFF8E1", 100: "#FFECB3", 200: "#FFE082", 300: "#FFD54F", 400: "#FFCA28", 500: "#FFC107", 600: "#FFB300", 700: "#FFA000", 800: "#FF8F00", 900: "#FF6F00", A100: "#FFE57F", A200: "#FFD740", A400: "#FFC400", A700: "#FFAB00" },
    orange: { 50: "#FFF3E0", 100: "#FFE0B2", 200: "#FFCC80", 300: "#FFB74D", 400: "#FFA726", 500: "#FF9800", 600: "#FB8C00", 700: "#F57C00", 800: "#EF6C00", 900: "#E65100", A100: "#FFD180", A200: "#FFAB40", A400: "#FF9100", A700: "#FF6D00" },
    orange_deep: { 50: "#FBE9E7", 100: "#FFCCBC", 200: "#FFAB91", 300: "#FF8A65", 400: "#FF7043", 500: "#FF5722", 600: "#F4511E", 700: "#E64A19", 800: "#D84315", 900: "#BF360C", A100: "#FF9E80", A200: "#FF6E40", A400: "#FF3D00", A700: "#DD2C00" },
    brown: { 50: "#EFEBE9", 100: "#D7CCC8", 200: "#BCAAA4", 300: "#A1887F", 400: "#8D6E63", 500: "#795548", 600: "#6D4C41", 700: "#5D4037", 800: "#4E342E", 900: "#3E2723" },
    grey: { 50: "#FAFAFA", 100: "#F5F5F5", 200: "#EEEEEE", 300: "#E0E0E0", 400: "#BDBDBD", 500: "#9E9E9E", 600: "#757575", 700: "#616161", 800: "#424242", 900: "#212121" },
    petrol: { 50: "#ECEFF1", 100: "#CFD8DC", 200: "#B0BEC5", 300: "#90A4AE", 400: "#78909C", 500: "#607D8B", 600: "#546E7A", 700: "#455A64", 800: "#37474F", 900: "#263238" },
};

