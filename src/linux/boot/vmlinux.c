extern void console_write(const char *message);

__attribute__((export_name("_start")))
void _start(void) {
    console_write("Hello from WebAssembly!\n");
    console_write("Enter text: ");
}

char buffer[256];
int idx = 0;

__attribute__((export_name("handle_input")))
void handle_input(int ch) {
    if (ch == '\n' || ch == '\r' || idx >= 255) {
        buffer[idx] = '\0';
        console_write("\nYou entered: ");
        console_write(buffer);
        console_write("\nEnter text: ");
        idx = 0;
    } else {
        buffer[idx++] = (char)ch;
    }
}
