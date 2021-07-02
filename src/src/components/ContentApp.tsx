import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import { MuiThemeProvider } from '@material-ui/core';
import theme from '../theme';
import SettingsPanel from './settings/SettingsPanel';
import HighlightOverlay from './HighlightOverlay';
import { useState } from 'react';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';

export const SettingsContext = createContext([{
	attribute: '',
	tooltipEnabled: false,
	bordersEnabled: false,
}, undefined as any])

export default function ContentApp() {

	const [settingsOpen, setSettingsOpen] = useState(false)
	const [mouseOverSettings, setMouseOverSettings] = useState(false)

	const [settings, setSettings] = useState(undefined)

	useEffect(() => {

		const handleMessage = (request: any, sender: any, sendResponse: any) => {
			switch (request.type) {
				case "TOGGLE_SETTINGS":
					setSettingsOpen(open => !open)
			}
		}

		chrome.storage.local.get(['settings'], items => {
			setSettings(items?.settings || ({
				attribute: '',
				tooltipEnabled: false,
				bordersEnabled: false,
			}))
		})

		chrome.runtime.onMessage.addListener(handleMessage)

		return () => {
			chrome.runtime.onMessage.removeListener(handleMessage)
		}
	}, [])

	const setSettingsWithStorage = useCallback((settings: any) => {
		chrome.storage.local.set({ settings }, () => {
			setSettings(settings)
		})
	}, [setSettings])

	const settingsContextMemo = useMemo(() => [settings, setSettingsWithStorage], [settings, setSettingsWithStorage])

	return <>
		{Boolean(settings) && (
			<div>
				<MuiThemeProvider theme={theme}>
					<SettingsContext.Provider value={settingsContextMemo as any}>
						<ScopedCssBaseline>
							<HighlightOverlay mouseOverSettings={mouseOverSettings} />
							<span style={{ display: 'flex' }} onMouseEnter={() => setMouseOverSettings(true)} onMouseLeave={() => setMouseOverSettings(false)}>
								<SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
							</span>
						</ScopedCssBaseline>
					</SettingsContext.Provider>
				</MuiThemeProvider>
			</div>
		)}
	</>
}
