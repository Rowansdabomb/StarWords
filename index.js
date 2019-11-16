
const express = require('express'); // const bodyParser = require('body-parser'); // const path = require('path');
const path = require('path');

// Google Cloud
const speech = require('@google-cloud/speech');

const speechClient = new speech.SpeechClient(); // Creates a client

const app = express();

const ioPort = 4000;
const io = require('socket.io')();

io.listen(ioPort);

// =========================== GOOGLE CLOUD SETTINGS ================================ //
const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 2,
  },
};

// =========================== SOCKET.IO ================================ //

io.on('connection', (client) => {
  let recognizeStream = null;

  function stopRecognitionStream() {
    if (recognizeStream) {
      recognizeStream.end();
    }
    recognizeStream = null;
  }

  async function startRecognitionStream() {
    recognizeStream = speechClient.streamingRecognize(request)
      .on('error', (err) => {
        console.error(err); // eslint-disable-line no-console
      })
      .on('data', (data) => {
        client.emit('speechData', data);

        if (data.results[0] && data.results[0].isFinal) {
          stopRecognitionStream();
          startRecognitionStream(client);
        }
      });
  }

  client.on('join', () => {
    client.emit('messages', 'Socket Connected to Server');
  });

  client.on('messages', (data) => {
    client.emit('broad', data);
  });

  client.on('startAudioStream', () => {
    startRecognitionStream();
  });

  client.on('endAudioStream', () => {
    stopRecognitionStream();
  });

  client.on('binaryData', (data) => {
    if (recognizeStream !== null) {
      recognizeStream.write(data);
    }
  });
});

// =========================== SERVER ================================ //

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/test', (req, res) => {
  res.json('this is a test');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port);
