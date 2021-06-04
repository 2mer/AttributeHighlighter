import { Box, debounce, Fade, Paper } from '@material-ui/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { START_RECORDING, STOP_RECORDING } from '../util/actions';

import styled, { createGlobalStyle } from 'styled-components'
import { blue, indigo } from '@material-ui/core/colors';
import getSelector from '../util/getUniqueSelector';

const AbsoluteWrapper = styled.div`
	position: fixed;
	z-index: 99999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	pointer-events: none;
`

const HoverEffect = styled.div`
	border: 2px solid ${blue[500]};
	box-shadow: 0 0 0 2px ${indigo[500]}, 0 0 0 4px ${indigo[500]}30;
	position: absolute;
	border-radius: 4px;
	box-sizing: border-box;
	transition: all .225s;
`

const INDICATOR_PADDING = 6;

export default function RecordingOverlay() {

	const [isRecording, setIsRecording] = useState(false)
	const [currentTarget, setCurrentTarget] = useState<null | HTMLElement>(null)

	const debouncedSetCurrentTarget = useMemo(() => {
		return debounce(setCurrentTarget, 100)
	}, [setCurrentTarget])

	useEffect(() => {

		const handleMessage = (msg: any, sender: any, sendResponse: any) => {
			switch (msg.type) {
				case START_RECORDING:
					setIsRecording(true)
					break;
				case STOP_RECORDING:
					setIsRecording(false)
					break;
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage);
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, [])

	useEffect(() => {

		const handleMouseMove = (e: MouseEvent) => {
			if (e.target !== currentTarget) {
				debouncedSetCurrentTarget(e.target as HTMLElement)
			}
		}

		document.body.addEventListener('mousemove', handleMouseMove)
		return () => {
			document.body.removeEventListener('mousemove', handleMouseMove)
		}

	}, [currentTarget])

	useEffect(() => {

		const handleClick = (e: MouseEvent) => {
			console.log(getSelector(e.target as HTMLElement))
		}

		document.body.addEventListener('click', handleClick)
		return () => {
			document.body.removeEventListener('click', handleClick)
		}
	}, [])

	const computedStyle = useMemo(() => {

		if (!currentTarget)
			return {}

		const bb = currentTarget.getBoundingClientRect()

		return {
			top: bb.top - INDICATOR_PADDING,
			left: bb.left - INDICATOR_PADDING,
			width: bb.width + (2 * INDICATOR_PADDING),
			height: bb.height + (2 * INDICATOR_PADDING),
		}

	}, [currentTarget])

	return (
		<AbsoluteWrapper>
			{/* <Paper>
					<Box>
						HELLO WORLD
					</Box>
				</Paper> */}
			<Fade in={isRecording} mountOnEnter unmountOnExit>
				<div>
					<HoverEffect style={computedStyle} />
				</div>
			</Fade>
		</AbsoluteWrapper>
	)
}
