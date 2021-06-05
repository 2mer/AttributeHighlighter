import { debounce, Fade } from '@material-ui/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ADD_MACRO, IS_RECORDING, START_RECORDING, STOP_RECORDING } from '../util/actions';

import styled from 'styled-components'
import { blue, indigo } from '@material-ui/core/colors';
import getSelector from '../util/getUniqueSelector';
import Timer from '../util/timer';



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

	top: 0px;
	left: 0px;
	width: 0px;
	height: 0px;
`

const INDICATOR_PADDING = 6;

export default function RecordingOverlay() {

	const [isRecording, setIsRecording] = useState(false)
	const [currentTarget, setCurrentTarget] = useState<null | HTMLElement>(null)
	const [macroActions, setMacroActions] = useState<any[]>([])
	const [timer] = useState(Timer())

	const macroActionsRef = useRef<any[]>([])
	useEffect(() => {
		macroActionsRef.current = macroActions
	}, [macroActions])

	const debouncedSetCurrentTarget = useMemo(() => {
		return debounce(setCurrentTarget, 100)
	}, [setCurrentTarget])

	useEffect(() => {

		const handleMessage = (msg: any, sender: any, sendResponse: any) => {
			switch (msg.type) {
				case START_RECORDING:
					setIsRecording(true)
					sendResponse(true)
					break;
				case STOP_RECORDING:
					setIsRecording(false)
					sendResponse(false)
					chrome.runtime.sendMessage(
						{
							type: ADD_MACRO,
							data: {
								name: 'macro1',
								actions: macroActions
							}
						}
					)
					break;
				case IS_RECORDING:
					sendResponse(isRecording)
					break;
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage);
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, [isRecording, macroActions])

	useEffect(() => {

		if (isRecording) {
			const handleMouseMove = (e: MouseEvent) => {
				if (e.target !== currentTarget) {
					debouncedSetCurrentTarget(e.target as HTMLElement)
				}
			}

			const handleScroll = () => {
				setCurrentTarget(null)
			}

			document.body.addEventListener('mousemove', handleMouseMove)
			document.body.addEventListener('wheel', handleScroll)
			return () => {
				document.body.removeEventListener('mousemove', handleMouseMove)
				document.body.removeEventListener('wheel', handleScroll)
			}
		}

	}, [currentTarget, isRecording])


	useEffect(() => {

		const handleClick = (e: MouseEvent) => {
			const sleepMS = timer.getOffset()
			const clickSelector = (getSelector(e.target as HTMLElement))

			const newActions = [...macroActions]

			if (sleepMS) newActions.push({ type: 'SLEEP', data: sleepMS })
			newActions.push({ type: 'CLICK', data: clickSelector })

			const target = (e?.target as HTMLElement)

			if (target?.tagName === 'INPUT') {
				const firstVal = (target as any).value
				const handleBlur = (e: Event) => {

					const newActions = [...macroActionsRef.current]

					const text = (e.target as any)?.value

					if (text && (text !== firstVal)) {
						const sleepMS = timer.getOffset()
						if (sleepMS) newActions.push({ type: 'SLEEP', data: sleepMS })
						newActions.push({
							type: 'TEXT', data: {
								selector: getSelector(e.target as HTMLElement),
								text
							}
						})

						setMacroActions(newActions)
					}

					e.target?.removeEventListener('blur', handleBlur)
				}

				e.target?.addEventListener('blur', handleBlur)
			}

			setMacroActions(newActions)
		}

		document.body.addEventListener('click', handleClick)
		return () => {
			document.body.removeEventListener('click', handleClick)
		}
	}, [macroActions])

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
			<Fade in={isRecording && Boolean(currentTarget)} mountOnEnter unmountOnExit>
				<div>
					<HoverEffect style={computedStyle} />
				</div>
			</Fade>
		</AbsoluteWrapper>
	)
}
