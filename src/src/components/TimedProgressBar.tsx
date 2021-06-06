import { Box, useTheme } from '@material-ui/core'
import React, { useEffect, useRef } from 'react'

import styled from 'styled-components'

const StyledProgressContent = styled.div<{ $color: string }>`
	background-color: ${p => p.$color};
	height: 100%;
	width: 0px;
`

export default function TimedProgressBar({ ms = 0 }) {

	const theme = useTheme()
	const progressRef = useRef<null | HTMLDivElement>(null)

	useEffect(() => {

		const contentDiv = progressRef.current as HTMLDivElement

		if (contentDiv && ms) {

			contentDiv.style.transition = `all ${ms}ms`
			contentDiv.style.width = '100%'

			return () => {
				contentDiv.style.transition = `unset`
				contentDiv.style.width = '0px'
			}
		}

	}, [ms])

	return (
		<Box width="100%" bgcolor={theme.palette.primary.main + "2b"} height="8px">
			<StyledProgressContent ref={progressRef} $color={theme.palette.primary.main} />
		</Box>
	)
}
