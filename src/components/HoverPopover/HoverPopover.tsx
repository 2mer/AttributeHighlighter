import { Box, Divider, Indicator, Kbd, Paper, Popper, Stack, Text } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconLock } from '@tabler/icons';
import * as React from 'react';
import OverlayResult from './OverlayResult';

const HoverPopover = ({
	anchorEl = null as null | HTMLElement,
	selector = '',
	separator = ':',
	overlays = [] as any[]
}) => {

	const [locked, setLocked] = React.useState(false);
	const [currentEl, setCurrentEl] = React.useState<HTMLElement>();

	useHotkeys([['Backquote', () => {
		setLocked(prev => !prev);
	}]])

	// on anchorEl, locked changed
	React.useEffect(() => {
		if (!locked) {
			setCurrentEl(anchorEl);
		}
	}, [anchorEl, locked]);

	const overlayValues = React.useMemo(() => {

		if (!currentEl) return [];

		return overlays.map((overlay) => {

			const { search, queryMode, tooltipEnabled } = overlay;

			if (queryMode || !tooltipEnabled) return undefined;

			const value = currentEl.getAttribute(search);

			if (!value) return undefined;

			return { overlay, value };
		}).filter(Boolean)

	}, [overlays, currentEl])

	const open = Boolean(currentEl && overlayValues.length);

	if (!currentEl) return null;

	return (
		<Popper
			mounted={open}
			referenceElement={currentEl}

			zIndex={9999999998}

			transition="pop-top-left"
			transitionDuration={200}
		>
			<Indicator disabled={!locked} size={30} label={<IconLock color="white" size="18px" />}>
				<Paper
					shadow="lg"
					radius="lg"
					sx={theme => ({ border: `4px solid ${theme.colors[theme.primaryColor][5]}`, pointerEvents: locked ? 'all' : undefined, minWidth: '300px' })}
				>
					<Stack m="1rem">
						<Box sx={{ overflow: 'hidden', borderRadius: '8px', border: `1px solid rgba(0, 0, 0, 0.1)`, display: 'flex', flexDirection: 'column' }}>
							{overlayValues.map(({ overlay, value }, index) => {
								return <OverlayResult overlay={overlay} value={value} key={index} />
							})}
						</Box>
						<Divider />
						<Text size="xs">
							<Kbd>`</Kbd> {locked ? 'Unlock' : 'Lock'} Tooltip
						</Text>
					</Stack>
				</Paper>
			</Indicator>
		</Popper>
	);

}



export default React.memo(HoverPopover);
