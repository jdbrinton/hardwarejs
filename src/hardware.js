export class HardwareEmulator {
  constructor(terminal) {
    this.terminal = terminal;
    this.worker = new Worker('wasmWorker.js');

    this.worker.onmessage = (event) => {
      const data = event.data;
      if (data.type === 'console_output') {
        this.terminal.write(data.message);
      } else if (data.type === 'error') {
        console.error('Error from worker:', data.error);
      }
    };

    this.worker.postMessage({ type: 'start' });
  }

  sendInputToWasm(data) {
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const chCode = char.charCodeAt(0);
      this.worker.postMessage({ type: 'input', chCode });
    }
  }
}
