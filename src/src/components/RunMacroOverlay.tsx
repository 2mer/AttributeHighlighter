import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Paper, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'

import { RUN_MACRO } from '../util/actions'

// import queryString from 'query-string'
import { Macro } from '../types'

// import MacroList from './MacroList'
import MacroStepper from './MacroStepper'
import { useSnackbar } from 'notistack'


const StyledDialog = styled(Dialog)`
	direction: ltr;
	& * {
		direction: ltr;
	}
`

const MACRO_ACTIONS: any = {
	SLEEP: async (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(() => resolve('OK'), ms)
		})
	},

	CLICK: (selector: string) => {
		const el = document.querySelector(selector)
		if (el) {
			(el as HTMLElement).click()
		}
	},

	TEXT: ({ selector, text }: { selector: string, text: string }) => {
		const el = document.querySelector(selector) as HTMLElement
		el.focus()
		document.execCommand('insertHTML', false, text)
	}
}

export default function RunMacroOverlay() {

	const [open, setOpen] = useState(false)
	const [macro, setMacro] = useState<null | Macro>(null)
	const [currentAction, setCurrentAction] = useState(-1)
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	// const xxx = useSnackbar();

	// console.log(xxx)

	useEffect(() => {

		const handleMessage = (msg: any) => {
			if (msg.type === RUN_MACRO) {
				setMacro(msg.data)
				setOpen(true)
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage)
		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, [])

	const handleRunMacroClicked = useCallback(() => {
		(async () => {
			if (macro) {
				setOpen(false)
				let index = 0;
				for (let action of macro.actions) {
					setCurrentAction(index++)
					enqueueSnackbar(`${action.type} - ${action.data} ...`, { variant: 'info' })
					await (MACRO_ACTIONS[action.type])(action.data)
				}
			}
		})()
	}, [macro])

	return (
		<StyledDialog open={open && Boolean(macro)}>
			<DialogTitle>
				{macro?.name}
			</DialogTitle>
			<DialogContent>
				<MacroStepper macro={macro} activeStep={currentAction} />
			</DialogContent>
			<DialogActions>
				<Button variant="contained" disableElevation onClick={() => setOpen(false)}>CANCEL</Button>
				<Button variant="contained" disableElevation color="primary" onClick={handleRunMacroClicked}>RUN MACRO</Button>
			</DialogActions>
		</StyledDialog>
	)
}
