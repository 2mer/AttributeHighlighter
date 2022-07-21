import { Menu, useMantineTheme, ColorPicker as MantineColorPicker } from '@mantine/core';
import * as React from 'react';

const ColorPicker = ({ open, value, onChange, onClose, children }: any) => {

	const theme = useMantineTheme();

	return (
		<Menu opened={open} onClose={onClose} control={children} size="auto" withArrow placement="center" position="left">
			<MantineColorPicker format="rgba" value={value} onChange={onChange} />
		</Menu>
	);

}

export default React.memo(ColorPicker);