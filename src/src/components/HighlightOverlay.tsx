import React, { useEffect, useState } from 'react'
import { fade, useTheme } from '@material-ui/core'
import HoverPopover from './HoverPopover'
import { SettingsContext } from './ContentApp'
import { useContext } from 'react'

export default function HighlightOverlay({ mouseOverSettings = false }) {

	const [settings] = useContext(SettingsContext)
	const { outlinesEnabled = false, tooltipEnabled = false, attribute = '' } = (settings || {})

	const [hoveredElement, setHoveredElement] = useState<Element | null>(null)
	const [mouseHalfwayPointReached, setMouseHalfwayPointReached] = useState(false)

	const selector = `[${attribute}]`

	const theme = useTheme()


	useEffect(() => {

		/////////////////////////////////
		// styles
		/////////////////////////////////

		const stylesheet = document.createElement('style')

		const alwaysOnStyle = `
			${selector} {
				box-shadow: 0 0 0 2px ${fade(theme.palette.primary.main, 0.5)}, 0 0 0 4px ${fade(theme.palette.primary.main, 0.25 / 2)} !important;
			}
		`

		const eitherOnStyle = `
			${selector}:hover {
				box-shadow: 0 0 0 2px ${theme.palette.primary.main}, 0 0 0 4px ${fade(theme.palette.primary.main, 0.25)} !important;
			}
		`

		stylesheet.innerHTML = `
			${outlinesEnabled ? alwaysOnStyle : ''}	

			${(outlinesEnabled || tooltipEnabled) ? eitherOnStyle : ''}
		`

		document.body.append(stylesheet)

		return () => {
			stylesheet.parentNode?.removeChild(stylesheet)
		}
	}, [selector, outlinesEnabled, tooltipEnabled])

	useEffect(() => {
		/////////////////////////////////
		// events
		/////////////////////////////////

		const handleMouseMove = (e: MouseEvent) => {
			if (attribute) {
				const element = e.target as Element
				const closest = element.closest(selector)
				setHoveredElement(closest)
			}
			if (e.clientX > (document.documentElement.clientWidth / 2)) {
				setMouseHalfwayPointReached(true)
			} else {
				setMouseHalfwayPointReached(false)
			}
		}

		window.addEventListener('mousemove', handleMouseMove)

		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
		}
	}, [selector, hoveredElement])


	return (
		<HoverPopover
			anchorEl={(tooltipEnabled && (!mouseOverSettings)) ? hoveredElement : undefined}

			flipAnchor={mouseHalfwayPointReached}

			attribute={attribute}
			selector={selector}
		/>
	)
}
