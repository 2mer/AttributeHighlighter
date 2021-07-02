import { grey } from '@material-ui/core/colors'
import React from 'react'

import styled from 'styled-components'
import theme from '../../theme'

const FADE_SIZE = 40

const ScrollContainerRoot = styled.div`

	width: 100%;
	height: 100%;

	overflow-x: hidden;
	overflow-y: auto;
	mask-image: linear-gradient(to bottom, transparent, white 20px, white calc(100% - ${FADE_SIZE}px), transparent);

	padding: ${FADE_SIZE}px 0;

	/* width */
	&::-webkit-scrollbar {
		width: 14px;
	}

	/* Track */
	&::-webkit-scrollbar-track {
		background: transparent;
	}

	/* Buttons (act as padding) */
	&::-webkit-scrollbar-button {
		background: transparent;
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background: ${grey[100]};
		box-shadow: inset 0 0 0 1px ${theme.palette.divider}, inset 0 0 0 2px white;
	}

	/* Handle on hover */
	&::-webkit-scrollbar-thumb:hover {
		background: ${grey[200]};
	}

	&::-webkit-scrollbar-thumb:active {
		background: ${grey[200]};
		box-shadow: inset 0 0 0 1px ${theme.palette.primary.main}, inset 0 0 0 2px white;
	}
`

export default ScrollContainerRoot
