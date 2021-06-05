
// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   if (msg.color) {
//     console.log("Receive color = " + msg.color);
//     document.body.style.backgroundColor = msg.color;
//     sendResponse("Change color to " + msg.color);
//   } else {
//     sendResponse("Color message is none.");
//   }

// console.log('Hey guys, content script mounter!!!')

import { MuiThemeProvider } from '@material-ui/core';
import React from 'react'
import ReactDOM from "react-dom";
import RecordingOverlay from './src/components/RecordingOverlay';
import RunMacroOverlay from './src/components/RunMacroOverlay';
import theme from './src/theme';

const remeRoot = document.createElement('div')
remeRoot.id = 'reme__root'
document.body.append(remeRoot)

ReactDOM.render((
	<MuiThemeProvider theme={theme}>
		<RecordingOverlay />
		<RunMacroOverlay />
	</MuiThemeProvider>
), remeRoot)

console.log('%c ReMe content script loaded!', 'padding: 1rem; border: 4px solid indigo; color: indigo; font-weight: 900; background: #ce9df1; border-radius: 8px')