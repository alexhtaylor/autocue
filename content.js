var link = document.createElement("link");
link.href = "https://use.fontawesome.com/releases/v5.15.1/css/all.css";
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var link2 = document.createElement("link");
link2.href = "styles.css";
link2.type = "text/css";
link2.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

const myDiv = document.createElement('div');
const myTextArea = document.createElement('textarea');
const buttonNames = ["close", "clear", "undo", "toggle", "increase", "decrease", "darkmode", "resize"];
const buttons = {};
buttonNames.forEach(name => buttons[name] = document.createElement("button"));

buttons.close.textContent = '_';
buttons.clear.innerHTML = '<i class="fas fa-trash"></i>';
buttons.undo.innerHTML = '<i class="fas fa-undo"></i>';
buttons.darkmode.innerHTML = '<i class="fas fa-lightbulb"></i>'
buttons.toggle.textContent = "AQ";
buttons.increase.textContent = 'W'
buttons.decrease.textContent = 'w'
myTextArea.placeholder = "F11 (Windows) or Cmd + Shift + F (Mac) to hide tabs"
buttons.resize.innerHTML = '<i class="fas fa-expand-alt"></i>'
var icon = buttons.resize.querySelector("i");

// Rotate the icon by 90 degrees
icon.style.transform = "rotate(90deg)";

// Append the button to myTextArea
myDiv.appendChild(buttons.resize);

let startX;
let startY;
let currentWidth;
let currentHeight;

buttons.resize.addEventListener("mousedown", function(event) {
  // set the starting x and y positions when the button is clicked
  startX = event.clientX;
  startY = event.clientY;

  // set the current width and height of the textarea
  currentWidth = myTextArea.offsetWidth;
  currentHeight = myTextArea.offsetHeight;

  // add event listeners for mousemove and mouseup to track the button as it is dragged
  document.addEventListener("mousemove", moveButton);
  document.addEventListener("mouseup", stopButton);
});

function moveButton(event) {
  // calculate the change in x and y position of the button
  var changeX = event.clientX - startX;
  var changeY = event.clientY - startY;

  // increase or decrease the width and height of the textarea by the change in x and y position
  myTextArea.style.width = (currentWidth + changeX) + "px";
  myTextArea.style.height = (currentHeight + changeY) + "px";
}

function stopButton() {
  // remove the mousemove and mouseup event listeners when the button is released
  document.removeEventListener("mousemove", moveButton);
  document.removeEventListener("mouseup", stopButton);
}

let duringTransition = null
let currentDimensions = null
let topParam = '17vh'

let isOpen = null;

chrome.storage.local.get(['openState','currentDimensions', 'fontSize', 'darkMode']).then(function(result) {
  let openState = result.openState;
  let currentDimensions = result.currentDimensions;
  let fontSize = result.fontSize
  let darkMode = result.darkMode
  isOpen = openState;
  if (isOpen) {
    console.log('loading in openmode')
    if (currentDimensions && currentDimensions[0] !== "0px") {
      myTextArea.style.height = currentDimensions[1]
      myTextArea.style.width = currentDimensions[0]
      console.log('current dimensions lol', currentDimensions)
    } else {
      myTextArea.style.cssText = 'height: 100px; width: 400px;'
      console.log('current dimensions lolly', currentDimensions)
    }
    myDiv.style.cssText = "position: fixed; left: 50%; width: 33%; height: 100px; transform: translate(-50%); top: 0px; z-index: 99999; opacity: 1;";
    myTextArea.style.cssText += `padding-left: 5px; resize: none; position: absolute; left: 0; top: 0; font-size: 20px; min-width: 200px; min-height: 75px; max-height: 600px; background-color: rgba(255, 255, 255, 0.9); overflow-y: scroll; color: black; border-radius: 0px 0px 5px 5px; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -1px 0px inset; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1);`
    buttons.resize.style.cssText = "position: absolute; bottom: 0; right: -10px; z-index: 999999; background-color: transparent; color: grey; border: none; cursor: se-resize; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1)";
    const commonOpenButtonCss = "border-radius: 2px; border: 2px solid grey; background-color: grey; position: absolute; top: 0; right: -25px; margin-top: 1px; padding: 5px; width: 0; height: 0; display: flex; align-items: center; justify-content: center; color: white; z-index: 100000; font-size: 10px; cursor: pointer; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1);";
    buttons.close.style.cssText = commonOpenButtonCss;
    buttons.clear.style.cssText = commonOpenButtonCss + "top: 15px;";
    buttons.increase.style.cssText = commonOpenButtonCss + "top: 30px;";
    buttons.decrease.style.cssText = commonOpenButtonCss + "top: 45px;";
    buttons.darkmode.style.cssText = commonOpenButtonCss + "top: 60px;";
    buttons.undo.style.cssText = commonOpenButtonCss + "display: none; top: 75px;";
    buttons.toggle.style.cssText = `position: fixed; font-size: 30px; font-weight: 600; letter-spacing: -3px; color: white; top: ${topParam}; right: 20%; padding: 5px; z-index: 100000; white-space: normal; display: block; min-height: 50px; width: 65px; text-shadow: 4px 2px grey; text-align: center; cursor: pointer; border: none; border-radius: 5px 0 0 5px; background: linear-gradient(to right, #ffeb00, #ffeb00 16.6%, #01ffff 16.6% , #01ffff 33.3%, #28ed01 33.3%, #28ed01 50%, #ff3ffe 50%, #ff3ffe 66.6%, #fe2520 66.6%, #fe2520 83.3%, #0001fe 83.3%, #0001fe); box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset; transition: all 0.2s ease; transform: scale(${getScaleParams(currentDimensions)}); opacity: 0;`
    if (fontSize) { myTextArea.style.fontSize = fontSize }
    if (darkMode == true) {
      myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
      myTextArea.style.cssText += "color: white;"
      buttons.darkmode.style.cssText += 'color: black;'
    }
    } else {
      console.log('loading in closed')
      myDiv.style.cssText = "position: fixed; left: 50%; width: 33%; height: 100px; transform: translate(-50%); top: 0px; z-index: 99999; opacity: 1;";
      myTextArea.style.cssText = `padding-left: 5px; resize: none; position: absolute; left: 70vw; top: 20vh; height: 0; font-size: 20px; width: 0; min-width: 200px; min-height: 75px; max-height: 600px; background-color: rgba(255, 255, 255, 0.9); overflow-y: scroll; color: black; border-radius: 0px 0px 5px 5px; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -1px 0px inset`;
      buttons.resize.style.cssText = "position: absolute; bottom: -20vh; right: -50vw; z-index: 999999; background-color: transparent; color: grey; border: none; cursor: se-resize; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1)";
      const commonClosedButtonCss = "border-radius: 2px; border: 2px solid grey; background-color: grey; position: absolute; top: 20vh; right: -50vw; padding: 5px; width: 0; height: 0; display: flex; align-items: center; justify-content: center; color: white; z-index: 100000; font-size: 10px; cursor: pointer;";
      buttons.close.style.cssText = commonClosedButtonCss;
      buttons.clear.style.cssText = commonClosedButtonCss;
      buttons.increase.style.cssText = commonClosedButtonCss;
      buttons.decrease.style.cssText = commonClosedButtonCss;
      buttons.darkmode.style.cssText = commonClosedButtonCss;
      buttons.undo.style.cssText = commonClosedButtonCss + "display: none;";
      buttons.toggle.style.cssText = "position: fixed; font-size: 30px; font-weight: 600; letter-spacing: -3px; color: white; top: 17vh; right: 0px; padding: 5px; z-index: 100000; white-space: normal; display: block; min-height: 50px; width: 65px; text-shadow: 4px 2px grey; text-align: center; cursor: pointer; border: none; border-radius: 5px 0 0 5px; background: linear-gradient(to right, #ffeb00, #ffeb00 16.6%, #01ffff 16.6% , #01ffff 33.3%, #28ed01 33.3%, #28ed01 50%, #ff3ffe 50%, #ff3ffe 66.6%, #fe2520 66.6%, #fe2520 83.3%, #0001fe 83.3%, #0001fe); box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset; transition: all 0.2s ease;";
      if (fontSize) { myTextArea.style.fontSize = fontSize }
      if (darkMode == true) {
        myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
        myTextArea.style.cssText += "color: white;"
        buttons.darkmode.style.cssText += 'color: black;'
    }
  }

  if (chrome.storage.local.get(['textareaValue'])) {
    chrome.storage.local.get(['textareaValue'], function(result) {
      myTextArea.value = result.textareaValue;
      });
  }

  let buttonArray = [buttons.toggle, buttons.close]
  buttonArray.forEach(function(button) {
    button.addEventListener("click", () => {
      duringTransition = true
  // opening
      if (myTextArea.style.top == "20vh") {
        if (currentDimensions && currentDimensions[0] !== "0px") {
          myTextArea.style.height = currentDimensions[1]
          myTextArea.style.width = currentDimensions[0]
          console.log('current dimensions lol', currentDimensions)
        } else {
          myTextArea.style.cssText = 'height: 100px; width: 400px;'
          console.log('current dimensions lolly', currentDimensions)
        }
        myTextArea.style.cssText += "padding-left: 5px; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); left: 0; top: 0; min-width: 200px; min-height: 75px;";
        buttons.resize.style.cssText = "position: absolute; bottom: 0; right: -10px; z-index: 999999; background-color: transparent; color: grey; border: none; cursor: se-resize; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1)";
        buttons.close.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 0; margin-top: 1px;";
        buttons.clear.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 15px; margin-top: 1px;";
        buttons.increase.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 30px; margin-top: 1px;";
        buttons.decrease.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 45px; margin-top: 1px;";
        buttons.darkmode.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 60px; margin-top: 1px;";
        buttons.undo.style.cssText += "display: none; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -25px; top: 75px; margin-top: 1px;"
        buttons.toggle.style.cssText += `transform: scale(${getScaleParams(currentDimensions)}); opacity: 0; right: 20%; top: ${topParam};`
        chrome.storage.local.set({'openState': true});
      } else {
  // closing
        currentDimensions = [myTextArea.style.width, myTextArea.style.height]
        myTextArea.style.cssText += "padding-left: 5px; opacity: 0; transition: All 0.35s cubic-bezier(0.18,-0.02, 0.34, 0); height: 0; width: 0; min-width: 0; min-height: 0; left: 50vw; top: 20vh;"
        buttons.resize.style.cssText += "position: absolute; bottom: -20vh; right: -50vw; z-index: 999999; background-color: transparent; color: grey; border: none; cursor: se-resize; opacity: 1; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), bottom 0.35s cubic-bezier(0.18,-0.02, 0.34, 0)";
        buttons.close.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
        buttons.clear.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
        buttons.increase.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
        buttons.decrease.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
        buttons.darkmode.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);";
        buttons.undo.style.cssText += buttons.clear.style.cssText + "display: none;"
        buttons.toggle.style.cssText += "z-index: 100000; transform: scale(1); opacity: 1; right: 0; top: 17vh; transition: all 0.2s ease-out 0.2s; min-height: 50px; top: 17vh; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset;"
        chrome.storage.local.set({'openState': false});
      }
    });
  })

  function getScaleParams(dimensions) {
    if (dimensions == null) { dimensions = ['400px', '100px'] }
    let integerDimensions = dimensions.map(d=>parseInt(d.slice(0, -2)))
    topParam = `${integerDimensions[1]/16}vh`
    let toggleDimensions = [65, 50]
    let finalScale = integerDimensions.map((d, index)=> {
      return (((d - toggleDimensions[index])/2) + toggleDimensions[index])/toggleDimensions[index]
    })
    return `${finalScale[0]}, ${finalScale[1]}`
  }

  myTextArea.addEventListener("transitionend", function() {
    myTextArea.style.transition = "";
    console.log('buttons', Object.values(buttons))
    Object.values(buttons).forEach(button => button.style.transition = "");
    duringTransition = false
    if (myTextArea.style.top !== "20vh") {
      buttons.toggle.style.zIndex = "-10000";
      buttons.toggle.style.transition = "";
    } else {
      buttons.toggle.style.transition = "all 0.2s ease";
    }
  });

  myTextArea.addEventListener("input", function() {
    if (buttons.undo.style.display=="flex" && myTextArea.value.length > 10) {
      setTimeout(function() {
        buttons.undo.style.cssText += "display: none;"
    }, 1000);
    }
    chrome.storage.local.set({'textareaValue': myTextArea.value}, function() {
      console.log('Value is set to ' + myTextArea.value);
      });
  });

  let currentText = null
  buttons.clear.addEventListener('click', () => {

    currentText = myTextArea.value
    if (currentText.length > 0) {
      buttons.undo.style.cssText += "display: flex;"
    }
    myTextArea.value = "";
    chrome.storage.local.set({'textareaValue': myTextArea.value}, function() {
      console.log('Value is set to ' + myTextArea.value);
      });
  });

  buttons.undo.addEventListener('click', () => {
    if (currentText) {myTextArea.value = currentText}
    chrome.storage.local.set({'textareaValue': myTextArea.value})
    buttons.undo.style.cssText += "display: none;"
  });

  buttons.toggle.addEventListener("mousedown", function() {
    buttons.toggle.style.cssText += "box-shadow: none; min-height: 47px; top: 17.5vh;";
  });

  buttons.increase.addEventListener('click', () => {
    let currentFontSize = parseInt(myTextArea.style.fontSize.slice(0, -2))
      if (currentFontSize <= 36) { currentFontSize += 4 }
      myTextArea.style.fontSize = `${currentFontSize}px`
      chrome.storage.local.set({'fontSize': myTextArea.style.fontSize});
  });

  buttons.decrease.addEventListener('click', () => {
    let currentFontSize = parseInt(myTextArea.style.fontSize.slice(0, -2))
    if (currentFontSize >= 10) { currentFontSize -= 4 }
    myTextArea.style.fontSize = `${currentFontSize}px`
    chrome.storage.local.set({'fontSize': myTextArea.style.fontSize});
    // myTextArea.style.backgroundColor = "rgba(0, 0, 0, 0.8);"
    // myTextArea.style.color = "white;"
  });

  buttons.darkmode.addEventListener('click', () => {
    if (buttons.darkmode.style.color == 'white') {
      myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
      myTextArea.style.cssText += "color: white;"
      buttons.darkmode.style.cssText += 'color: black;'
      chrome.storage.local.set({'darkMode': true});
    } else {
      myTextArea.style.cssText += "background-color: rgba(255, 255, 255, 0.9);"
      myTextArea.style.cssText += "color: black;"
      console.log('new bg color', myTextArea.style.color)
      buttons.darkmode.style.cssText += 'color: white;'
      chrome.storage.local.set({'darkMode': false});
    }
  })

  const resizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
        myDiv.style.width = entry.target.clientWidth + "px";
        myDiv.style.height = entry.target.clientHeight + "px";
        myTextArea.style.maxWidth = `${document.body.clientWidth * 0.8}px`
        myTextArea.style.maxHeight = `${document.body.clientHeight * 0.8}px`
        if (myTextArea.style.top !== "20vh" && !duringTransition) {
          buttons.toggle.style.cssText += `transform: scale(${getScaleParams([`${entry.target.clientWidth} + "px"`, `${entry.target.clientHeight} + "px"`])}); top: ${topParam};`
        }
    });
    addEventListener('mouseup', () => {
      chrome.storage.local.set({'currentDimensions': [myTextArea.style.width, myTextArea.style.height]}, function() {
        console.log('CurrentDimensions set', [myTextArea.style.width, myTextArea.style.height]);
        });
    });
  });

  const bodyResizeObserver = new ResizeObserver(entries => {
    entries.forEach(entry => {
      myTextArea.style.maxWidth = `${document.body.clientWidth * 0.8}px`
      myTextArea.style.maxHeight = `${document.body.clientHeight * 0.8}px`
    });
  });

  resizeObserver.observe(myTextArea);
  bodyResizeObserver.observe(document.body);

  myDiv.appendChild(myTextArea);
  myDiv.appendChild(buttons.close);
  myDiv.appendChild(buttons.clear);
  myDiv.appendChild(buttons.increase);
  myDiv.appendChild(buttons.decrease);
  myDiv.appendChild(buttons.undo);
  myDiv.appendChild(buttons.darkmode);
  document.body.appendChild(myDiv);
  document.body.appendChild(buttons.toggle);
});













// VERSION THAT WORKS WITH NORMAL WEBPAGES BUT NOT GOOGLE MEET
// var link = document.createElement("link");
// link.href = "https://use.fontawesome.com/releases/v5.15.1/css/all.css";
// link.type = "text/css";
// link.rel = "stylesheet";
// document.getElementsByTagName("head")[0].appendChild(link);

// var link2 = document.createElement("link");
// link2.href = "styles.css";
// link2.type = "text/css";
// link2.rel = "stylesheet";
// document.getElementsByTagName("head")[0].appendChild(link);

// const myDiv = document.createElement('div');
// const myTextArea = document.createElement('textarea');
// const buttonNames = ["close", "clear", "undo", "toggle", "increase", "decrease", "darkmode"];
// const buttons = {};

// buttonNames.forEach(name => buttons[name] = document.createElement("button"));

// buttons.close.textContent = '_';
// buttons.clear.innerHTML = '<i class="fas fa-trash"></i>';
// buttons.undo.innerHTML = '<i class="fas fa-undo"></i>';
// buttons.darkmode.innerHTML = '<i class="fas fa-lightbulb"></i>'
// buttons.toggle.textContent = "AQ";
// buttons.increase.textContent = 'W'
// buttons.decrease.textContent = 'w'
// myTextArea.placeholder = "F11 (Windows) or Cmd + Shift + F (Mac) to hide tabs"

// let duringTransition = null
// let currentDimensions = null
// let topParam = '17vh'


// let isOpen = null;



// chrome.storage.local.get(['openState','currentDimensions', 'fontSize', 'darkMode']).then(function(result) {
//   let openState = result.openState;
//   let currentDimensions = result.currentDimensions;
//   let fontSize = result.fontSize
//   let darkMode = result.darkMode
//   console.log('openstate in promise', openState);
//   console.log('dimensions in promise', currentDimensions);
//   console.log('fontSize in p', fontSize);
//   console.log('darkmode in p', darkMode);
//   isOpen = openState;
//   if (isOpen) {
//     console.log('loading in openmode')
//     if (currentDimensions) {
//       myTextArea.style.height = currentDimensions[1]
//       myTextArea.style.width = currentDimensions[0]
//     } else {
//       myTextArea.style.cssText = 'height: 100px; width: 400px;'
//     }
//     myDiv.style.cssText = "position: fixed; left: 50%; width: 33%; height: 100px; transform: translate(-50%); top: 0px; z-index: 99999; opacity: 1;";
//     myTextArea.style.cssText += `position: absolute; left: 0; top: 0; font-size: 20px; min-width: 200px; min-height: 75px; max-height: 600px; background-color: rgba(255, 255, 255, 0.9); overflow-y: scroll; color: black; border-radius: 0px 0px 5px 5px; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -1px 0px inset; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1);`
//     const commonOpenButtonCss = "border-radius: 2px; border: 2px solid grey; background-color: grey; position: absolute; top: 0; right: -17px; margin-top: 1px; padding: 5px; width: 0; height: 0; display: flex; align-items: center; justify-content: center; color: white; z-index: 100000; font-size: 10px; cursor: pointer; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1);";
//     buttons.close.style.cssText = commonOpenButtonCss;
//     buttons.clear.style.cssText = commonOpenButtonCss + "top: 15px;";
//     buttons.increase.style.cssText = commonOpenButtonCss + "top: 30px;";
//     buttons.decrease.style.cssText = commonOpenButtonCss + "top: 45px;";
//     buttons.darkmode.style.cssText = commonOpenButtonCss + "top: 60px;";
//     buttons.undo.style.cssText = commonOpenButtonCss + "display: none; top: 75px;";
//     buttons.toggle.style.cssText = `position: fixed; font-size: 30px; font-weight: 600; letter-spacing: -3px; color: white; top: ${topParam}; right: 20%; padding: 5px; z-index: 100000; white-space: normal; display: block; min-height: 50px; width: 65px; text-shadow: 4px 2px grey; text-align: center; cursor: pointer; border: none; border-radius: 5px 0 0 5px; background: linear-gradient(to right, #ffeb00, #ffeb00 16.6%, #01ffff 16.6% , #01ffff 33.3%, #28ed01 33.3%, #28ed01 50%, #ff3ffe 50%, #ff3ffe 66.6%, #fe2520 66.6%, #fe2520 83.3%, #0001fe 83.3%, #0001fe); box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset; transition: all 0.2s ease; transform: scale(${getScaleParams(currentDimensions)}); opacity: 0;`
//     if (fontSize) { myTextArea.style.fontSize = fontSize }
//     if (darkMode == true) {
//       myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
//       myTextArea.style.cssText += "color: white;"
//       buttons.darkmode.style.cssText += 'color: black;'
//     }
//     } else {
//       console.log('loading in closed')
//     myDiv.style.cssText = "position: fixed; left: 50%; width: 33%; height: 100px; transform: translate(-50%); top: 0px; z-index: 99999; opacity: 1;";
//     myTextArea.style.cssText = `position: absolute; left: 70vw; top: 20vh; height: 0; font-size: 20px; width: 0; min-width: 200px; min-height: 75px; max-height: 600px; background-color: rgba(255, 255, 255, 0.9); overflow-y: scroll; color: black; border-radius: 0px 0px 5px 5px; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -1px 0px inset`;

//     const commonClosedButtonCss = "border-radius: 2px; border: 2px solid grey; background-color: grey; position: absolute; top: 20vh; right: -50vw; padding: 5px; width: 0; height: 0; display: flex; align-items: center; justify-content: center; color: white; z-index: 100000; font-size: 10px; cursor: pointer;";
//     buttons.close.style.cssText = commonClosedButtonCss;
//     buttons.clear.style.cssText = commonClosedButtonCss;
//     buttons.increase.style.cssText = commonClosedButtonCss;
//     buttons.decrease.style.cssText = commonClosedButtonCss;
//     buttons.darkmode.style.cssText = commonClosedButtonCss;
//     buttons.undo.style.cssText = commonClosedButtonCss + "display: none;";
//     buttons.toggle.style.cssText = "position: fixed; font-size: 30px; font-weight: 600; letter-spacing: -3px; color: white; top: 17vh; right: 0px; padding: 5px; z-index: 100000; white-space: normal; display: block; min-height: 50px; width: 65px; text-shadow: 4px 2px grey; text-align: center; cursor: pointer; border: none; border-radius: 5px 0 0 5px; background: linear-gradient(to right, #ffeb00, #ffeb00 16.6%, #01ffff 16.6% , #01ffff 33.3%, #28ed01 33.3%, #28ed01 50%, #ff3ffe 50%, #ff3ffe 66.6%, #fe2520 66.6%, #fe2520 83.3%, #0001fe 83.3%, #0001fe); box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset; transition: all 0.2s ease;";
//     if (fontSize) { myTextArea.style.fontSize = fontSize }
//     if (darkMode == true) {
//       myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
//       myTextArea.style.cssText += "color: white;"
//       buttons.darkmode.style.cssText += 'color: black;'
//     }
//   }

//   if (chrome.storage.local.get(['textareaValue'])) {
//     chrome.storage.local.get(['textareaValue'], function(result) {
//       myTextArea.value = result.textareaValue;
//       });
//   }

//   let buttonArray = [buttons.toggle, buttons.close]
//   buttonArray.forEach(function(button) {
//     button.addEventListener("click", () => {
//       duringTransition = true
//   // opening
//       if (myTextArea.style.top == "20vh") {
//         if (currentDimensions) {
//           myTextArea.style.height = currentDimensions[1]
//           myTextArea.style.width = currentDimensions[0]
//         } else {
//           myTextArea.style.cssText += 'height: 100px; width: 400px;'
//         }
//         myTextArea.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); left: 0; top: 0; min-width: 200px; min-height: 75px;";
//         buttons.close.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 0; margin-top: 1px;";
//         buttons.clear.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 15px; margin-top: 1px;";
//         buttons.increase.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 30px; margin-top: 1px;";
//         buttons.decrease.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 45px; margin-top: 1px;";
//         buttons.darkmode.style.cssText += "opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 60px; margin-top: 1px;";
//         buttons.undo.style.cssText += "display: none; opacity: 1; transition: All 0.35s cubic-bezier(0.57, 1.18, 0.83, 1); right: -17px; top: 75px; margin-top: 1px;"
//         buttons.toggle.style.cssText += `transform: scale(${getScaleParams(currentDimensions)}); opacity: 0; right: 20%; top: ${topParam};`
//         chrome.storage.local.set({'openState': true});
//       } else {
//   // closing
//         currentDimensions = [myTextArea.style.width, myTextArea.style.height]
//         myTextArea.style.cssText += "opacity: 0; transition: All 0.35s cubic-bezier(0.18,-0.02, 0.34, 0); height: 0; width: 0; min-width: 0; min-height: 0; left: 50vw; top: 20vh;"
//         buttons.close.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
//         buttons.clear.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
//         buttons.increase.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
//         buttons.decrease.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);"
//         buttons.darkmode.style.cssText += "opacity: 0; right: -50vw; top: 20vh; transition: opacity 0.2s cubic-bezier(0.18,-0.02, 0.34, 0), right 0.35s cubic-bezier(0.18,-0.02, 0.34, 0), top 0.35s cubic-bezier(0.18,-0.02, 0.34, 0);";
//         buttons.undo.style.cssText += buttons.clear.style.cssText + "display: none;"
//         buttons.toggle.style.cssText += "z-index: 100000; transform: scale(1); opacity: 1; right: 0; top: 17vh; transition: all 0.2s ease-out 0.2s; min-height: 50px; top: 17vh; box-shadow: rgb(0 0 0 / 40%) 0px 2px 4px, rgb(0 0 0 / 20%) 0px -3px 0px inset;"
//         chrome.storage.local.set({'openState': false});
//       }
//     });
//   })

//   function getScaleParams(dimensions) {
//     if (dimensions == null) { dimensions = ['400px', '100px'] }
//     let integerDimensions = dimensions.map(d=>parseInt(d.slice(0, -2)))
//     topParam = `${integerDimensions[1]/16}vh`
//     let toggleDimensions = [65, 50]
//     let finalScale = integerDimensions.map((d, index)=> {
//       return (((d - toggleDimensions[index])/2) + toggleDimensions[index])/toggleDimensions[index]
//     })
//     return `${finalScale[0]}, ${finalScale[1]}`
//   }

//   myTextArea.addEventListener("transitionend", function() {
//     myTextArea.style.transition = "";
//     Object.values(buttons).forEach(button => button.style.transition = "");
//     duringTransition = false
//     if (myTextArea.style.top !== "20vh") {
//       buttons.toggle.style.zIndex = "-10000";
//       buttons.toggle.style.transition = "";
//     } else {
//       buttons.toggle.style.transition = "all 0.2s ease";
//     }
//   });

//   myTextArea.addEventListener("input", function() {
//     if (buttons.undo.style.display=="flex" && myTextArea.value.length > 10) {
//       setTimeout(function() {
//         buttons.undo.style.cssText += "display: none;"
//     }, 1000);
//     }
//     chrome.storage.local.set({'textareaValue': myTextArea.value}, function() {
//       console.log('Value is set to ' + myTextArea.value);
//       });
//   });

//   let currentText = null
//   buttons.clear.addEventListener('click', () => {

//     currentText = myTextArea.value
//     if (currentText.length > 0) {
//       buttons.undo.style.cssText += "display: flex;"
//     }
//     myTextArea.value = "";
//     chrome.storage.local.set({'textareaValue': myTextArea.value}, function() {
//       console.log('Value is set to ' + myTextArea.value);
//       });
//   });

//   buttons.undo.addEventListener('click', () => {
//     if (currentText) {myTextArea.value = currentText}
//     chrome.storage.local.set({'textareaValue': myTextArea.value})
//     buttons.undo.style.cssText += "display: none;"
//   });

//   buttons.toggle.addEventListener("mousedown", function() {
//     buttons.toggle.style.cssText += "box-shadow: none; min-height: 47px; top: 17.5vh;";
//   });

//   buttons.increase.addEventListener('click', () => {
//     let currentFontSize = parseInt(myTextArea.style.fontSize.slice(0, -2))
//       if (currentFontSize <= 36) { currentFontSize += 4 }
//       myTextArea.style.fontSize = `${currentFontSize}px`
//       chrome.storage.local.set({'fontSize': myTextArea.style.fontSize});
//   });

//   buttons.decrease.addEventListener('click', () => {
//     let currentFontSize = parseInt(myTextArea.style.fontSize.slice(0, -2))
//     if (currentFontSize >= 10) { currentFontSize -= 4 }
//     myTextArea.style.fontSize = `${currentFontSize}px`
//     chrome.storage.local.set({'fontSize': myTextArea.style.fontSize});
//     // myTextArea.style.backgroundColor = "rgba(0, 0, 0, 0.8);"
//     // myTextArea.style.color = "white;"
//   });

//   buttons.darkmode.addEventListener('click', () => {
//     if (buttons.darkmode.style.color == 'white') {
//       myTextArea.style.cssText += "background-color: rgba(60, 60, 60, 0.9);"
//       myTextArea.style.cssText += "color: white;"
//       buttons.darkmode.style.cssText += 'color: black;'
//       chrome.storage.local.set({'darkMode': true});
//     } else {
//       myTextArea.style.cssText += "background-color: rgba(255, 255, 255, 0.9);"
//       myTextArea.style.cssText += "color: black;"
//       console.log('new bg color', myTextArea.style.color)
//       buttons.darkmode.style.cssText += 'color: white;'
//       chrome.storage.local.set({'darkMode': false});
//     }
//   })

//   const resizeObserver = new ResizeObserver(entries => {
//     entries.forEach(entry => {
//         myDiv.style.width = entry.target.clientWidth + "px";
//         myDiv.style.height = entry.target.clientHeight + "px";
//         myTextArea.style.maxWidth = `${document.body.clientWidth * 0.8}px`
//         myTextArea.style.maxHeight = `${document.body.clientHeight * 0.8}px`
//         if (myTextArea.style.top !== "20vh" && !duringTransition) {
//           buttons.toggle.style.cssText += `transform: scale(${getScaleParams([`${entry.target.clientWidth} + "px"`, `${entry.target.clientHeight} + "px"`])}); top: ${topParam};`
//         }
//     });
//     addEventListener('mouseup', () => {
//       chrome.storage.local.set({'currentDimensions': [myTextArea.style.width, myTextArea.style.height]}, function() {
//         console.log('CurrentDimensions set', [myTextArea.style.width, myTextArea.style.height]);
//         });
//     });
//   });

//   const bodyResizeObserver = new ResizeObserver(entries => {
//     entries.forEach(entry => {
//       myTextArea.style.maxWidth = `${document.body.clientWidth * 0.8}px`
//       myTextArea.style.maxHeight = `${document.body.clientHeight * 0.8}px`
//     });
//   });

//   resizeObserver.observe(myTextArea);
//   bodyResizeObserver.observe(document.body);

//   myDiv.appendChild(myTextArea);
//   myDiv.appendChild(buttons.close);
//   myDiv.appendChild(buttons.clear);
//   myDiv.appendChild(buttons.increase);
//   myDiv.appendChild(buttons.decrease);
//   myDiv.appendChild(buttons.undo);
//   myDiv.appendChild(buttons.darkmode);
//   document.body.appendChild(myDiv);
//   document.body.appendChild(buttons.toggle);
// });
