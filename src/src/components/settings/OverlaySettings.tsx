import { ActionIcon, ColorSwatch, Group, Switch, TextInput, Tooltip, useMantineTheme } from '@mantine/core';
import { IconMessage2, IconLayoutDashboard, IconSearch, IconTrash, IconBracketsContain } from '@tabler/icons';
import debounce from 'lodash-es/debounce';
import * as React from 'react';
import fade from '../../util/fade';
import ColorPicker from './ColorPicker';

const OverlaySettings = ({ overlay, setOverlay, deleteOverlay }: any) => {

	return (
		<OverlaySettingsContent overlay={overlay} setOverlay={setOverlay} deleteOverlay={deleteOverlay} />
	);

}

const OverlaySettingsContent = ({ overlay, setOverlay, deleteOverlay }: any) => {

	const theme = useMantineTheme();

	const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
	const [colorAnchor, setColorAnchor] = React.useState();


	const { queryMode = false, tooltipEnabled = false, outlinesEnabled = false, color = theme.colors.blue[5], search = '', enabled = false } = overlay;
	const [textFieldValue, setTextFieldValue] = React.useState(search);


	const isAttributeMode = !queryMode;

	const debouncedSetOverlay = React.useCallback(debounce(setOverlay, 1500), [setOverlay])

	const handleSearchChange = (e: any) => {
		const value = e?.target?.value;
		setTextFieldValue(value);
		debouncedSetOverlay({ ...overlay, search: value });
	}

	return (
		<Group noWrap p="sm" spacing="sm" sx={{ display: 'flex', width: '100%', alignItems: 'center', background: `linear-gradient(to right, ${fade(color, 0.1)}, transparent)` }}>
			{/* color */}
			<ColorPicker open={colorPickerOpen} value={color} onChange={(c: any) => setOverlay({ ...overlay, color: c })} onClose={() => setColorPickerOpen(false)}>
				<Tooltip label="Color">
					<span>
						<ColorSwatch color={color} onClick={() => setColorPickerOpen(prev => !prev)} radius="sm" />
					</span>
				</Tooltip>
			</ColorPicker>

			{/* search type */}
			<Tooltip label={isAttributeMode ? 'Attribute Search' : 'Query Selector Search'}>
				<span>
					<ActionIcon onClick={() => setOverlay({ ...overlay, queryMode: !queryMode })}>
						{isAttributeMode ? <IconBracketsContain /> : <IconSearch />}
					</ActionIcon>
				</span>
			</Tooltip>

			{/* search field */}
			<TextInput size="sm" placeholder="Query" value={textFieldValue} onChange={handleSearchChange} style={{ flex: 1, background: 'white', borderRadius: 4 }} />

			{/* outlines */}
			<Tooltip label={outlinesEnabled ? 'Disable Outlines' : 'Enable Outlines'}>
				<span>
					<ActionIcon color={outlinesEnabled ? 'primary' : undefined} onClick={() => setOverlay({ ...overlay, outlinesEnabled: !outlinesEnabled })}>
						<IconLayoutDashboard />
					</ActionIcon>
				</span>
			</Tooltip>

			{/* tooltip */}
			<Tooltip label={tooltipEnabled ? 'Disable Tooltip' : 'Enable Tooltip'}>
				<span>
					<ActionIcon disabled={!isAttributeMode} color={(isAttributeMode && tooltipEnabled) ? 'primary' : undefined} onClick={() => setOverlay({ ...overlay, tooltipEnabled: !tooltipEnabled })}>
						<IconMessage2 />
					</ActionIcon>
				</span>
			</Tooltip>

			{/* enable/disable switch */}
			<Tooltip label={enabled ? 'Disable Overlay' : 'Enable Overlay'}>
				<Switch checked={enabled} onChange={() => setOverlay({ ...overlay, enabled: !enabled })} />
			</Tooltip>

			{/* delete overlay */}
			<Tooltip label="Delete Overlay">
				<ActionIcon color="red" onClick={deleteOverlay}>
					<IconTrash />
				</ActionIcon>
			</Tooltip>
		</Group>
	);

}

export default React.memo(OverlaySettings);