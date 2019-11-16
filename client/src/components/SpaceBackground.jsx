import React, {
  useCallback, useEffect, useState, useRef,
} from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

function useCanvas(canvas) {
  const [backgroundURL, setBackgroundURL] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWidth(e.currentTarget.innerWidth);
      setHeight(e.currentTarget.innerHeight);
    });
  }, []);

  const smallStarCreate = useCallback((ctx, starNumber, starSize) => {
    for (let i = 0; i < starNumber; i += 1) {
      ctx.beginPath();
      const starLeft = Math.floor(Math.random() * width) + 1;
      const starTop = Math.floor(Math.random() * height) + 1;
      const colorVal01 = Math.floor(Math.random() * 106) + 150;
      const colorVal02 = Math.floor(Math.random() * 106) + 150;
      const opacityVal = (Math.floor(Math.random() * 11)) / 10;
      ctx.fillStyle = `rgba(${colorVal01}, ${colorVal02}, ${255}, ${opacityVal})`;
      ctx.fillRect(starLeft, starTop, starSize, starSize);
      ctx.fill();
    }
  }, [width, height]);

  const bigStarCreate = useCallback((ctx, starNumber, starSize) => {
    for (let i = 0; i < starNumber; i += 1) {
      ctx.beginPath();
      const starLeft = Math.floor(Math.random() * width) + 1;
      const starTop = Math.floor(Math.random() * height) + 1;
      const colorVal01 = Math.floor(Math.random() * 106) + 150;
      const colorVal02 = Math.floor(Math.random() * 106) + 150;
      const opacityVal = (Math.floor(Math.random() * 11)) / 10;
      const radgrad = ctx.createRadialGradient(starLeft, starTop, 0, starLeft, starTop, starSize);
      radgrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      radgrad.addColorStop(1, `rgba(${colorVal01}, ${colorVal02}, ${255}, ${opacityVal})`);
      ctx.fillStyle = radgrad;
      ctx.arc(starLeft, starTop, starSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
  }, [width, height]);

  const createBackground = useCallback(() => {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    smallStarCreate(ctx, 200, 1);
    smallStarCreate(ctx, 50, 2);
    ctx.restore();
    ctx.save();

    bigStarCreate(ctx, 10, 1);
    bigStarCreate(ctx, 5, 2);
    const url = canvas.toDataURL('image/png');
    setBackgroundURL(url);

    ctx.restore();
    ctx.save();
  }, [canvas, width, height, smallStarCreate, bigStarCreate]);

  useEffect(() => {
    if (canvas != null) {
      createBackground();
    }
    if (width === 0 || height === 0) {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  }, [canvas, width, height, createBackground]);

  return { backgroundURL, width, height };
}

const useStyles = makeStyles(() => ({
  space: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

export default function SpaceBackground() {
  const canvasRef = useRef(null);
  const { backgroundURL, width, height } = useCanvas(canvasRef.current);
  const classes = useStyles();

  return (
    <>
      <canvas ref={canvasRef} width={width} height={height} />
      <img src={backgroundURL} className={classes.space} alt="space-background" />
    </>
  );
}
