let port;
let reader;
let keepReading = false;

let output = document.querySelector(".output")
let errors = document.querySelector(".errors")

function raise_error(error_text, error_message){
    errors.innerHTML = error_text + error_message;
}

async function connectSerial() {
    try {
        port = await navigator.serial.requestPort();

        baud = prompt("Please input a baudrate below: ")
        baud_rate = await port.open({ baudRate: baud });

        document.title = `Serial Port Reader - Connected to port ${port.path} at ${baud} baud`

        keepReading = true;
        readSerialData();
    } catch (err) {
        raise_error("Error: ", err.message);
    }
}

async function disconnectSerial() {
    if (port) {
        keepReading = false;
        try {
            await port.close();
            output.innerText = "Disconnected";
        } catch (err) {
            raise_error("Error closing port: ", err);
        }
    }
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

                    if (document.getElementById("autoscrollToggle").checked) {
                        output.scrollTop = output.scrollHeight;
                    }
                }
            }
        } catch (error) {
            raise_error("Read error: ", error);
        } finally {
            reader.releaseLock();
        }
    }
}