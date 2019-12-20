import * as Channel from "./channel.js";
import * as Overlay from "./overlay.js";
const apiHost = "ENV_API_HOST";

const defaults = { display: true };
export async function openChannel(options) {
  const { target, display } = Object.assign({}, defaults, options);
  const redirect = new URL(target, window.location.origin);

  const { url, dataURL, messagePromise } = await Channel.open(
    redirect,
    apiHost
  );

  var close;
  function displayOverlay() {
    if (close) {
      return;
    }
    close = Overlay.display(dataURL).close;
  }
  if (display) {
    displayOverlay();
  }
  return {
    pushURL: url,
    dataPushURL: dataURL,
    displayOverlay,
    close: function() {
      close();
      close = undefined;
    },
    receive: async function() {
      const message = await messagePromise;
      if (close) {
        console.log("CLOSING");
        close();
      }
      return message;
    }
  };
}

export async function send(message, pushURL) {
  if (!pushURL) {
    const params = new URLSearchParams(window.location.search);
    pushURL = params.get("qrpu.sh");
  }
  const response = await fetch(pushURL, {
    method: "POST",
    body: JSON.stringify(message)
  });
  console.log(response);
  console.log();
}
