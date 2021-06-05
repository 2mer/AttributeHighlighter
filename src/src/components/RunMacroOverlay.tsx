import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Paper, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'

import { RUN_MACRO } from '../util/actions'

// import queryString from 'query-string'
import { Macro } from '../types'

import MacroList from './MacroList'
import MacroStepper from './MacroStepper'

const ShadeWrapper = styled.div`
	position: absolute;
	z-index: 999999;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background-color: #00000022;

	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
`

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
	}
}

export default function RunMacroOverlay() {

	const [open, setOpen] = useState(false)
	const [macro, setMacro] = useState<null | Macro>(null)
	const [currentAction, setCurrentAction] = useState(-1)

	// useEffect(() => {
	// 	const params = queryString.parse(window.location.search)
	// 	if (params.macro)
	// }, [])

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
				let index = 0;
				for (let action of macro.actions) {
					setCurrentAction(index++)
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
