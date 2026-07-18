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

function copyClipboard(e: React.MouseEvent<HTMLElement>) {
  navigator.clipboard.writeText(e.currentTarget.innerText);
}

function copyTextClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

function normalizeExternalUrl(url: string) {
  const trimmedUrl = url.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedUrl)) {
    return trimmedUrl;
  }
  if (trimmedUrl.startsWith("//")) {
    return `https:${trimmedUrl}`;
  }
  if (
    /^(www\.|youtube\.com|youtu\.be|twitch\.tv|bilibili\.com|b23\.tv)/i.test(
      trimmedUrl,
    )
  ) {
    return `https://${trimmedUrl}`;
  }
  return trimmedUrl;
}

export {
  formatTime,
  interpTime,
  copyClipboard,
  copyTextClipboard,
  normalizeExternalUrl,
};
