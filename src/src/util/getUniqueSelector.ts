const getSelector = (node: HTMLElement): string => {
	if (node.parentElement) {
		const parent = node.parentElement
		const nodes = parent?.children
		const filteredNodes = []

		for (let el1 of nodes) {
			if (el1.tagName === node.tagName) filteredNodes.push(el1);
		}

		let appendix = ""
		if (Boolean(filteredNodes.length > 1)) {
			let index = 0
			for (let el of filteredNodes) {
				if (el === node) {
					break;
				}
				index++
			}
			appendix = `:nth-of-type(${index + 1})`;
		}
		return getSelector(parent) + " > " + node.tagName + appendix
	} else {
		return node.tagName
	}
}

export default getSelector