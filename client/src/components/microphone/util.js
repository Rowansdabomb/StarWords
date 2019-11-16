/* eslint-disable */
// Helper functions from google

export function convertFloat32ToInt16(buffer) {
  let l = buffer.length;
  const buf = new Int16Array(l / 3);

  while (l--) {
    if (l % 3 == 0) {
      buf[l / 3] = buffer[l] * 0xFFFF;
    }
  }
  return buf.buffer;
}

export var downsampleBuffer = function (buffer, sampleRate, outSampleRate) {
  if (outSampleRate == sampleRate) {
    return buffer;
  }
  if (outSampleRate > sampleRate) {
    throw 'downsampling rate show be smaller than original sample rate';
  }
  let sampleRateRatio = sampleRate / outSampleRate;
  let newLength = Math.round(buffer.length / sampleRateRatio);
  let result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0; var 
count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }

    result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result.buffer;
};

export function capitalize(s) {
  if (s.length < 1) {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}
