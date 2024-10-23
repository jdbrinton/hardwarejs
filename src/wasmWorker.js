// wasmWorker.js

let wasmInstance = null;

const imports = {
  env: {
    console_write: (message_ptr) => {
      const memory = wasmInstance.exports.memory;
      const memoryBuffer = new Uint8Array(memory.buffer);
      let endPtr = message_ptr;
      while (memoryBuffer[endPtr] !== 0) {
        endPtr++;
      }
      const messageBytes = memoryBuffer.subarray(message_ptr, endPtr);
      const decoder = new TextDecoder("utf-8");
      const message = decoder.decode(messageBytes);
      postMessage({ type: 'console_output', message: message.replace(/\n/g, "\r\n") });
    },
    init_IRQ: () => {},
    time_init: () => {},
    calibrate_delay: () => {},
    copy_thread: () => {},
    __const_udelay: () => {},
    show_regs: () => {},
    __sw_hweight32: () => {},
    machine_restart: () => {},
    __switch_to: () => {},
    show_stack: () => {},
    __multi3: () => {},
  },
};

onmessage = (event) => {
  const data = event.data;
  if (data.type === 'start') {
    fetch('linux/boot/vmlinux.wasm')
      .then((response) => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes, imports))
      .then((result) => {
        wasmInstance = result.instance;
        wasmInstance.exports._start();
      })
      .catch((error) => postMessage({ type: 'error', error: error.message }));
  } else if (data.type === 'input') {
    if (wasmInstance && wasmInstance.exports.handle_input) {
      wasmInstance.exports.handle_input(data.chCode);
    }
  }
};
