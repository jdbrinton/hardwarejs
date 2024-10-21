export class HardwareEmulator {
  constructor(terminal) {
    this.terminal = terminal;
    this.wasmInstance = null;

    const imports = {
      env: {
        console_write: (message_ptr) => {
          const memory = this.wasmInstance.exports.memory;
          const memoryBuffer = new Uint8Array(memory.buffer);

          let endPtr = message_ptr;
          while (memoryBuffer[endPtr] !== 0) {
            endPtr++;
          }

          const messageBytes = memoryBuffer.subarray(message_ptr, endPtr);

          const decoder = new TextDecoder("utf-8");
          const message = decoder.decode(messageBytes);

          this.terminal.write(message.replace(/\n/g, "\r\n"));
        },
      },
    };

    fetch("linux/boot/vmlinux.wasm")
      .then((response) => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes, imports))
      .then((result) => {
        this.wasmInstance = result.instance;
        this.wasmInstance.exports._start();
      })
      .catch(console.error);
  }

  sendInputToWasm(data) {
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      const chCode = char.charCodeAt(0);
      this.wasmInstance.exports.handle_input(chCode);
    }
  }
}
