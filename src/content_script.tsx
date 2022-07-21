import React from 'react'
import ReactDOM from "react-dom";

import HighlightOverlay from './src/components/HighlightOverlay';


const attrhRoot = document.createElement('div')
attrhRoot.id = 'attrh__root'
document.body.append(attrhRoot)

ReactDOM.render((
	<HighlightOverlay />
), attrhRoot)

// log script loaded
console.log('%c ~tilda content script loaded!', `padding: 6px 12px; color: white; background: #0099ff; border-radius: 4px; margin: 8px;`)