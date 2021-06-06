export type MacroActionData = {
	selector?: string,
	text?: string,
	time?: number
}
export type MacroAction = { type: string, data?: MacroActionData }
export type Macro = { id?: string, name: string, actions: MacroAction[] }
