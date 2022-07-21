const getSelector = (overlay) => {
	const { search, queryMode } = overlay;
	const selector = queryMode ? search : `[${search}]`

	return selector;
}

export default getSelector;