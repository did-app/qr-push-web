export function open(redirect, apiHost) {
  return new Promise(async function(resolve, reject) {
    var response = await fetch(apiHost + "/start", {
      method: "POST",
      body: "target=" + redirect
    })
    var data = await response.formData()

    var pull_token = data.get("pull_token")
    var redirect_uri = data.get("redirect_uri")
    var redirect_qr = data.get("redirect_qr")

    var messagePromise = new Promise(async function(resolve, reject) {
      var message;
      try {
        var response = await fetch(apiHost + "/pull", {
          headers: {
            authorization: "Bearer " + pull_token
          }
        })
        message = await response.text()
        var data = JSON.parse(message)

        console.log("received", data);
        resolve(data)
      } catch (e) {

      } finally {

      }
    });

    console.log("redirect_uri", redirect_uri);
    resolve({
      url: redirect_uri,
      dataURL: redirect_qr,
      messagePromise
    })
  });
}
