const evalWork = `
// Listen for messages from the main thread and run them
self.onmessage = (event) => {
    const data = event.data;

    let lambda = undefined;
    if (typeof data.lambda == 'string') {
        lambda = eval(data.lambda);
    }
    let output = undefined;
    if (data.input !== undefined) {
        output = lambda(data.input);
    }
    // Send the result back to the main thread
    if (typeof data.uuid == 'string') {
        self.postMessage({
            uuid: data.uuid,
            output: output
        });
    } else {
        self.postMessage(output);
    }
};`;

const evalWorkFile = `data:@file/javascript;base64,${btoa(evalWork)}`;

console.log("EVAL_WORK", evalWorkFile);

export class JobManager {

    static callbackMap = new Map();
    static worker = new Worker(evalWorkFile);

    static runJob(lambda, input, callback) {
        const uuid = crypto.randomUUID();
        JobManager.callbackMap.set(uuid, callback);

        if (!JobManager.worker.onmessage) {
            JobManager.worker.onmessage = (event) => {
                // return the output to the callback
                JobManager.callbackMap.get(event.data.uuid)(event.data.output);
                // remove callback from callbackMap
                JobManager.callbackMap.delete(event.data.uuid);
            };
        }
        if (!JobManager.worker.onerror) {
            JobManager.worker.onerror = (error) => {
                console.error('Worker error:', error);
            };
        }

        JobManager.worker.postMessage({uuid: uuid, lambda: lambda, input: input});
    }

    // const myWorker = new Worker('evalWorker.js');
    // console.log("WORKER", myWorker);

    // // Listen for messages from the worker

    // // Handle errors from the worker
    // myWorker.onerror = (error) => {
    //     console.error('Worker error:', error);
    //     // resultSpan.textContent = 'Error during calculation.';
    //     // uiStatusSpan.textContent = 'Error';
    //     // calculateButton.disabled = false;
    // };
}