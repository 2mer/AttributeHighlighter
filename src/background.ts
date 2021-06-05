import { ADD_MACRO, DELETE_MACRO } from "./src/util/actions";

import { v4 as uuidv4 } from 'uuid'
import { Macro } from "./src/types";

chrome.runtime.onMessage.addListener((msg: any, sender: any, sendResponse: any) => {
	const data = msg.data

	switch (msg.type) {
		case ADD_MACRO:

			chrome.storage.sync.get({
				macros: []
			}, (items) => {
				const newMacros = [...items.macros, { ...data, id: uuidv4() }]
				chrome.storage.sync.set({
					macros: newMacros
				})
			})

			break;

		case DELETE_MACRO:

			chrome.storage.sync.get({
				macros: []
			}, (items) => {
				const newMacros = items.macros.filter((macro: Macro) => (macro.id !== data))
				chrome.storage.sync.set({
					macros: newMacros
				})
			})

			break;
	}
})