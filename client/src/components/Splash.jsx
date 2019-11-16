import React from 'react';
import PropTypes from 'prop-types';

import makeStyles from '@material-ui/styles/makeStyles';

import StarWordsImage from '../assets/Star-words-gold.png';

const useStyles = makeStyles(() => ({
  splash: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    transition: 'all 1s',
    width: '33%',
  },
  image: {
    width: '100%',
  },
}));

export default function Splash({ recording }) {
  const classes = useStyles();

  const splashStyle = recording ? {
    opacity: 0,
    zIndex: 0,
  } : {
    opacity: 1,
    zIndex: 1,
  };

  return (
    <div
      className={classes.splash}
      style={splashStyle}
    >
      <img
        className={classes.image}
        src={StarWordsImage}
        alt="StarWordsSplash"
      />
    </div>

  );
}

Splash.propTypes = {
  recording: PropTypes.bool.isRequired,
};
