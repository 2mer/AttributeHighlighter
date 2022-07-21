import React, { createContext, useCallback, useEffect, useMemo } from 'react'

import { useState } from 'react';
import SettingsPanel from './settings/SettingsPanel';
import { MantineProvider } from '@mantine/core';

export const SettingsContext = createContext([{
	attribute: '',
	tooltipEnabled: false,
	bordersEnabled: false,
}, undefined as any])

const theme = {
	fontFamily: 'Verdana, sans-serif',
	fontFamilyMonospace: 'Monaco, Courier, monospace',
	headings: { fontFamily: 'Greycliff CF, sans-serif' },
};

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
			<MantineProvider theme={theme}>
				<SettingsContext.Provider value={settingsContextMemo as any}>
					<span style={{ display: 'flex' }}>
						<SettingsPanel />
					</span>
				</SettingsContext.Provider>
			</MantineProvider>
		</div>
	</>
}
