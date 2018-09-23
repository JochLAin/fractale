
// First entry: plural suffix, reversed
// Second entry: length of plural suffix
// Third entry: Whether the suffix may succeed a vocal
// Fourth entry: Whether the suffix may succeed a consonant
// Fifth entry: singular suffix, normal
const plural_map = [
    // bacteria (bacterium), criteria (criterion), phenomena (phenomenon)
    ['a', true, true, ['on', 'um']],

    // nebulae (nebula)
    ['ea', true, true, 'a'],

    // services (service)
    ['secivres', true, true, 'service'],

    // mice (mouse), lice (louse)
    ['eci', false, true, 'ouse'],

    // geese (goose)
    ['esee', false, true, 'oose'],

    // fungi (fungus), alumni (alumnus), syllabi (syllabus), radii (radius)
    ['i', true, true, 'us'],

    // men (man), women (woman)
    ['nem', true, true, 'man'],

    // children (child)
    ['nerdlihc', true, true, 'child'],

    // oxen (ox)
    ['nexo', false, false, 'ox'],

    // indices (index), appendices (appendix), prices (price)
    ['seci', false, true, ['ex', 'ix', 'ice']],

    // selfies (selfie)
    ['seifles', true, true, 'selfie'],

    // movies (movie)
    ['seivom', true, true, 'movie'],

    // feet (foot)
    ['teef', true, true, 'foot'],

    // geese (goose)
    ['eseeg', true, true, 'goose'],

    // teeth (tooth)
    ['hteet', true, true, 'tooth'],

    // news (news)
    ['swen', true, true, 'news'],

    // series (series)
    ['seires', true, true, 'series'],

    // babies (baby)
    ['sei', false, true, 'y'],

    // accesses (access), addresses (address), kisses (kiss)
    ['sess', true, false, 'ss'],

    // analyses (analysis), ellipses (ellipsis), fungi (fungus),
    // neuroses (neurosis), theses (thesis), emphases (emphasis),
    // oases (oasis), crises (crisis), houses (house), bases (base),
    // atlases (atlas)
    ['ses', true, true, ['s', 'se', 'sis']],

    // objectives (objective), alternative (alternatives)
    ['sevit', true, true, 'tive'],

    // drives (drive)
    ['sevird', false, true, 'drive'],

    // lives (life), wives (wife)
    ['sevi', false, true, 'ife'],

    // moves (move)
    ['sevom', true, true, 'move'],

    // hooves (hoof), dwarves (dwarf), elves (elf), leaves (leaf), caves (cave), staves (staff)
    ['sev', true, true, ['f', 've', 'ff']],

    // axes (axis), axes (ax), axes (axe)
    ['sexa', false, false, ['ax', 'axe', 'axis']],

    // indexes (index), matrixes (matrix)
    ['sex', true, false, 'x'],

    // quizzes (quiz)
    ['sezz', true, false, 'z'],

    // bureaus (bureau)
    ['suae', false, true, 'eau'],

    // roses (rose), garages (garage), cassettes (cassette),
    // waltzes (waltz), heroes (hero), bushes (bush), arches (arch),
    // shoes (shoe)
    ['se', true, true, ['', 'e']],

    // tags (tag)
    ['s', true, true, ''],

    // chateaux (chateau)
    ['xuae', false, true, 'eau'],

    // people (person)
    ['elpoep', true, true, 'person'],
];

module.exports = {
    singularize: (plural, multiple = true) => {
        const plural_rev = plural.split('').reverse().join('');
        const lower_plural_rev = plural_rev.toLowerCase();
        const plural_length = lower_plural_rev.length;

        // The outer loop iterates over the entries of the plural table
        // The inner loop j iterates over the characters of the plural suffix
        // in the plural table to compare them with the characters of the actual
        // given plural suffix
        for (let index in plural_map) {
            const map = plural_map[index];
            const suffix = map[0];
            const suffix_length = suffix.length;
            let j = 0;

            // Compare characters in the plural table and of the suffix of the
            // given plural one by one
            while (suffix.charAt(j) === lower_plural_rev.charAt(j)) {
                // Let j point to the next character
                ++j;

                // Successfully compared the last character
                // Add an entry with the singular suffix to the singular array
                if (j === suffix_length) {
                    // Is there any character preceding the suffix in the plural string?
                    if (j < plural_length) {
                        const next_is_vocal = 'aeiou'.includes(lower_plural_rev.charAt(j));

                        if (!map[1] && next_is_vocal) {
                            // suffix may not succeed a vocal but next char is one
                            break;
                        }

                        if (!map[2] && !next_is_vocal) {
                            // suffix may not succeed a consonant but next char is one
                            break;
                        }
                    }

                    const new_base = plural.substr(0, plural_length - suffix_length);
                    const new_suffix = map[3];

                    // Check whether the first character in the plural suffix
                    // is uppercased. If yes, uppercase the first character in
                    // the singular suffix too
                    const first_upper = /^[A-Z]/.test(plural_rev);

                    if (Array.isArray(new_suffix)) {
                        if (multiple) {
                            let singulars = [];

                            for (let key in new_suffix) {
                                const singular = new_base + (!first_upper ? new_suffix[key] : (new_suffix[key].charAt(0).toUpperCase() + new_suffix[key].slice(1)));
                                singulars.push(singular);
                            }

                            return singulars;
                        }
                        return new_base + (!first_upper ? new_suffix[0] : (new_suffix[0].charAt(0).toUpperCase() + new_suffix[0].slice(1)));
                    }

                    return new_base + (first_upper ? new_suffix : (new_suffix.charAt(0).toUpperCase() + new_suffix.slice(1)));
                }

                // Suffix is longer than word
                if (j === plural_length) {
                    break;
                }
            }
        }

        // Assume that plural and singular is identical
        return plural;
    }
}