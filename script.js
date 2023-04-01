"use strict";

class PTM {
	#options = {
		startBalance: 100,
		storage: localStorage,
		storagePrefix: "ptm-",
		logLevel: 4,
		name: "PTM",
	};
	#items = [];

	#user = {
		balance: this.#options.startBalance,
		ownedItems: [],
	};

	constructor(items, options) {
		this.#options = { ...this.#options, options };
		this.#items = items;
		this.#loadUser();
	}

	hasItem(itemName) {
		return this.#user.ownedItems.some((item) => item.name === itemName);
	}

	buyItem(itemName) {
		if (this.hasItem(itemName))
			return this.#info(`user already has '${itemName}'`);

		const item = this.getItem(itemName);
		if (!item) return this.#warn(`item '${itemName}' does not exist`);

		if (this.#user.balance + item.price < 0)
			return this.#info(`insufficient balance`);

		this.#user.balance += item.price;
		this.#user.ownedItems.push(item);
		this.#saveUser();
	}

	getItem(itemName) {
		return this.#items.find((item) => item.name === itemName);
	}

	#saveUser() {
		const base64 = btoa(JSON.stringify(this.#user));
		this.#options.storage.setItem(
			this.#options.storagePrefix + "user",
			base64
		);
	}

	#loadUser() {
		const base64 = this.#options.storage.getItem(
			this.#options.storagePrefix + "user"
		);

		if (base64) {
			this.#user = JSON.parse(atob(base64));
			this.#log(this.#user);
		} else {
			this.#saveUser();
		}
	}

	#generateLogTimestamp(type) {
		const time = new Date();
		let timestamp = `[${this.#options.name} ${type} `;
		timestamp += time.getFullYear() + "-";
		timestamp += String(time.getMonth() + 1).padStart(2, "0") + "-";
		timestamp += String(time.getDate()).padStart(2, "0") + " ";
		timestamp += String(time.getHours()).padStart(2, "0") + ":";
		timestamp += String(time.getMinutes()).padStart(2, "0") + ":";
		timestamp += String(time.getSeconds()).padStart(2, "0") + "]";
		return timestamp;
	}

	#log(...args) {
		if (this.#options.logLevel >= 4) {
			const timestamp = this.#generateLogTimestamp("Log");
			console.log(timestamp, ...args);
		}
	}

	#info(...args) {
		if (this.#options.logLevel >= 3) {
			const timestamp = this.#generateLogTimestamp("Info");
			console.info(timestamp, ...args);
		}
	}

	#warn(...args) {
		if (this.#options.logLevel >= 2) {
			const timestamp = this.#generateLogTimestamp("Warn");
			console.warn(timestamp, ...args);
		}
	}

	#error(...args) {
		if (this.#options.logLevel >= 1) {
			const timestamp = this.#generateLogTimestamp("Error");
			console.error(timestamp, ...args);
		}
	}
}
