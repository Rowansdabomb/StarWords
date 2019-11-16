import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { format } from 'date-fns';
import { makeStyles, Typography, Button } from '@material-ui/core';
import Splash from './Splash';
import useScroll from './scroll/useScroll';
import useMicrophone from './microphone/useMicrophone';


const useStyles = makeStyles(() => ({
  button: {
    position: 'fixed',
    right: '1rem',
    top: '1rem',
  },
  container: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    // background: '#000000',
    width: '100vw',
    height: '100vh',
  },
  fade: {
    zIndex: 10,
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0))',
    width: '100%',
    height: '80%',
    position: 'absolute',
    top: 0,
  },
  StarWords: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
    perspective: '400px',
  },
  crawl: {
    top: 0,
    width: '40%',
    height: '100vh',
    overflowY: 'scroll',
    position: 'absolute',
    transformStyle: 'preserve-3d',
    transformOrigin: '50% 100%',
    transform: 'rotateX(45deg) translateZ(50vh)',
    textAlign: 'justify',
    transition: 'all 1s',
  },
  inner: {
    // margin: '0 auto',
    // width: '60%',
  },
  spacer: {
    height: '500px',
  },
  timestamp: {
    position: 'absolute',
    left: '2rem',
    fontSize: '0.6rem',
  },
  text: {
    paddingLeft: '20%',
    paddingRight: '20%',
  },
  textBox: {
    marginBottom: '1rem',
  },
}));

export default function StarWords({ inactive, postToast }) {
  const classes = useStyles();
  const crawlRef = useRef(null);
  const {
    startScrolling, stopScrolling,
  } = useScroll();
  const {
    startRecording, stopRecording, textBoxes, recording,
  } = useMicrophone();
  const [crawlHeight, setCrawlHeight] = useState(0);
  const [crawlScrollTop, setCrawlScrollTop] = useState(0);

  const toggleRecord = () => {
    if (recording) {
      stopRecording();
      stopScrolling(crawlRef);
    } else {
      startRecording();
      startScrolling(crawlRef);
    }
  };

  useEffect(() => {
    if (crawlRef.current != null && crawlRef.current.clientHeight !== crawlHeight) {
      setCrawlHeight(crawlRef.current.clientHeight);
    }
  }, [crawlHeight, crawlScrollTop]);

  useEffect(() => {
    if (inactive && recording) {
      stopRecording();
      stopScrolling();
      postToast();
    }
  }, [inactive, postToast, recording, stopRecording, stopScrolling]);

  const handleScroll = (e) => {
    setCrawlScrollTop(e.currentTarget.scrollTop);
  };

  const crawlStyle = { opacity: `${recording ? 1 : 0}` };

  const fadeStyle = { marginTop: crawlScrollTop };

  return (
    <div className={classes.container}>
      <div className={classes.StarWords}>
        <Splash recording={recording} />
        <Button
          className={classes.button}
          variant="outlined"
          color="primary"
          onClick={toggleRecord}
        >
          {recording ? 'Stop' : 'Start'}

        </Button>
        <div
          ref={crawlRef}
          style={crawlStyle}
          className={classes.crawl}
          onScroll={handleScroll}
        >
          <div className={classes.fade} style={fadeStyle} />
          <div style={{ height: '100%' }} />
          <p style={{ textAlign: 'center' }}>StarWords</p>
          <h2 style={{ textAlign: 'center' }}>Stenographer</h2>
          <div className={classes.inner}>
            {textBoxes.map((data, index) => (
              // eslint-disable-next-line
              <div key={`key_${index}`} className={classes.textBox}>
                {data.date && (
                  <Typography
                    variant="body1"
                    className={classes.timestamp}
                    style={{ opacity: data.speaker === 1 ? 1 : 0.5 }}
                  >
                    {format(data.date, 'p')}
                  </Typography>
                )}
                <Typography variant="body1" className={classes.text}>{data.text}</Typography>
              </div>
            ))}
            <div style={{ height: '10vh', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

StarWords.propTypes = {
  inactive: PropTypes.bool.isRequired,
  postToast: PropTypes.func.isRequired,
};
