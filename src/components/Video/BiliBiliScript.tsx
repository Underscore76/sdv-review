export const scriptText = `
// this script will insert a set of video controller buttons above the right panel to assist with retiming on BiliBili
// tested in Chrome 124.0.6367.210 
(function () {
  const videoWrapper = "bpx-player-video-wrap";
  const frameRateID = "frameRate-input";
  const resultDivID = "output-time";
  const rightPanelID = "up-panel-container";
  const startTimeID = "start-time";
  const endTimeID = "end-time";

  function getVideo() {
    const wrapper = document.getElementsByClassName(videoWrapper)[0];
    return wrapper.firstChild;
  }

  function insertButton(id, text, onClick, parent) {
    let button = document.getElementById(id);
    if (button === null) {
      button = document.createElement("button");
      button.appendChild(document.createTextNode(text));
      if (id !== null) {
        button.setAttribute("id", id);
      }
      button.addEventListener("click", onClick);
      parent.insertBefore(button, parent.firstChild);
    }
    return button;
  }
  function insertFrameRateInput(id, parent) {
    let inputDiv = document.getElementById(id);
    if (inputDiv === null) {
      inputDiv = document.createElement("input");
      inputDiv.setAttribute("value", 30);
      inputDiv.setAttribute("id", id);
      parent.insertBefore(inputDiv, parent.firstChild);
    }
  }

  function advance(n) {
    if (n === null || n === undefined) {
      n = 1;
    }
    getVideo().pause();
    getVideo().currentTime += n / getDivValue(frameRateID);
  }

  function setTime(t) {
    getVideo().currentTime = t;
  }
  function insertHiddenDiv(id, parent) {
    let ele = document.getElementById(id);
    if (ele === null) {
      ele = document.createElement("div");
      ele.setAttribute("id", id);
      ele.setAttribute("value", null);
      ele.style.visibility = "hidden";
      ele.style.display = "none";
      parent.insertBefore(ele, parent.firstChild);
    }
  }

  function setDivValue(id, value) {
    const ele = document.getElementById(id);
    if (ele !== null) {
      ele.setAttribute("value", value);
    }
  }
  function getDivValue(id, value) {
    const ele = document.getElementById(id);
    if (ele === null) {
      return null;
    } else {
      return Number(ele.getAttribute("value"));
    }
  }
  function setTimeDiv(id) {
    const time = getVideo().currentTime;
    setDivValue(id, time);
    updateElapsed();
  }

  function insertResultDiv(parent) {
    let ele = document.getElementById(resultDivID);
    if (ele === null) {
      ele = document.createElement("div");
      ele.innerHTML += \`<div>ModEdit: Retimed to <span id="\${resultDivID}"></span></div>\`;
      parent.insertBefore(ele, parent.firstChild);
    }
  }

  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const minutesString = minutes.toString().padStart(2, "0");
    const seconds = Math.floor(totalSeconds % 60);
    const secondsString = seconds.toString().padStart(2, "0");
    const milliseconds = Math.floor((totalSeconds % 1) * 1000)
      .toString()
      .padStart(3, "0");
    return \`\${hours}:\${minutesString}:\${secondsString}.\${milliseconds}\`;
  }

  function interpTime(time, frameRate) {
    return (Math.floor(time * frameRate) + 0.5) / frameRate;
  }

  function updateElapsed() {
    const frameRate = getDivValue(frameRateID);
    if (isNaN(frameRate)) {
      console.error("frame rate is unset");
      return;
    }
    const start = getDivValue(startTimeID);
    if (isNaN(start)) {
      console.error("start time is unset");
      return;
    }
    const end = getDivValue(endTimeID);
    if (isNaN(end)) {
      console.error("end time is unset");
      return;
    }
    const startTime = Math.min(start, end);
    const endTime = Math.max(start, end);
    const interpStartTime = interpTime(startTime, frameRate);
    const interpEndTime = interpTime(endTime, frameRate);
    const duration = interpEndTime - interpStartTime;

    document.getElementById(resultDivID).textContent = formatTime(duration);
  }

  function triggerHelp() {
    const content = \`
              Retiming script for Bilibili
              To get the frame rate, right click the video and select the bottom most option (视频统计信息)
              You'll see the frame rate on the resolution line as "X x Y@fps"
              By default (without an account) it should be 30 fps.
              Clicking "Set Start" or "Set End" will set the respective times and update the result text.
          \`;
    alert(content);
  }

  // NOTE: divs are inserted in opposite order because everything is added via an insertBefore
  // result block
  const rightPanel = document.getElementsByClassName(rightPanelID)[0];
  insertResultDiv(rightPanel);
  // video controller block
  rightPanel.insertBefore(document.createElement("br"), rightPanel.firstChild);
  insertButton("advance60-button", "> 60", () => advance(60), rightPanel);
  insertButton("advance30-button", "> 30", () => advance(30), rightPanel);
  insertButton("advance10-button", "> 10", () => advance(10), rightPanel);
  insertButton("advance5-button", "> 5", () => advance(5), rightPanel);
  insertButton("advance1-button", "> 1", () => advance(1), rightPanel);
  insertButton("reverse1-button", "< 1", () => advance(-1), rightPanel);
  insertButton("reverse5-button", "< 5", () => advance(-5), rightPanel);
  insertButton("reverse10-button", "< 10", () => advance(-10), rightPanel);
  insertButton("reverse30-button", "< 30", () => advance(-30), rightPanel);
  insertButton("reverse60-button", "< 60", () => advance(-60), rightPanel);

  // timing block
  rightPanel.insertBefore(document.createElement("br"), rightPanel.firstChild);
  insertHiddenDiv(startTimeID, rightPanel);
  insertHiddenDiv(endTimeID, rightPanel);
  insertFrameRateInput(frameRateID, rightPanel);
  insertButton(
    "endTime-button",
    "Set End",
    () => setTimeDiv(endTimeID),
    rightPanel,
  );
  insertButton(
    "startTime-button",
    "Set Start",
    () => setTimeDiv(startTimeID),
    rightPanel,
  );
  insertButton("help-button", "Help", triggerHelp, rightPanel);
})();
`;
