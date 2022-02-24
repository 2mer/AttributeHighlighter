import { Chip, fade, IconButton, TextField, Tooltip, withStyles } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import { Fade } from '@material-ui/core'
import { Box } from '@material-ui/core'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import styled, { css } from 'styled-components'
import theme from '../../theme'

import CogOutlineIcon from 'mdi-material-ui/CogOutline'
import TextSearchIcon from 'mdi-material-ui/TextSearch';
import SelectSearchIcon from 'mdi-material-ui/SelectSearch';

import MagnifyIcon from 'mdi-material-ui/Magnify'
import { SettingsContext } from '../ContentApp'
import { debounce } from '@material-ui/core'

const StyledPaper = withStyles({
	root: {
		backgroundColor: fade(theme.palette.primary.main, 0.25),
		backdropFilter: 'blur(10px)',
		overflow: 'hidden',
		border: `2px solid ${theme.palette.primary.main}`
	}
})(Paper)

const ToggleButtonRoot = styled.div<{ $pressed: boolean }>`
	cursor: pointer;
	user-select: none;

	display: inline-flex;
	text-align: center;
	justify-content: center;

	margin: 0 4px 2px 4px;
	min-width: 10px;
	padding: 2px 6px;

	box-shadow: 0 ${p => p.$pressed ? 0 : 2}px 0 ${fade(theme.palette.primary.main, 0.24)};
	color: ${p => p.$pressed ? 'white' : theme.palette.primary.main};
	background: ${p => fade(theme.palette.primary.main, p.$pressed ? 1 : 0.12)};
	border-radius: 2px;
	
	transition: all 255ms;

	&:hover {
		filter: brightness(1.1);
	}

	&:active {
		box-shadow: none;
		transform: translateY(2px);
	}

	${p => p.$pressed && css`
		transform: translateY(2px);
	`}
`

const ToggleButton = ({ children = undefined as any, onClick = undefined as any, value = false }) => {
	return (
		<ToggleButtonRoot $pressed={value} onClick={onClick}>
			{children}
		</ToggleButtonRoot>
	)
}

export default function SettingsPanel({ open = false, onClose = undefined as any }) {

	const [settings, setSettings] = useContext(SettingsContext)

	const [inputText, setInputText] = useState('')
	const [queryMode, setQueryMode] = React.useState(false);

	useEffect(() => {
		settings && setInputText(settings.attribute)
		settings && setQueryMode(settings.queryMode)
	}, [settings])


	const handleInput = useCallback(debounce((val: any) => {
		setSettings({ ...settings, attribute: val })
	}, 1000), [settings, setSettings])

	const handleToggleQueryMode = useCallback(() => {
		setSettings({ ...settings, queryMode: !settings.queryMode })
	}, [settings, setSettings]);

	return (
		<Fade in={open} mountOnEnter unmountOnExit>
			<Box m="16px" boxShadow={6} zIndex="99999999" position="fixed" top="0" right="0" borderRadius="4px" overflow="hidden">
				<StyledPaper>
					<Box display="flex">
						<Box display="flex" p="6px 12px" gridGap="6px">
							{/* toggles */}
							<ToggleButton value={settings?.outlinesEnabled} onClick={() => setSettings({ ...settings, outlinesEnabled: !settings?.outlinesEnabled })}>Outlines</ToggleButton>
							<ToggleButton value={settings?.tooltipEnabled} onClick={() => setSettings({ ...settings, tooltipEnabled: !settings?.tooltipEnabled })}>Tooltip</ToggleButton>
						</Box>
						<Box display="flex" p="6px 12px" gridGap="6px" bgcolor="background.paper">
							<TextField

								value={inputText}
								onChange={e => {
									setInputText(e.target.value)
									handleInput(e.target.value)
								}}

								placeholder="Attribute"
								InputProps={{
									disableUnderline: true,
									startAdornment: <MagnifyIcon color="primary" />,
									endAdornment: (
										<Chip size="small" color="primary" variant="outlined" icon={<CogOutlineIcon />} label="tilda" />
									),
								}}

							/>
							<Tooltip title={queryMode ? 'Query Search' : 'Attribute Search'}>
								<IconButton onClick={handleToggleQueryMode}>
									{queryMode ? (
										<SelectSearchIcon />
									) : (
										<TextSearchIcon />
									)}
								</IconButton>
							</Tooltip>
						</Box>
					</Box>
				</StyledPaper>
			</Box>
		</Fade>
	)
}
