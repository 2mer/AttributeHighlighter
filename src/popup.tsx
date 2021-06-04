import { Box, Button, Card, CardActions, CardContent, CardHeader, IconButton, MuiThemeProvider, Paper, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import theme from "./src/theme";

// icons
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ReplayIcon from '@material-ui/icons/Replay';
import { red } from "@material-ui/core/colors";
import { START_RECORDING, STOP_RECORDING } from "./src/util/actions";


const Popup = () => {
	// const [count, setCount] = useState(0);
	// const [currentURL, setCurrentURL] = useState<string>();

	//   useEffect(() => {
	//     chrome.browserAction.setBadgeText({ text: count.toString() });
	//   }, [count]);

	//   useEffect(() => {
	//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	//       setCurrentURL(tabs[0].url);
	//     });
	//   }, []);

	//   const changeBackground = () => {
	//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	//       const tab = tabs[0];
	//       if (tab.id) {
	//         chrome.tabs.sendMessage(
	//           tab.id,
	//           {
	//             color: "#555555",
	//           },
	//           (msg) => {
	//             console.log("result message:", msg);
	//           }
	//         );
	//       }
	//     });
	//   };

	const [isRecording, setIsRecording] = useState(false)

	// load state on mount
	useEffect(() => {
		chrome.storage.sync.get(
			{
				isRecording: false,
			},
			items => {
				setIsRecording(items.isRecording)
			}
		)
	}, [])

	const handleRecordingButtonClicked = React.useCallback(() => {

		const toggleTo = !isRecording

		chrome.storage.sync.set(
			{
				isRecording: toggleTo,
			},
			() => setIsRecording(toggleTo)
		)

	}, [isRecording])


	// update content script
	useEffect(() => {

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						type: isRecording ? START_RECORDING : STOP_RECORDING
					},
					(msg) => {
						console.log("result message:", msg);
					}
				);
			}
		});

	}, [isRecording])

	return (
		<Box width="300px" display="flex" flexDirection="column" gridGap="1rem">
			<Card variant="outlined">
				<CardContent>
					<Box display="flex" justifyContent="center" alignItems="center">
						<Typography align="center" color="primary" variant="h5">Re:Me</Typography>
						<ReplayIcon color="primary" />
					</Box>
				</CardContent>
			</Card>

			<Paper variant="outlined">
				<Box display="flex" justifyContent="space-around" padding="0.5rem">
					<Tooltip title={`${isRecording ? 'stop' : 'start'} recording`} arrow>
						<span>
							<IconButton {...(isRecording ? { style: { color: red[500] } } : {})} size="small" onClick={handleRecordingButtonClicked}>
								<RadioButtonCheckedIcon />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Paper>
		</Box>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<MuiThemeProvider theme={theme}>
			<Popup />
		</MuiThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
