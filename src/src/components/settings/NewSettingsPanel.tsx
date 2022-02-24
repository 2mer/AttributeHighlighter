import { Box, Button, Paper, Typography } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Plus as PlusIcon } from 'mdi-material-ui';
import * as React from 'react';
import { SettingsContext } from '../ContentApp';
import OverlaySettings from './OverlaySettings';

const NewSettingsPanel = () => {

	const [settings, setSettings] = React.useContext(SettingsContext)

	const { overlays = [] } = settings || {};

	const setOverlay = (index: number, overlay: any) => {
		setSettings({ ...settings, overlays: overlays.map((o: any, i: number) => (i === index) ? overlay : o) });
	}

	const removeOverlay = (index: number) => {
		setSettings({ ...settings, overlays: overlays.filter((_: any, i: number) => (i !== index)) });
	}

	const addOverlay = () => {
		setSettings({ ...settings, overlays: [...overlays, { search: '', color: blue[500], enabled: true, outlinesEnabled: true, queryMode: false }] });
	}

	return (
		<Paper style={{ width: '500px' }}>
			{/* header */}
			<Box bgcolor="primary.main" p="1rem 4rem">
				<Typography align="center" variant="h3" style={{ color: 'white' }}>Tilda</Typography>
				<Typography align="center" style={{ color: 'white' }}>Settings</Typography>
			</Box>


			<Box display="flex" flexDirection="column" p="1rem">
				<Box p="1rem 0">
					<Typography>Overlays</Typography>
				</Box>

				{/* overlay content area */}
				<Box borderRadius="6px" style={{ boxShadow: '0 0 0 1px inset #d3d7da' }}>
					<Box display="flex" flexDirection="column" borderRadius="6px" overflow="hidden">
						{overlays.map((o: any, index: number) => <OverlaySettings key={index} overlay={o} setOverlay={(overlay: any) => setOverlay(index, overlay)} removeOverlay={() => removeOverlay(index)} />)}
					</Box>
				</Box>

				{/* add overlay button */}
				<Box display="flex" flexDirection="column" pt="1rem">
					<Button onClick={addOverlay} color="primary" variant="outlined" startIcon={<PlusIcon />}>Add Overlay</Button>
				</Box>
			</Box>
		</Paper>
	);

}

export default React.memo(NewSettingsPanel);