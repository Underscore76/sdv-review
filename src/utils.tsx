function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const minutesString = minutes.toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60);
  const secondsString = seconds.toString().padStart(2, "0");
  const milliseconds = Math.floor((totalSeconds % 1) * 1000)
    .toString()
    .padStart(3, "0");
  return `${hours}:${minutesString}:${secondsString}.${milliseconds}`;
}

function interpTime(time: number, frameRate: number) {
  return (Math.floor(time * frameRate) + 0.5) / frameRate;
}

export { formatTime, interpTime };
