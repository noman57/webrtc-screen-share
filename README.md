WebRTC Scrrenshare and webcam streaming with  stream replace
==============

####  screen share simple example with video replace 

An 'as simple as it gets' WebRTC example.


Note: I have used the above blog post and modified this to work with screen sharing as well .  This only works on chrome 

## Usage

The signaling server uses Node.js and `ws` and can be started as such:

```
$ npm install ws
$ node server/server.js
```

With the server running, open a recent version of Firefox or Chrome and visit `https://localhost:8443`. Note the HTTPS! There is no redirect from HTTP to HTTPS!



For screen sharing you need to add a crome plugin 


https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk   add this plugin . Then collect the extensionid on webrtc 310 no file .

## TLS

Recent versions of Chrome require secure websockets for WebRTC. Thus, this example utilizes HTTPS. Included is a self-signed certificate that must be accepted in the browser for the example to work.

## Problems?

WebRTC is a rapidly evolving beast. Being an example that I don't check often, I rely on users for reports if something breaks. Issues and pull requests are greatly appreciated.

## License

The MIT License (MIT)

Copyright (c) 2014 Shane Tully

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

