import { Box, Button, Group, Paper, Stack, Switch, Text, Title, Tooltip, useMantineTheme } from '@mantine/core';
import * as React from 'react';
import { SettingsContext } from '../ContentApp';
import OverlaySettings from './OverlaySettings';
import { IconPlus } from '@tabler/icons';

const SettingsPanel = () => {

	const theme = useMantineTheme();

	const [settings, setSettings] = React.useContext(SettingsContext)

	const { overlays = [] } = settings || {};

	const setOverlay = (index: number, overlay: any) => {
		setSettings({ ...settings, overlays: overlays.map((o: any, i: number) => (i === index) ? overlay : o) });
	}

	const removeOverlay = (index: number) => {
		setSettings({ ...settings, overlays: overlays.filter((_: any, i: number) => (i !== index)) });
	}

	const addOverlay = () => {
		setSettings({ ...settings, overlays: [...overlays, { search: '', color: theme.colors.blue[5], enabled: true, outlinesEnabled: true, queryMode: false }] });
	}

	const toggleEnabled = () => {
		setSettings({ ...settings, enabled: !settings.enabled });
	}

	const { enabled = true } = settings || {};

	return (
		<Paper sx={{ width: '500px', filter: enabled ? undefined : 'grayscale(1)' }}>
			{/* header */}
			<Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ backgroundColor: "#0099ff", zIndex: 2 }}>
					<Group noWrap position="apart" sx={{ marginLeft: '4rem', marginBottom: '-1.5rem', paddingTop: '1rem', marginRight: '2rem' }}>
						<Text
							weight={700}
							style={{ fontFamily: 'Greycliff CF, sans-serif', fontSize: '40px' }}
							color="white"
						>Tilda</Text>
						<Switch onLabel="ON" offLabel="OFF" size="xl" checked={enabled} onChange={toggleEnabled} />
					</Group>
				</Box>

				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<path fill="#0099ff" fillOpacity="1" d="M0,128L60,144C120,160,240,192,360,186.7C480,181,600,139,720,112C840,85,960,75,1080,85.3C1200,96,1320,128,1380,144L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
				</svg>
			</Box>


			<Stack p="md" spacing="md" sx={{ pointerEvents: enabled ? undefined : 'none' }}>
				<Box>
					<Text>Overlays</Text>
				</Box>

				{/* overlay content area */}
				<Box sx={{ borderRadius: '6px', boxShadow: '0 0 0 1px inset #d3d7da' }}>
					<Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '6px' }}>
						{overlays.map((o: any, index: number) => <OverlaySettings key={index} overlay={o} setOverlay={(overlay: any) => setOverlay(index, overlay)} deleteOverlay={() => removeOverlay(index)} />)}
					</Box>
				</Box>

				{/* add overlay button */}
				<Stack>
					<Button onClick={addOverlay} color="primary" variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} leftIcon={<IconPlus />}>Add Overlay</Button>
				</Stack>
			</Stack>
		</Paper>
	);

}

export default React.memo(SettingsPanel);