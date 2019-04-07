exports.consoleBg = function(...message) {
	try {
		;(window.chrome || window.browser).runtime.sendMessage({
			__console_bg__: message.map(stringifyFunctions),
		})
	} catch (error) {
		// Handle circular refs (useful for DOM nodes)
		if (error.message.indexOf('circular') > -1) {
			;(window.chrome || window.browser).runtime.sendMessage({
				__console_bg__: message.map(stringifyFunctions).map(removeCircularRefs),
			})
		} else {
			throw error
		}
	}
}

function stringifyFunctions(value) {
	if (typeof value === 'function') {
		return value.toString()
	}
	return value
}

function removeCircularRefs(value) {
	if (value != null && typeof value === 'object') {
		return JSON.parse(JSON.stringify(value, circularReplacer()))
	}
	return value
}

/**
 * JSON stringify replacer removing circular references
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
 */
function circularReplacer() {
	const seen = new WeakSet()
	return (key, value) => {
		if (value != null && typeof value === 'object') {
			if (seen.has(value)) {
				return
			}
			seen.add(value)
		}
		return value
	}
}
