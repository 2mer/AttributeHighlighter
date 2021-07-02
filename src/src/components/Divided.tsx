import { Divider } from '@material-ui/core'
import React from 'react'

export default function Divided({ children = undefined as any, DividerComp = Divider as any }) {

	if (!Array.isArray(children)) return children

	const filteredChildren = children.filter(Boolean).reduce((acc, cur) => [...acc, ...(Array.isArray(cur) ? cur : [cur])], [])

	return (
		filteredChildren.map((node: any, index: number) => (
			<React.Fragment key={index}>
				{Boolean(index) && (
					<DividerComp />
				)}

				{node}
			</React.Fragment>
		))
	)
}
