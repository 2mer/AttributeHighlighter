import { ADD_MACRO } from "./src/util/actions";

chrome.runtime.onMessage.addListener((msg: any, sender: any, sendResponse: any) => {
	switch (msg.type) {
		case ADD_MACRO:
			const data = msg.data

			chrome.storage.sync.get({
				macros: []
			}, (items) => {
				const newMacros = [...items.macros, data]
				chrome.storage.sync.set({
					macros: newMacros
				})
			})

			break;
	}
})