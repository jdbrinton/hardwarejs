/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/wasmWorker.worker.js":
/*!**********************************!*\
  !*** ./src/wasmWorker.worker.js ***!
  \**********************************/
/***/ (() => {

eval("// wasmWorker.js\n\nlet wasmInstance = null;\n\nconst imports = {\n  env: {\n    console_write: (message_ptr) => {\n      const memory = wasmInstance.exports.memory;\n      const memoryBuffer = new Uint8Array(memory.buffer);\n      let endPtr = message_ptr;\n      while (memoryBuffer[endPtr] !== 0) {\n        endPtr++;\n      }\n      const messageBytes = memoryBuffer.subarray(message_ptr, endPtr);\n      const decoder = new TextDecoder(\"utf-8\");\n      const message = decoder.decode(messageBytes);\n      postMessage({ type: 'console_output', message: message.replace(/\\n/g, \"\\r\\n\") });\n    },\n    init_IRQ: () => {},\n    time_init: () => {},\n    calibrate_delay: () => {},\n    copy_thread: () => {},\n    __const_udelay: () => {},\n    show_regs: () => {},\n    __sw_hweight32: () => {},\n    machine_restart: () => {},\n    __switch_to: () => {},\n    show_stack: () => {},\n    __multi3: () => {},\n  },\n};\n\nonmessage = (event) => {\n  const data = event.data;\n  if (data.type === 'start') {\n    fetch('linux/boot/vmlinux.wasm')\n      .then((response) => response.arrayBuffer())\n      .then((bytes) => WebAssembly.instantiate(bytes, imports))\n      .then((result) => {\n        wasmInstance = result.instance;\n        wasmInstance.exports._start();\n      })\n      .catch((error) => postMessage({ type: 'error', error: error.message }));\n  } else if (data.type === 'input') {\n    if (wasmInstance && wasmInstance.exports.handle_input) {\n      wasmInstance.exports.handle_input(data.chCode);\n    }\n  }\n};\n\n\n//# sourceURL=webpack://hardwarejs/./src/wasmWorker.worker.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/wasmWorker.worker.js"]();
/******/ 	
/******/ })()
;