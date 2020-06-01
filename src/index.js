// import * as Channel from "./channel.js";
import * as Channel from "./poll.js";
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

export async function send(message, pushToken) {
  if (!pushToken) {
    const params = new URLSearchParams(window.location.search);
    pushToken = params.get("qrpu.sh");
  }
  console.log(pushToken);
  const response = await fetch(apiHost + "/push", {
    method: "POST",
    headers: {
      authorization: "Bearer " + pushToken
    },
    body: JSON.stringify(message)
  });
  console.log(response);
}
