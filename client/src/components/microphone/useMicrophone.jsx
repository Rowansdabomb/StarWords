import {
  useEffect, useCallback, useState, useRef,
} from 'react';
import useSocket from '../socket/useSocket';
import { downsampleBuffer } from './util';

const bufferSize = 2048;

export default function useMicrophone() {
  const { socket, lastText } = useSocket();
  const [textBoxes, setTextBoxes] = useState(['']);
  const textBoxCounter = useRef(0);

  const [recording, setRecording] = useState(false);

  const AudioContext = useRef(null);
  const context = useRef(null);
  const processor = useRef(null);
  const input = useRef(null);
  const globalStream = useRef(null);

  const streamStreaming = useRef(false);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (streamStreaming.current) { socket.emit('endAudioStream', ''); }
    };

    const intervalId = setInterval(() => {
      textBoxCounter.current += 1;
    }, 10 * 1000);

    return () => clearInterval(intervalId);
  }, [socket]);

  useEffect(() => {
    const temp = [...textBoxes];
    temp[textBoxCounter.current] = { ...lastText, date: new Date() };
    setTextBoxes(temp.filter((box) => box != null));
    // this is a hack i know
    // eslint-disable-next-line
  }, [lastText]);


  const microphoneProcess = useCallback((e) => {
    const left = e.inputBuffer.getChannelData(0);
    const left16 = downsampleBuffer(left, 44100, 16000);
    socket.emit('binaryData', left16);
  }, [socket]);

  const initRecording = useCallback(() => {
    socket.emit('startAudioStream', ''); // init socket Google Speech Connection
    streamStreaming.current = true;
    AudioContext.current = window.AudioContext || window.webkitAudioContext;
    context.current = new AudioContext.current({ // eslint-disable-line
      latencyHint: 'interactive',
    });
    processor.current = context.current.createScriptProcessor(bufferSize, 1, 1);
    processor.current.connect(context.current.destination);
    context.current.resume();

    const handleSuccess = (stream) => {
      globalStream.current = stream;
      input.current = context.current.createMediaStreamSource(stream);
      input.current.connect(processor.current);

      processor.current.onaudioprocess = (e) => {
        microphoneProcess(e);
      };
    };

    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
  }, [microphoneProcess, socket]);

  const startRecording = useCallback(() => {
    setRecording(true);
    initRecording();
  }, [initRecording]);

  const stopRecording = useCallback(() => {
    setRecording(false);
    streamStreaming.current = false;
    socket.emit('endAudioStream', '');

    const track = globalStream.current.getTracks()[0];
    track.stop();

    input.current.disconnect(processor.current);
    processor.current.disconnect(context.current.destination);
    context.current.close().then(() => {
      input.current = null;
      processor.current = null;
      context.current = null;
      AudioContext.current = null;
    });
  }, [socket]);

  return {
    startRecording, stopRecording, recording, textBoxes,
  };
}
