import { Box, createMuiTheme, debounce, fade, IconButton, MuiThemeProvider, Switch, TextField, Tooltip } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Search as SearchIcon } from '@material-ui/icons';
import { Palette as PaletteIcon, Selection as SelectionIcon, TooltipTextOutline as TooltipTextOutlineIcon, TrashCan } from 'mdi-material-ui';
import * as React from 'react';
import ColorPicker from './ColorPicker';

const OverlaySettings = ({ overlay, setOverlay }: any) => {


	const color = overlay?.color || blue[500];

	const theme = React.useMemo(() => {
		return createMuiTheme({
			palette: {
				primary: {
					main: color,
				}
			}
		})
	}, [color]);

	return (
		<MuiThemeProvider theme={theme}>
			<OverlaySettingsContent overlay={overlay} setOverlay={setOverlay} />
		</MuiThemeProvider>
	);

}

const OverlaySettingsContent = ({ overlay, setOverlay, deleteOverlay }: any) => {

	const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
	const [colorAnchor, setColorAnchor] = React.useState();


	const { queryMode = false, tooltipEnabled = false, outlinesEnabled = false, color = blue[500], search = '', enabled = false } = overlay;
	const [textFieldValue, setTextFieldValue] = React.useState(search);


	const isAttributeMode = !queryMode;

	const debouncedSetOverlay = React.useCallback(debounce(setOverlay, 1500), [setOverlay])

	const handleSearchChange = (e: any) => {
		const value = e?.target?.value;
		setTextFieldValue(value);
		debouncedSetOverlay({ ...overlay, search: value });
	}

	return (
		<Box display="flex" width="100%" alignItems="center" bgcolor={fade(color, 0.1)}>
			{/* search type */}
			<Tooltip title={isAttributeMode ? 'Attribute Search' : 'Query Selector Search'}>
				<span>
					<IconButton color="primary">
						<SearchIcon />
					</IconButton>
				</span>
			</Tooltip>

			{/* search field */}
			<TextField size="small" color="primary" variant="outlined" placeholder="Query" value={textFieldValue} onChange={handleSearchChange} style={{ flex: 1, background: 'white', borderRadius: 4 }} InputProps={{ style: { padding: '5px 0' } }} />

			{/* outlines */}
			<Tooltip title={outlinesEnabled ? 'Disable Outlines' : 'Enable Outlines'}>
				<span>
					<IconButton color={outlinesEnabled ? 'primary' : undefined} onClick={() => setOverlay({ ...overlay, outlinesEnabled: !outlinesEnabled })}>
						<SelectionIcon />
					</IconButton>
				</span>
			</Tooltip>

			{/* tooltip */}
			<Tooltip title={tooltipEnabled ? 'Disable Tooltip' : 'Enable Tooltip'}>
				<span>
					<IconButton disabled={!isAttributeMode} color={(isAttributeMode && tooltipEnabled) ? 'primary' : undefined} onClick={() => setOverlay({ ...overlay, tooltipEnabled: !tooltipEnabled })}>
						<TooltipTextOutlineIcon />
					</IconButton>
				</span>
			</Tooltip>

			{/* color */}
			<Tooltip title="Color">
				<span>
					<IconButton ref={(node: any) => setColorAnchor(node)} color="primary" onClick={() => setColorPickerOpen(prev => !prev)}>
						<PaletteIcon />
					</IconButton>
				</span>
			</Tooltip>

			{/* enable/disable switch */}
			<Tooltip title={enabled ? 'Disable Overlay' : 'Enable Overlay'}>
				<Switch color="primary" checked={enabled} onChange={() => setOverlay({ ...overlay, enabled: !enabled })} />
			</Tooltip>

			{/* delete overlay */}
			<Tooltip title="Delete Overlay">
				<Box color="error.main">
					<IconButton color="inherit" onClick={deleteOverlay}>
						<TrashCan />
					</IconButton>
				</Box>
			</Tooltip>

			<ColorPicker anchorEl={colorAnchor} open={colorPickerOpen} value={color} onChange={(c: any) => setOverlay({ ...overlay, color: c })} onClose={() => setColorPickerOpen(false)} />
		</Box>
	);

}

export default React.memo(OverlaySettings);