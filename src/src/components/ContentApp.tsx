import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import { MuiThemeProvider } from '@material-ui/core';
import theme from '../theme';
import { useState } from 'react';
import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';
import NewSettingsPanel from './settings/NewSettingsPanel';

export const SettingsContext = createContext([{
	attribute: '',
	tooltipEnabled: false,
	bordersEnabled: false,
}, undefined as any])

export default function ContentApp() {
	const [settings, setSettings] = useState(undefined)

	useEffect(() => {
		chrome.storage.local.get(['settings'], items => {
			setSettings(items?.settings || {})
		})
	}, [])

	const setSettingsWithStorage = useCallback((settings: any) => {
		chrome.storage.local.set({ settings }, () => {
			setSettings(settings)
		})

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const activeTab = tabs[0].id;

			if (activeTab) {
				chrome.tabs.sendMessage(activeTab, { type: 'SETTINGS_CHANGED', payload: settings });
			}
		});
	}, [setSettings])

	const settingsContextMemo = useMemo(() => [settings, setSettingsWithStorage], [settings, setSettingsWithStorage])

	return <>
		<div>
			<MuiThemeProvider theme={theme}>
				<SettingsContext.Provider value={settingsContextMemo as any}>
					<ScopedCssBaseline>
						<span style={{ display: 'flex' }}>
							<NewSettingsPanel />
						</span>
					</ScopedCssBaseline>
				</SettingsContext.Provider>
			</MuiThemeProvider>
		</div>
	</>
}
