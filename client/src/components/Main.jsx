import React, { useState } from 'react';

import Container from '@material-ui/core/Container';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import StarWords from './StarWords';
import SpaceBackground from './SpaceBackground';
import useActivityDetect from './activityDetect/useActivityDetect';


export default function Main() {
  const { inactive } = useActivityDetect(5 * 60);
  const [showToast, setShowToast] = useState(false);
  return (
    <div>
      <Container maxWidth="md">
        <SpaceBackground />
        <StarWords inactive={inactive} postToast={() => setShowToast(true)} />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={showToast}
          onClose={() => setShowToast(false)}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Recording stopped due to inactivity</span>}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={() => setShowToast(false)}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Container>
    </div>
  );
}
