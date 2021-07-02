import React from 'react'
import ReactDOM from "react-dom";
import ContentApp from './src/components/ContentApp';
import theme from './src/theme';

import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles';


const attrhRoot = document.createElement('div')
attrhRoot.id = 'attrh__root'
document.body.append(attrhRoot)

const classNameGenerator = createGenerateClassName({
	seed: 'TildaExtension'
})

ReactDOM.render((
	<StylesProvider generateClassName={classNameGenerator}>
		<ContentApp />
	</StylesProvider>
), attrhRoot)

// log script loaded
console.log('%c ~tilda content script loaded!', `padding: 6px 12px; box-shadow: ${theme.shadows[8]}; color: white; background: ${theme.palette.primary.main}; border-radius: 4px; margin: 8px;`)