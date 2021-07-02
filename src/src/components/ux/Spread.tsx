import React, { useState } from 'react'

import styled from 'styled-components'

const SpreadRoot = styled.div<{ $open: boolean }>`
	display: flex;
	transition: all .4s;
	border-radius: 8px;
	overflow: hidden;
	gap: ${p => p.$open ? 10 : 0}px;
	flex-wrap: wrap;
`

const SpreadItemRoot = styled.div`
	display: flex;
	transition: all .4s;
`

const FirstItem = styled.div`
	display: flex;
	z-index: 1;
`

const SpreadItem = ({ children = undefined, open = false, direction = "left" }) => {

	const [mountedEl, setMountedEl] = useState(undefined as any)
	const width = mountedEl?.getBoundingClientRect()?.width || 0

	return (
		<SpreadItemRoot ref={setMountedEl} style={{
			opacity: Boolean(mountedEl) ? 1 : 0,
			marginLeft: (direction === 'right') ? (open ? 0 : -width) : undefined,
			marginRight: (direction === 'left') ? (open ? 0 : -width) : undefined,
		}}>
			{children}
		</SpreadItemRoot>
	)
}

export interface SpreadProps {
	in: boolean,
	children: any,
	direction: "left" | "right"
}

export default function Spread(props: SpreadProps) {

	const { children, direction } = props;

	if (!Array.isArray(children)) return children

	const [firstChild, ...restChildren] = children.filter(Boolean).reduce((acc, cur) => [...acc, ...(Array.isArray(cur) ? cur : [cur])], [])

	return (
		<SpreadRoot $open={props.in}>
			{(direction === 'right') && (
				<FirstItem>
					{firstChild}
				</FirstItem>
			)}

			{restChildren.map((child: any, index: number) => (

				<SpreadItem key={index} open={props.in} direction={direction}>
					{child}
				</SpreadItem>

			))}

			{(direction === 'left') && (
				<FirstItem>
					{firstChild}
				</FirstItem>
			)}
		</SpreadRoot>
	)
}
