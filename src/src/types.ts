export type MacroAction = { type: string, data?: any }
export type Macro = { id?: string, name: string, actions: MacroAction[] }