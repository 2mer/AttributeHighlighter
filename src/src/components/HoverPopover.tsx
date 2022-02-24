import React, { useEffect, useMemo, useRef, useState } from 'react'

import copy from 'copy-to-clipboard'

import { ACTION_KEY, SUPER_ACTION_KEY } from '../const'
import { Box, Fade, Popover, Theme, Typography, withStyles } from '@material-ui/core'
import Divided from './Divided'

import styled, { css } from 'styled-components'

import ClipboardIcon from 'mdi-material-ui/ContentCopy'
import CheckIcon from 'mdi-material-ui/Check'
import AncestralTree from './ux/AncestralTree'
import { fade } from '@material-ui/core'
import theme from '../theme'

const StyledPopover = withStyles((theme: Theme) => ({
	root: {
		pointerEvents: 'none',
		zIndex: '9999998 !important' as any,
	},
	paper: {
		backgroundColor: fade(theme.palette.primary.main, 0.25),
		pointerEvents: 'none',
		backdropFilter: 'blur(10px)',
		overflow: 'visible',
		border: `2px solid ${theme.palette.primary.main}`
	}
}))(Popover)

const SeparatorDivider = ({ char = '' }) => (
	<Box px="4px" style={{ opacity: 0.5 }}>{char}</Box>
)

const InfoRow = ({ children = undefined as any }) => {
	return (
		<Typography color="inherit">
			<Box component="span" fontSize={12} whiteSpace="nowrap" display="inline-flex" alignItems="center">
				{children}
			</Box>
		</Typography>
	)
}

const Key = styled.span<{ $pressed: boolean }>`
	display: inline-flex;
	text-align: center;
	justify-content: center;
	margin: 0 4px 2px 4px;
	min-width: 10px;

	color: ${theme.palette.primary.main};
	box-shadow: 0 ${p => p.$pressed ? 0 : 2}px 0 ${fade(theme.palette.primary.main, 0.24)};
	background: ${p => fade(theme.palette.primary.main, p.$pressed ? 0.24 : 0.12)};
	
	padding: 2px 6px;
	border-radius: 2px;
	${p => p.$pressed && css`
		transform: translateY(2px);
	`}
`

const BracketRoot = styled.span`
	opacity: 0.5;
	margin: 0 4px;
`

const Bracket = ({ children = undefined as any, ...rest }) => {
	return (
		<Box display="flex" component="span" {...rest}>
			<BracketRoot>{children}</BracketRoot>
		</Box>
	)
}

const Connector = ({ flipped = false }) => {
	return (
		<Box position="absolute" zIndex="-1" display="flex" alignItems="center"
			style={{
				transform: `translate(${flipped ? 'calc(100% + 2px)' : 'calc(-100% - 2px)'}, 10px)`,
				left: flipped ? undefined : 0,
				right: flipped ? 0 : undefined
			}}
		>
			{(!flipped) && <Box bgcolor="primary.main" width="8px" height="8px" borderRadius="50%" />}
			<Box bgcolor="primary.main" mx="-2px" width="12px" height="2px" />
			{(flipped) && <Box bgcolor="primary.main" width="8px" height="8px" borderRadius="50%" />}
		</Box>
	)
}

export default function HoverPopover({
	anchorEl = null as null | Element,
	selector = '',
	separator = ':',

	flipAnchor = false,
	overlays = [] as any[],
}) {

	const [actionDown, setActionDown] = useState(false)
	const [shiftDown, setShiftDown] = useState(false)
	const [controlDown, setControlDown] = useState(false)
	const [pathMatches, setPathMatches] = useState(undefined as any)
	const [copied, setCopied] = useState(false)

	const getAttributeOverlay = (el: any) => {
		return overlays.find((o: any) => el.getAttribute(o.search))
	}

	const hoveredValue = useMemo(() => {
		if (!anchorEl) return ''

		var overlay = getAttributeOverlay(anchorEl);

		return (
			anchorEl.getAttribute(overlay.search) || ''
		)
	}, [overlays, anchorEl])

	const onCopy = () => {
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const removeOldMatchesTimeout = useRef(undefined as any)



	useEffect(() => {
		/////////////////////////////////
		// events
		/////////////////////////////////
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.key === ACTION_KEY) || (e.key === SUPER_ACTION_KEY)) {
				setActionDown(true)
				if ((shiftDown || controlDown) && anchorEl) e.preventDefault()
			} else if (e.key === 'Shift') {
				setShiftDown(true)

				if (removeOldMatchesTimeout.current) {
					clearTimeout(removeOldMatchesTimeout.current)
					removeOldMatchesTimeout.current = undefined
				}

				const ancestors: Element[] = []

				const findAncestors = (el: (Element | null | undefined)) => {
					if (el) {
						const closest = el.closest(selector)

						if (closest) {
							ancestors.push(closest)
							findAncestors(closest.parentElement)
						}
					}
				}

				findAncestors(anchorEl?.parentElement)

				setPathMatches(ancestors)
			} else if (e.key === 'Control') {
				setControlDown(true)
			}
		}
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === ACTION_KEY) {
				if (hoveredValue) {
					let str = ''
					if (controlDown && anchorEl) {
						const overlay = getAttributeOverlay(anchorEl);
						str = `[${overlay.search}="${hoveredValue}"]`
					} else {
						str = hoveredValue
					}
					copy(str)
					onCopy()
					setActionDown(false)
					e.preventDefault()
				}
			} else if (e.key === SUPER_ACTION_KEY) {
				if (hoveredValue && pathMatches) {
					let str = ''
					if (controlDown && anchorEl) {
						const overlay = getAttributeOverlay(anchorEl);
						str = `[${overlay.search}="${hoveredValue}"]`
					} else {
						str = hoveredValue
					}

					str = [
						...pathMatches.map((m: any) => {
							const overlay = getAttributeOverlay(m);
							const val = m.getAttribute(overlay.search);
							if (controlDown) {
								return `[${overlay.search}="${val}"]`
							} else {
								return val
							}
						}),
						str
					].join(' ')

					copy(str)
					onCopy()
					setActionDown(false)
					e.preventDefault()
				}

			} else if (e.key === 'Shift') {
				setShiftDown(false)
			} else if (e.key === 'Control') {
				setControlDown(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [selector, overlays, shiftDown, controlDown, anchorEl, hoveredValue, pathMatches])


	const splitHoveredValue = useMemo(() => (
		(hoveredValue || '').split(separator)
	), [hoveredValue])

	const SeparatorDividerMemo = useMemo(() => (
		() => <SeparatorDivider char={separator} />
	), [separator])

	return <>
		{Boolean(anchorEl) && (
			<StyledPopover open

				disableScrollLock

				anchorEl={anchorEl}

				// align
				anchorOrigin={{
					vertical: 'top',
					horizontal: flipAnchor ? 'left' : 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: flipAnchor ? 'right' : 'left',
				}}

				PaperProps={{
					style: {
						margin: `0 ${flipAnchor ? -8 : 8}px`
					}
				}}

				disableAutoFocus
				disableEnforceFocus
			>
				<Connector flipped={flipAnchor} />
				<Box overflow="hidden" borderRadius="4px">
					<Box p="6px 12px" color="white">
						<AncestralTree open={(shiftDown && pathMatches)}>
							{(pathMatches) && (
								pathMatches.map((m: any, index: number) => {
									const overlay = getAttributeOverlay(m);
									const matchValue = m.getAttribute(overlay.search)
									const separateMatchValue = (matchValue || '').split(separator)
									return (
										<Typography color="inherit" key={index}>
											<Box component="span" display="inline-flex" fontSize="16px" whiteSpace="nowrap" bgcolor={overlay.color} p="0 4px" borderRadius="4px">
												<Fade in={controlDown} mountOnEnter unmountOnExit><Bracket>{'['}</Bracket></Fade>
												<Divided DividerComp={SeparatorDividerMemo}>
													{separateMatchValue}
												</Divided>
												<Fade in={controlDown} mountOnEnter unmountOnExit><Bracket>{']'}</Bracket></Fade>
											</Box>
										</Typography>
									)
								})
							)}
							<Typography color="inherit">
								<Box component="span" display="inline-flex" fontSize="16px" whiteSpace="nowrap" bgcolor="primary.main" p="0 4px" borderRadius="4px">
									<Fade in={controlDown} mountOnEnter unmountOnExit><Bracket>{'['}</Bracket></Fade>
									<Divided DividerComp={SeparatorDividerMemo}>
										{splitHoveredValue}
									</Divided>
									<Fade in={controlDown} mountOnEnter unmountOnExit><Bracket>{']'}</Bracket></Fade>
								</Box>
							</Typography>
						</AncestralTree>
					</Box>
					<Box display="flex" flexDirection="column" gridGap="6px" bgcolor="background.paper" p="6px 12px" borderTop="2px solid rgba(255,255,255,0.24)">
						{/* <Box display="flex" flexDirection="column" gridGap="6px" bgcolor="primary.main" p="6px 12px" borderTop="2px solid rgba(255,255,255,0.24)"> */}
						<InfoRow>
							{Boolean(copied) ? (
								<>Copied to clipboard!<Box component="span" m="2px 4px 2px 4px" display="inline-flex"><CheckIcon fontSize="small" style={{ opacity: 0.87 }} /></Box></>
							) : (
								<>Press <Key $pressed={actionDown}>{'`'}</Key> to copy <Box component="span" mx="4px" display="inline-flex"><ClipboardIcon fontSize="small" style={{ opacity: 0.87 }} /></Box></>
							)}
						</InfoRow>
						<InfoRow>
							Hold <Key $pressed={shiftDown}>shift</Key> to include path
						</InfoRow>
						<InfoRow>
							Hold <Key $pressed={controlDown}>ctrl</Key> to include attribute selector
						</InfoRow>
					</Box>
				</Box>
			</StyledPopover>
		)}
	</>
}
