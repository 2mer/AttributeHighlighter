import { Avatar, Box, CircularProgress, IconButton, Paper, Slide, Tooltip, Typography } from '@material-ui/core'
import React, { useCallback, useState } from 'react'
import { Macro, MacroAction, MacroActionData } from '../types'

import ConsoleLineIcon from 'mdi-material-ui/ConsoleLine'
import StopIcon from 'mdi-material-ui/Stop'
import { blue } from '@material-ui/core/colors'
import TimedProgressBar from './TimedProgressBar'

import styled from 'styled-components'

const Stack = styled.div`
	display: 'grid';
	place-items: center;

	& > * {
		grid-row: 1;
		grid-column: 1;
	}

`

const MACRO_ACTIONS: any = {
	SLEEP: async ({ time }: MacroActionData) => {
		return new Promise((resolve) => {
			setTimeout(() => resolve('OK'), time)
		})
	},

	CLICK: ({ selector }: MacroActionData) => {
		const el = document.querySelector(selector || '')
		if (el) {
			(el as HTMLElement).click()
		}
	},

	TEXT: ({ selector, text }: MacroActionData) => {
		const el = document.querySelector(selector || '') as HTMLElement
		el.focus()
		document.execCommand('insertHTML', false, text)
	}
}

export default function RunningMacroControl({
	macro = undefined as (undefined | Macro)
}) {

	const [currentAction, setCurrentAction] = useState<null | MacroAction>(null)
	const [stopping, setStopping] = useState(false)
	const [open, setOpen] = useState(false)

	// const [currentActionMs, setCurrentActionMs] = useState(0)

	const handleRunMacroClicked = useCallback(() => {
		(async () => {
			if (macro) {
				setOpen(true)
				for (let action of macro.actions) {
					if (stopping) break;
					setCurrentAction(action)
					// enqueueSnackbar(`${action.type} - ${action.data} ...`, { variant: 'info' })
					await (MACRO_ACTIONS[action.type])(action.data)
				}
				setOpen(false)
			}
		})()
	}, [macro])

	return (
		<Slide in={open} direction="up">
			<Paper variant="outlined">
				<Box display="flex" gridGap="10px" alignItems="center">
					<Avatar style={{ background: blue[500] }}>
						<ConsoleLineIcon />
					</Avatar>


					<Box>
						<Typography>{currentAction?.type}</Typography>
						<TimedProgressBar ms={currentAction?.data?.time} />
					</Box>

					<Tooltip title={stopping ? 'stopping macro...' : 'stop macro'}>
						<Stack>
							{(stopping) && (
								<CircularProgress variant="indeterminate" size={24} />
							)}
							<IconButton onClick={() => setStopping(true)} disabled={stopping}>
								<StopIcon />
							</IconButton>
						</Stack>
					</Tooltip>
				</Box>
			</Paper>
		</Slide>
	)
}
