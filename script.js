"use strict";

class PTM {
	#version = "2.0.0-beta";
	#options = {
		startBalance: 100,
		storage: localStorage,
		storagePrefix: "ptm-",
		logLevel: 4,
		name: "PTM",
		currencyName: "pt",
	};
	#items = [];

	#user = {
		balance: this.#options.startBalance,
		ownedItems: [],
	};

	constructor(items, options) {
		console.info(`Version ${this.#version} of point system`);
		this.#options = { ...this.#options, options };
		this.#items = items;
		this.#loadUser();
	}

	hasItem(itemName) {
		this.#log(`checking user items for '${itemName}'`);
		return this.#user.ownedItems.some((item) => item.name === itemName);
	}

	buyItem(itemName) {
		if (this.hasItem(itemName))
			return this.#log(`user already has '${itemName}'`);

		const item = this.getItem(itemName);
		if (!item) return;

		if (this.#user.balance + item.price < 0)
			return this.#log(`insufficient balance`);

		this.chargeUser(item.price);
		this.#user.ownedItems.push(item);
		this.#saveUser();
	}

	getItem(itemName) {
		const item = this.#items.find((item) => item.name === itemName);
		if (!item) return this.#warn(`item '${itemName}' does not exist`);
		return item;
	}

	chargeUser(amount) {
		if (amount < 0) {
			this.#log(
				`charged user for ${amount * -1}${this.#options.currencyName}`
			);
		} else {
			this.#log(
				`added ${amount}${this.#options.currencyName} to user balance`
			);
		}
		this.#user.balance += amount;
		this.#saveUser();
	}

	getBalance() {
		return this.#user.balance;
	}

	#saveUser() {
		this.#log("save user");
		const base64 = btoa(JSON.stringify(this.#user));
		this.#options.storage.setItem(
			this.#options.storagePrefix + "user",
			base64
		);
	}

	#loadUser() {
		this.#log("load user from storage");
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

	#deprecatedWarning(descriptor) {
		let deprecatedWarning = new Error(
			`${descriptor} is deprecated and will be removed in the future}`
		);
		deprecatedWarning.name = "Deprecated warning";
		return deprecatedWarning;
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

	/** Deprecated methods */
	withdraw(amount) {
		this.#warn(this.#deprecatedWarning("function withdraw"));
		this.chargeUser(-amount);
	}

	deposit(amount) {
		this.#warn(this.#deprecatedWarning("function dposit"));
		this.chargeUser(amount);
	}

	buy(itemName) {
		this.#warn(this.#deprecatedWarning("function buy"));
		this.buyItem(itemName);
	}

	userHas(itemName) {
		this.#warn(this.#deprecatedWarning("function userHas"));
		this.hasItem(itemName);
	}

	safeUser() {
		this.#error(
			`function safeUser is deprecated and therefore not available anymore`
		);
	}

	refreshPTMs() {
		this.#error(
			`function refreshPTMs is deprecated and therefore not available anymore`
		);
	}
}
