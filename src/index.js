import { MenuBar, Menu, Widget, DockPanel } from "@lumino/widgets";
import { CommandRegistry } from "@lumino/commands";
import { HardwareEmulator } from "./hardware.js";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import "./styles.css";

let terminal;
let terminalEchoEnabled = true;

window.onload = function () {
  const commands = new CommandRegistry();

  const menuBar = new MenuBar();
  menuBar.node.tabIndex = 0;
  menuBar.node.classList.add("menubar");

  const fileMenu = new Menu({ commands });
  fileMenu.title.label = "File";
  fileMenu.title.mnemonic = 0;
  fileMenu.addItem({ command: "reboot" });
  menuBar.addMenu(fileMenu);

  const imageMenu = new Menu({ commands });
  imageMenu.title.label = "Image";
  imageMenu.title.mnemonic = 0;
  imageMenu.addItem({ command: "image-ubuntu" });
  menuBar.addMenu(imageMenu);

  const hardwareMenu = new Menu({ commands });
  hardwareMenu.title.label = "Hardware";
  hardwareMenu.title.mnemonic = 0;
  hardwareMenu.addItem({ command: "toggle-mouse" });
  hardwareMenu.addItem({ command: "toggle-keyboard" });
  hardwareMenu.addItem({ command: "toggle-network" });
  hardwareMenu.addItem({ command: "toggle-audio" });
  hardwareMenu.addItem({ command: "toggle-graphics-card-hardware" });
  hardwareMenu.addItem({ command: "toggle-local-drive" });
  menuBar.addMenu(hardwareMenu);

  const viewMenu = new Menu({ commands });
  viewMenu.title.label = "View";
  viewMenu.title.mnemonic = 0;
  viewMenu.addItem({ command: "toggle-serial-console" });
  viewMenu.addItem({ command: "toggle-graphics-card-view" });
  viewMenu.addItem({ command: "toggle-terminal-echo" });
  menuBar.addMenu(viewMenu);

  const helpMenu = new Menu({ commands });
  helpMenu.title.label = "Help";
  helpMenu.title.mnemonic = 0;
  helpMenu.addItem({ command: "about" });
  menuBar.addMenu(helpMenu);

  commands.addCommand("reboot", {
    label: "Reboot",
    execute: () => {
      console.log("Rebooting VM");
    },
  });

  commands.addCommand("image-ubuntu", {
    label: "Ubuntu 24.04.1 LTS",
    isEnabled: () => false,
  });

  commands.addCommand("about", {
    label: "About",
    execute: () => {
      window.open("https://github.com/jdbrinton/hardwarejs", "_blank");
    },
  });

  const dockPanel = new DockPanel();
  dockPanel.node.classList.add("dockpanel");

  const consoleWidget = new Widget();
  consoleWidget.node.classList.add("console-widget");
  consoleWidget.title.label = "Serial Console";
  consoleWidget.title.closable = true;

  terminal = new Terminal({
    cursorBlink: true,
    scrollback: 10000,
  });
  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.open(consoleWidget.node);
  fitAddon.fit();

  const resizeObserver = new ResizeObserver(() => {
    fitAddon.fit();
  });
  resizeObserver.observe(consoleWidget.node);

  const graphicsWidget = new Widget();
  graphicsWidget.node.classList.add("graphics-widget");
  graphicsWidget.title.label = "Graphics Card";
  graphicsWidget.title.closable = true;

  const graphicsTextBox = document.createElement("div");
  graphicsTextBox.id = "graphics";
  graphicsTextBox.classList.add("graphics-placeholder");
  graphicsTextBox.textContent = "Graphics Placeholder";
  graphicsWidget.node.appendChild(graphicsTextBox);

  dockPanel.addWidget(consoleWidget);
  dockPanel.addWidget(graphicsWidget, {
    mode: "split-bottom",
    ref: consoleWidget,
  });

  let mouseEnabled = true;
  let keyboardEnabled = true;
  let networkEnabled = true;
  let audioEnabled = true;
  let graphicsCardEnabled = true;
  let localDriveEnabled = false;

  commands.addCommand("toggle-mouse", {
    label: "Mouse",
    isToggled: () => mouseEnabled,
    execute: () => {
      mouseEnabled = !mouseEnabled;
      console.log("Mouse enabled:", mouseEnabled);
    },
  });

  commands.addCommand("toggle-keyboard", {
    label: "Keyboard",
    isToggled: () => keyboardEnabled,
    execute: () => {
      keyboardEnabled = !keyboardEnabled;
      console.log("Keyboard enabled:", keyboardEnabled);
    },
  });

  commands.addCommand("toggle-network", {
    label: "Network",
    isToggled: () => networkEnabled,
    execute: () => {
      networkEnabled = !networkEnabled;
      console.log("Network enabled:", networkEnabled);
    },
  });

  commands.addCommand("toggle-audio", {
    label: "Audio",
    isToggled: () => audioEnabled,
    execute: () => {
      audioEnabled = !audioEnabled;
      console.log("Audio enabled:", audioEnabled);
    },
  });

  commands.addCommand("toggle-graphics-card-hardware", {
    label: "Graphics Card",
    isToggled: () => graphicsCardEnabled,
    execute: () => {
      graphicsCardEnabled = !graphicsCardEnabled;
      console.log("Graphics Card enabled:", graphicsCardEnabled);
    },
  });

  commands.addCommand("toggle-local-drive", {
    label: "Local Drive",
    isToggled: () => localDriveEnabled,
    execute: () => {
      localDriveEnabled = !localDriveEnabled;
      console.log("Local Drive enabled:", localDriveEnabled);
    },
  });

  commands.addCommand("toggle-serial-console", {
    label: "Show Serial Console",
    isToggled: () => !!consoleWidget.parent,
    execute: () => {
      if (consoleWidget.parent) {
        consoleWidget.parent = null;
      } else {
        dockPanel.addWidget(consoleWidget);
        if (graphicsWidget.parent) {
          dockPanel.addWidget(graphicsWidget, {
            mode: "split-bottom",
            ref: consoleWidget,
          });
        }
      }
    },
  });

  commands.addCommand("toggle-graphics-card-view", {
    label: "Show Graphics Card",
    isToggled: () => !!graphicsWidget.parent,
    execute: () => {
      if (graphicsWidget.parent) {
        graphicsWidget.parent = null;
      } else {
        let refWidget = consoleWidget.parent ? consoleWidget : undefined;
        dockPanel.addWidget(graphicsWidget, {
          mode: refWidget ? "split-bottom" : undefined,
          ref: refWidget,
        });
      }
    },
  });

  commands.addCommand("toggle-terminal-echo", {
    label: "Terminal Echo",
    isToggled: () => terminalEchoEnabled,
    execute: () => {
      terminalEchoEnabled = !terminalEchoEnabled;
      console.log("Terminal Echo enabled:", terminalEchoEnabled);
    },
  });

  Widget.attach(menuBar, document.body);
  Widget.attach(dockPanel, document.body);

  window.addEventListener("resize", () => {
    dockPanel.update();
  });

  const hardwareEmulator = new HardwareEmulator(terminal);

  terminal.onData((data) => {
    if (terminalEchoEnabled) {
      terminal.write(data);
    }
    hardwareEmulator.sendInputToWasm(data);
  });

  window.hardwareEmulator = hardwareEmulator;
  window.terminal = terminal;
};
