import React, { useState } from 'react';


import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  menu: {
    position: 'relative',
    color: 'white',
    zIndex: 1,
  },
  menuIcon: {
    padding: '1rem',
  },
  list: {
    minWidth: '240px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  return (
    <div className={classes.menu}>
      <MenuIcon className={classes.menuIcon} onClick={() => setOpen(true)} />
      <Drawer open={open} onClose={() => setOpen(false)}>
        <List className={classes.list}>
          {/* <ListItem
            button
            variant="outlined"
            color="primary"
            onClick={handleRecord}
          >
            <ListItemText primary={recording ? 'Stop' : 'Start'} />
          </ListItem> */}
        </List>
      </Drawer>
    </div>
  );
}
