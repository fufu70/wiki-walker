// class Events {
// 	// key: name, value: {id: id}
// 	idsByName = new Map();
// 	// key: caller, value: {id: id}
// 	idsByCaller = new Map(); 
// 	// key: id, value: {
// 	// 	id: number,
// 	// 	eventName: string,
// 	// 	caller: Object,
// 	// 	callback: Function
// 	// }
// 	eventMap = new Map(); 

// 	nextId = 0;

// 	// emit events
// 	emit(eventName, value) {
// 		if (!this.idsByName.has(eventName)) {
// 			return;
// 		}
// 		let ids = Object.values(this.idsByName.get(eventName));
// 		// console.log("IDS", ids);
// 		ids.forEach((id) => {
// 			if (id === undefined) {
// 				return;
// 			}
// 			this.eventMap.get(id).callback(value);
// 		});
// 	}

// 	// subscribe to something happening
// 	on(eventName, caller, callback) {
// 		this.nextId += 1;

// 		this.eventMap.set(this.nextId, {
// 			id: this.nextId,
// 			eventName,
// 			caller,
// 			callback
// 		});
// 		// add id to event name bucket
// 		if (!this.idsByName.has(eventName)) {
// 			this.idsByName.set(eventName, {});
// 		}
// 		this.idsByName.get(eventName)[this.nextId] = this.nextId;
// 		// add id to callback bucket
// 		if (!this.idsByCaller.has(caller)) {
// 			this.idsByCaller.set(caller, {});
// 		}
// 		this.idsByCaller.get(caller)[this.nextId] = this.nextId;

// 		return this.nextId;
// 	}

// 	// remove the subscription
// 	off(id) {
// 		let event = this.eventMap.get(id);
// 		this.removeIdFromName(id, event.eventName);
// 		this.removeIdFromCaller(id, event.caller);
// 		this.eventMap.delete(id);
// 	}

// 	unsubscribe(caller) {
// 		if (caller == undefined) {
// 			return;
// 		}
// 		if (!this.idsByCaller.has(caller)) {
// 			return;
// 		}
// 		console.log(this.idsByCaller.get(caller));
// 		let ids = Object.values(this.idsByCaller.get(caller));
// 		ids.forEach(id => {
// 			if (id === undefined) {
// 				return;
// 			}
// 			// remove id from event
// 			let event = this.eventMap.get(id);
// 			this.removeIdFromName(id, event.eventName);
// 			// remove id from caller
// 			this.eventMap.delete(id);
// 		});
// 		this.idsByCaller.delete(caller);
// 	}

// 	removeIdFromName(id, name) {
// 		this.idsByName.get(name)[id] = undefined;
// 	}

// 	removeIdFromCaller(id, caller) {
// 		this.idsByCaller.get(caller)[id] = undefined;
		
// 	}
// }

// export const events = new Events();

class Events {
	callbacks = [];
	nextId = 0;

	// emit events 
	emit(eventName, value) {
		// console.log(eventName, value);
		this.callbacks.forEach((stored) => {
			if (stored.eventName === eventName) {
				stored.callback(value);
			}
		})
	}

	// subscribe to something happening
	on(eventName, caller, callback) {
		this.nextId += 1;
		this.callbacks.push({
			id: this.nextId,
			eventName,
			caller,
			callback
		});
		return this.nextId;
	}

	// remove the subscription
	off(id) {
		this.callbacks = this.callbacks.filter(
			(stored) => stored.id !== id);
	}

	unsubscribe(caller) {
		this.callbacks = this.callbacks.filter(
			(stored) => stored.caller !== caller);
	}
}

export const events = new Events();