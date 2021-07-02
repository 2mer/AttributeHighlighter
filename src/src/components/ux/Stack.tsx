import React from 'react'

import styled from 'styled-components'

const Stack = styled.div`
	display: grid;

	& > * {
		grid-row: 1/1;
		grid-column: 1/1;
	}
`

export default Stack;
