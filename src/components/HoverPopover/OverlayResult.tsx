import { ColorSwatch, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { IconCheck, IconCopy } from '@tabler/icons';
import * as React from 'react';
import fade from '../../util/fade';

const OverlayResult = ({ overlay, value }) => {

	const clipboard = useClipboard();

	const { color } = overlay;

	return (
		<UnstyledButton onClick={() => clipboard.copy(value)}>
			<Group position="apart" noWrap p="sm" spacing="sm" sx={{ display: 'flex', width: '100%', alignItems: 'center', background: `linear-gradient(to right, ${fade(color, 0.1)}, transparent)` }}>
				<ColorSwatch color={color} />
				<Text>
					{value}
				</Text>
				<Tooltip withArrow arrowSize={6} label="Copied" opened={clipboard.copied} zIndex={9999999999}>
					{clipboard.copied ? <IconCheck /> : <IconCopy />}
				</Tooltip>
			</Group>
		</UnstyledButton>
	);

}

export default React.memo(OverlayResult);