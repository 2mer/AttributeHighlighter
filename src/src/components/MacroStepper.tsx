import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Step, StepConnector, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core'
import React from 'react'
import { Macro } from '../types'

import CursorDefaultClickIcon from 'mdi-material-ui/CursorDefaultClick'
import SleepIcon from 'mdi-material-ui/Sleep'
import CloseIcon from 'mdi-material-ui/Close'
import { blue } from '@material-ui/core/colors'

export default function MacroStepper({
	macro = null as (null | Macro),
	activeStep = -1
}) {

	return (
		<>
			{Boolean(macro) && (
				<Stepper activeStep={activeStep} orientation="vertical">
					{macro?.actions.map((action, index) => {
						return (
							<Step key={index} expanded>
								<StepLabel icon={
									<ListItemAvatar>
										<Avatar style={{ backgroundColor: blue[500], width: 24, height: 24 }}>
											{(action.type === 'CLICK') && <CursorDefaultClickIcon fontSize="small" />}
											{(action.type === 'SLEEP') && <SleepIcon fontSize="small" />}
										</Avatar>
									</ListItemAvatar>
								}>
									{Boolean(index === activeStep) ? (
										<span style={{ background: blue[500], color: '#FAFAFA' }} >{action.type}</span>
									) : (
										action.type
									)}
								</StepLabel>

								<StepContent>
									{/* text */}
									<Typography color="textSecondary" variant="subtitle2" style={{ backgroundColor: '#00000036', padding: '6px 12px', borderRadius: 8 }}>{action.data}</Typography>
								</StepContent>


								{/* delete */}
								{/* {!readonly && (
									<ListItemSecondaryAction>
										<IconButton edge="end">
											<CloseIcon />
										</IconButton>
									</ListItemSecondaryAction>
								)} */}
							</Step>
						)
					})}
				</Stepper>
			)}
		</>
	)
}
