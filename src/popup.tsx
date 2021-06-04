import { Box, Button, Card, CardActions, CardContent, Divider, IconButton, List, ListItem, MuiThemeProvider, Paper, Tooltip, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import theme from "./src/theme";

// icons
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import ReplayIcon from '@material-ui/icons/Replay';
import { red } from "@material-ui/core/colors";
import { IS_RECORDING, START_RECORDING, STOP_RECORDING, ADDED_MACRO } from "./src/util/actions";
import { Macro } from "./src/types";


const Popup = () => {
	const [isRecording, setIsRecording] = useState(false)
	const [macros, setMacros] = useState([])

	// load state on mount (from current tab)
	useEffect(() => {

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						type: IS_RECORDING
					},
					(msg) => {
						setIsRecording(msg)
					}
				);
			}
		});

		const fetchMacros = () => {
			chrome.storage.sync.get({
				macros: []
			}, (items) => {
				setMacros(items.macros)
			})
		}

		fetchMacros()

		const handleMessage = (msg: any) => {
			if (msg.type === ADDED_MACRO) fetchMacros()
		}

		chrome.runtime.onMessage.addListener(handleMessage)
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, [])

	const handleRecordingButtonClicked = React.useCallback(() => {

		const toggleTo = !isRecording

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tab = tabs[0];
			if (tab.id) {
				chrome.tabs.sendMessage(
					tab.id,
					{
						type: toggleTo ? START_RECORDING : STOP_RECORDING
					},
					(msg) => {
						setIsRecording(msg)
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
					{Boolean(macros.length) && (
						<Paper variant="outlined">
							<List>
								{macros.map((macro: Macro) => {
									return (
										<ListItem button key={macro.name}>{macro.name}</ListItem>
									)
								})}
							</List>
						</Paper>
					)}
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
