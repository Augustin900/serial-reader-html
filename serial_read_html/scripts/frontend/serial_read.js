let port;
let reader;
let keepReading = false;

let output = document.querySelector(".output")
let port_display = document.querySelector(".port_info")

async function connectSerial() {
    try {
        port = await navigator.serial.requestPort();

        baud = prompt("Please input a baudrate below: ")
        baud_rate = await port.open({ baudRate: baud });

        const info = port.getInfo();
        const portText = info.usbVendorId && info.usbProductId 
                    ? `Vendor ID: ${info.usbVendorId}, Product ID: ${info.usbProductId}` 
                    : "Unknown Port";

        port_display.innerHTML = `Connected to port ${portText} at ${baud} baud`

        keepReading = true;
        readSerialData();
    } catch (err) {
        alert("Error: " + err.message);
    }
}

async function disconnectSerial() {
    window.location.reload()
}

async function readSerialData() {
    while (port.readable && keepReading) {
        reader = port.readable.getReader();
        try {
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                if (value) {
                    let text = new TextDecoder().decode(value);
                    output.innerHTML += text
                    output.scrollTop = output.scrollHeight;
                }
            }
        } catch (error) {
            console.error("Read error: ", error);
        } finally {
            reader.releaseLock();
        }
    }
}