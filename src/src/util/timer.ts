let lastTime: null | number = null

export default {
	reset: () => {
		lastTime = null
	},
	getOffset: () => {
		const now = Date.now()
		const delta = (lastTime || now) - now
		lastTime = now

		return delta
	}
}