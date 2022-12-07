import { isString } from 'ohjs-is';

/**
 * A wrapper for increased usability of `window.localStorage`.
 *
 * All values are automatically JSON encoded.
 *
 * Namespacing is used when clearing local storage
 * in an effort to only clear values for one instance.
 *
 * Versioning is to easily make existing local storage values obsolete.
 *
 * @param {string} namespace
 * @param {string} version
 */
export default function(namespace, version) {
    if (!namespace || !isString(namespace)) {
        throw '`namespace` must be a non-empty string';
    }

    if (!version || !isString(version)) {
        throw '`version` must be a non-empty string';
    }

    namespace = '::' + namespace;

    version = '::' + version;

    function getKey(key) {
        return key + version + namespace;
    }

    return {
        getItem(key) {
            let value = window.localStorage.getItem(getKey(key));

            if (!value) {
                return value;
            }

            return JSON.parse(value);
        },

        setItem(key, value) {
            window.localStorage.setItem(getKey(key), 
JSON.stringify(value));
        },

        removeItem(key) {
            window.localStorage.removeItem(getKey(key));
        },

        clear() {
            let itemsToRemove = [];

            const regexp = new RegExp(namespace + '$');

            for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);

                if (key.match(regexp)) {
                    itemsToRemove.push(key);
                }
            }

            itemsToRemove.forEach((itemToRemove) => {
                window.localStorage.removeItem(itemToRemove);
            });
        },
    };
}

