postMessage('Hello from the remote worker!');

onmessage = function(e) {
  console.log('Remote worker: Received  received from main script');
  postMessage('echo from remote worker: ' + e.data);
}
