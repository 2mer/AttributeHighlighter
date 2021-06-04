export type MacroAction = { type: string, data?: any }
export type Macro = { name: string, actions: MacroAction[] }