class Events {
	callbacks = new Map();
	nextId = 0;

	// emit events 
	emit(eventName, value) {
		// console.log(eventName, value);
		this.callbacks.get(eventName).forEach((stored) => {
			if (stored.eventName === eventName) {
				stored.callback(value);
			}
		})
	}

	// subscribe to something happening
	on(eventName, caller, callback) {
		this.nextId += 1;
		if (!this.callbacks.get(eventName)) {
			this.callbacks.set(eventName, [])
		}

		this.callbacks.get(eventName).push({
			id: this.nextId,
			eventName,
			caller,
			callback
		});
		return this.nextId;
	}

	// remove the subscription
	off(id) {
		this.callbacks = this.callbacks.keys().reduce((map, currKey) => {
			const filtered = this.callbacks
				.get(currKey)
				.filter((stored) => stored.id !== id);
			map.set(currKey, filtered);
			return map;
		}, new Map());
	}

	unsubscribe(caller) {
		this.callbacks = this.callbacks.keys().reduce((map, currKey) => {
			const filtered = this.callbacks
				.get(currKey)
				.filter((stored) => stored.caller !== caller);
			map.set(currKey, filtered);
			return map;
		}, new Map());
	}
}

export const events = new Events();