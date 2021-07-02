import { fade } from '@material-ui/core'
import { Box, Fade } from '@material-ui/core'
import React, { useState } from 'react'

import styled from 'styled-components'
import theme from '../../theme'

const AncestralTreeItemRoot = styled.div`
	display: flex;
	align-items: center;
	line-height: 24px;

	transition: all .4s;
`

const AncestryIconShape = styled.div`
	width: 24px;
	height: 24px;
	opacity: 0.5;
	box-shadow: inset 0 0 0 4px ${fade(theme.palette.primary.main, 0.5)};
	transform: translate(50%, -50%);
`

const AncestryIcon = ({ ...rest }) => {
	return (
		<Box position="absolute" style={{ transform: 'translateX(-100%)' }}>
			<Box width="24px" height="24px" position="relative" overflow="hidden" mr="4px" {...rest}>
				<AncestryIconShape />
			</Box>
		</Box>
	)
}


const AncestralTreeItem = ({ children = undefined as any, index = 0, tabbing = false, margin = false, opacity = false, icon = false, lastItem = false }) => {

	const [mountedEl, setMountedEl] = useState(undefined as any)

	const isMounted = Boolean(mountedEl)

	return (
		<AncestralTreeItemRoot
			style={{
				marginLeft: ((isMounted) && tabbing) ? (((index) * 24) + 'px') : undefined,
				marginTop: ((isMounted && margin) || lastItem) ? undefined : '-24px',
				opacity: (opacity) ? 1 : 0
			}}
			ref={setMountedEl}
		>
			<Box display="flex" align-items='center'>
				{<Fade in={icon} mountOnEnter unmountOnExit><AncestryIcon /></Fade>}
				{children}
			</Box>
		</AncestralTreeItemRoot>
	)
}

const AncestralTreeRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	transition: all .4s;
`

export default function AncestralTree({ children = undefined as any, open = false }) {

	if (!Array.isArray(children)) return children

	const filteredChildren = children.filter(Boolean).reduce((arr, cur) => [...arr, ...(Array.isArray(cur) ? cur : [cur])], [])

	return (
		<AncestralTreeRoot
			gridGap={open ? "4px" : "0px"}
		>
			{filteredChildren.map((child: any, index: number) => {
				const isLastChild = (index === (filteredChildren.length - 1))

				return (
					<AncestralTreeItem
						icon={open && (Boolean(index))}
						tabbing={open && (Boolean(index))}
						margin={isLastChild || open}
						opacity={isLastChild || open}
						lastItem={isLastChild}
						index={index}
						key={index}
					>
						{child}
					</AncestralTreeItem>
				)
			})}
		</AncestralTreeRoot>
	)
}
