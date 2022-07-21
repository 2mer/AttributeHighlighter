import React, { useEffect, useState } from 'react'
import HoverPopover from './HoverPopover/HoverPopover'
import { multiplicativeFade } from '../util/fade';
import getSelector from './getSelector';

export default function HighlightOverlay({ }) {

	const [settings, setSettings] = React.useState<any>();

	const { overlays = [], enabled = true } = (settings || {})

	const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null)

	//on mount
	React.useEffect(() => {
		// load settings initially from storage
		chrome.storage.local.get(['settings'], items => {
			setSettings(items?.settings || {})
		})

		// load changes done to settings from message
		const handleMessage = (request: any, sender: any, sendResponse: any) => {
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

		if (enabled) {
			/////////////////////////////////
			// styles
			/////////////////////////////////

			const createStyleSheet = (selector: any, outlinesEnabled: any, tooltipEnabled: any, color: any) => {
				const stylesheet = document.createElement('style')

				const alwaysOnStyle = `
				${selector} {
					box-shadow: 0 0 0 2px ${color}, 0 0 0 4px ${multiplicativeFade(color, 0.25)} !important;
				}
			`

				const eitherOnStyle = `
				${selector}:hover {
					box-shadow: 0 0 0 2px ${color}, 0 0 0 4px ${multiplicativeFade(color, 0.5)} !important;
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
				const { tooltipEnabled, outlinesEnabled } = overlay;
				const selector = getSelector(overlay);

				const stylesheet = createStyleSheet(selector, outlinesEnabled, tooltipEnabled, overlay.color);

				document.body.append(stylesheet);
				styleSheets.push(stylesheet);
			})


			return () => {
				styleSheets.forEach((stylesheet: any) => {
					stylesheet.parentNode?.removeChild(stylesheet)
				})
			}
		}
	}, [overlays, enabled])

	const tooltipOverlays = React.useMemo(() => overlays.filter((o: any) => o.enabled && o.tooltipEnabled), [overlays]);
	const tooltipSelector = React.useMemo(() => `:is(${tooltipOverlays.map(getSelector).join(',')})`, [tooltipOverlays])
	const tooltipEnabled = Boolean(tooltipOverlays?.length)

	useEffect(() => {
		if (enabled) {
			/////////////////////////////////
			// events
			/////////////////////////////////

			const handleMouseMove = (e: MouseEvent) => {
				if (tooltipSelector) {
					const element = e.target as HTMLElement
					const closest = element.closest(tooltipSelector) as HTMLElement
					setHoveredElement(closest)
				}
			}

			window.addEventListener('mousemove', handleMouseMove)

			return () => {
				window.removeEventListener('mousemove', handleMouseMove)
			}
		}
	}, [overlays, hoveredElement, enabled])


	return (
		<HoverPopover
			anchorEl={(tooltipEnabled) ? hoveredElement : undefined}

			selector={tooltipSelector}
			overlays={overlays}
		/>
	)
}
