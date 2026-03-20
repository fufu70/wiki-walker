class Events {
	callbacks = {};
	nextId = 0;

	// emit events 
	emit(eventName, value) {
		// console.log(eventName, value);
		this.callbacks[eventName].forEach((stored) => {
			if (stored.eventName === eventName) {
				stored.callback(value);
			}
		})
	}

	// subscribe to something happening
	on(eventName, caller, callback) {
		this.nextId += 1;
		if (!this.callbacks[eventName]) {
			this.callbacks[eventName] = [];
		}

		this.callbacks[eventName].push({
			id: this.nextId,
			eventName,
			caller,
			callback
		});
		return this.nextId;
	}

	// remove the subscription
	off(id) {
		this.callbacks = Object.keys(this.callbacks).reduce((map, currKey) => {
			// console.log(currKey);
			const filtered = this.callbacks
				[currKey]
				.filter((stored) => stored.id !== id);
			map[currKey] = filtered;
			return map;
		}, {});
	}

	unsubscribe(caller) {
		this.callbacks = Object.keys(this.callbacks).reduce((map, currKey) => {
			const filtered = this.callbacks
				[currKey]
				.filter((stored) => stored.caller !== caller);
			map[currKey] = filtered;
			return map;
		}, {});
	}
}

export const events = new Events();