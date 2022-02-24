import { Box, ButtonBase, Menu } from '@material-ui/core';
import { blue, green, orange, purple, red } from '@material-ui/core/colors';
import * as React from 'react';

const palette = [
	blue[500],
	red[500],
	orange[500],
	purple[500],
	green[500],
];

const ColorPicker = ({ open, value, onChange, onClose, anchorEl }: any) => {

	return (
		<Menu open={open} onClose={onClose} anchorEl={anchorEl}>
			<Box display="grid" gridAutoFlow="row" gridTemplateColumns="repeat(4, 1fr)">
				{palette.map(c =>
					<ButtonBase key={c}>
						<Box bgcolor={c} width="16px" height="16px" onClick={() => onChange(c)} style={{ boxShadow: c === value ? undefined : '0 0 0 -5px white' }} />
					</ButtonBase>
				)}
			</Box>
		</Menu>
	);

}

export default React.memo(ColorPicker);