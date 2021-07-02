chrome.browserAction.onClicked.addListener(tab => {
	if (tab?.id) {
		chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_SETTINGS' })
	}
})