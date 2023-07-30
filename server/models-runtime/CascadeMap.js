export class CascadeMap {
    constructor(parent, pairs) {
        this.parent = parent;
        this.items = new Map();

        for (const pair of pairs) {
            this.items.set(...pair);
        }
    }

    set(key, value) {
        this.items.set(key, value);
    }

    get(key) {
        let storage = this;
        while (storage) {
            const value = storage.items.get(key);
            if (value) {
                return value;
            }

            storage = storage.parent;
        }

        return null;
    }

    has(key) {
        let storage = this;
        while (storage) {
            if (storage.items.has(key)) {
                return true;
            }

            storage = storage.parent;
        }

        return false;
    }

    delete(key) {
        this.items.delete(key);
    }

    values() {
        return this.items.values();
    }

    entries() {
        return this.items.entries();
    }

    [Symbol.iterator]() {
        return this.entries();
    }
}
