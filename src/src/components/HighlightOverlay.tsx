import React, { useEffect, useState } from 'react'
import { fade, useTheme } from '@material-ui/core'
import HoverPopover from './HoverPopover'

export default function HighlightOverlay({ }) {

	const [settings, setSettings] = React.useState<any>();

	const { overlays = [] } = (settings || {})

	const [hoveredElement, setHoveredElement] = useState<Element | null>(null)
	const [mouseHalfwayPointReached, setMouseHalfwayPointReached] = useState(false)

	const theme = useTheme()

	//on mount
	React.useEffect(() => {
		// load settings initially from storage
		chrome.storage.local.get(['settings'], items => {
			setSettings(items?.settings || {})
		})

		// load changes done to settings from message
		const handleMessage = (request: any, sender: any, sendResponse: any) => {
			console.log('Got request', request)
			switch (request.type) {
				case "SETTINGS_CHANGED":
					setSettings(request.payload)
			}
		}

		chrome.runtime.onMessage.addListener(handleMessage)

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, []);

	useEffect(() => {

		/////////////////////////////////
		// styles
		/////////////////////////////////

		const createStyleSheet = (selector: any, outlinesEnabled: any, tooltipEnabled: any, color: any) => {
			const stylesheet = document.createElement('style')

			const alwaysOnStyle = `
				${selector} {
					box-shadow: 0 0 0 2px ${fade(color, 0.5)}, 0 0 0 4px ${fade(color, 0.25 / 2)} !important;
				}
			`

			const eitherOnStyle = `
				${selector}:hover {
					box-shadow: 0 0 0 2px ${color}, 0 0 0 4px ${fade(color, 0.25)} !important;
				}
			`

			stylesheet.innerHTML = `
				${outlinesEnabled ? alwaysOnStyle : ''}	
	
				${(outlinesEnabled || tooltipEnabled) ? eitherOnStyle : ''}
			`

			return stylesheet;
		}


		const styleSheets: any[] = [];

		overlays.filter((o: any) => o.enabled).forEach((overlay: any) => {
			const { search, queryMode, tooltipEnabled, outlinesEnabled } = overlay;
			const selector = queryMode ? search : `[${search}]`

			const stylesheet = createStyleSheet(selector, outlinesEnabled, tooltipEnabled, overlay.color);

			document.body.append(stylesheet);
			styleSheets.push(stylesheet);
		})


		return () => {
			styleSheets.forEach((stylesheet: any) => {
				stylesheet.parentNode?.removeChild(stylesheet)
			})
		}
	}, [overlays])

	const tooltipOverlays = React.useMemo(() => overlays.filter((o: any) => o.enabled && o.tooltipEnabled), [overlays]);
	const tooltipSelector = React.useMemo(() => `:is(${tooltipOverlays.map((o: any) => o.search).join(',')})`, [tooltipOverlays])
	const tooltipEnabled = Boolean(tooltipOverlays?.length)

	useEffect(() => {
		/////////////////////////////////
		// events
		/////////////////////////////////

		const handleMouseMove = (e: MouseEvent) => {
			if (tooltipSelector) {
				const element = e.target as Element
				const closest = element.closest(tooltipSelector)
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
	}, [overlays, hoveredElement])


	return (
		<HoverPopover
			anchorEl={(tooltipEnabled) ? hoveredElement : undefined}

			flipAnchor={mouseHalfwayPointReached}

			selector={tooltipSelector}
			overlays={overlays}
		/>
	)
}
