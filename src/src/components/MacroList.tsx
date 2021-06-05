import { Avatar, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import React from 'react'
import { Macro } from '../types'

import CursorDefaultClickIcon from 'mdi-material-ui/CursorDefaultClick'
import SleepIcon from 'mdi-material-ui/Sleep'
import CloseIcon from 'mdi-material-ui/Close'
import { blue } from '@material-ui/core/colors'

export default function MacroList({
	macro = null as (null | Macro),
	readonly = false,
}) {


	console.log('ACTIONS', macro)
	return (
		<>
			{Boolean(macro) && (
				<List>
					{macro?.actions.map((action, index) => {
						return (
							<React.Fragment key={index}>
								{Boolean(index) && <Divider variant="inset" component="li" />}
								<ListItem>
									{/* icon */}
									<ListItemAvatar>
										<Avatar style={{ backgroundColor: blue[500] }}>
											{(action.type === 'CLICK') && <CursorDefaultClickIcon />}
											{(action.type === 'SLEEP') && <SleepIcon />}
										</Avatar>
									</ListItemAvatar>

									{/* text */}
									<ListItemText primary={action.type} secondary={action.data} />

									{/* delete */}
									{!readonly && (
										<ListItemSecondaryAction>
											<IconButton edge="end">
												<CloseIcon />
											</IconButton>
										</ListItemSecondaryAction>
									)}
								</ListItem>
							</React.Fragment>
						)
					})}
				</List>
			)}
		</>
	)
}
