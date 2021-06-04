
export default () => {
	let lastTime: null | number = null

	return {
		reset: () => {
			lastTime = null
		},
		getOffset: () => {
			const now = Date.now()
			const delta = now - (lastTime || now)
			lastTime = now

			return delta
		}
	}
}