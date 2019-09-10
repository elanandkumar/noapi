
const data = require('../data');
const lib = require('../__lib');
const assignTo = require('./assignTo');

// ------------------------------------------------ -------
// The following result is a legal result:
// 		a. returns an error; // result = {error}
// 		b. returns an object; // result = [...] or {...}
// ------------------------------------------------ -------
// When will the situation of b occur? E.g:
// 		The forms subsystem in the aha (pre-processing) phase, forwarding the drop-down list "traderlevel" request to kind subsystem,
// 		The kind subsystem handles the request, and returns a value to forms subsystem.
// 		The forms subsystem stops processing and returns the result directly here.
const isValidResult = (result) => {

	// Arrays are also objects, so simple judgment with typeof
	return result && (result.error || typeof result === 'object');
};

const saveToPrivateNameSpace = (query, {sysName, api}) => {
	query.__.sysName = sysName;
	query.__.api = api;
};

/** @name me.callApi */
const fn = async (query, isFromTransfer) => {

	// Parse url:
	// 		/forms:/bill/dropDownList?formname=purchaseOrder&listname=trader
	// Result:
	// 		sysName = "forms"
	// 		api = "/bill/dropdownlist"

	// Note that this is done here, not in ./index.js, because ./api/transfer.js will also call this function.
	// However, transfer.js does not parse the url, causing query.originalUrl and api path
	// to be inconsistent, resulting in an error.
	let {sysName, api} = lib.apiParser.apiUrlToSysNameAndApi(query.originalUrl);

	// /ProjectRoot
	// 		/api
	//			/api
	//			/biz
	//			...
	// 		/web
	//			app.js
	//			...
	//		readme.md
	if (sysName === 'default' && !data.core['default'] && data.core['api']) {
		sysName = 'api';
	}

	if (!data.core[sysName]) {
		return {error: 'Invalid api'};
	}

	// Get the core object of the current subsystem, for example:
	// 		data.core.forms.api, data.core.forms.aha
	const sysApis = data.core[sysName].api;
	const sysAhaFn = data.core[sysName].aha;

	// Save to query._ for use by other modules
	saveToPrivateNameSpace(query, {sysName, api});

	// Get the api function based on sysName, api, sysApis, for example:
	// 		data.core.forms.api.bill.dropDownList
	// Note:
	// 		Although "dropdownlist" in api is lowercase, it can also match "dropDownList"
	const sysApiFn = lib.getSysApiFn(sysName, api, sysApis);

	// If the sysApiFn corresponding to api is not found, it is wrong api
	if (!sysApiFn) {

		// If it is from internal forwarding, then simply returns undefined
		if (isFromTransfer) {
			return;
		}
		else {
			// If it is an access from the url, then throws an error.
			// The actual meaning is: the subsystem does not have this api.

			// For example, if the forms subsystem doesn't have a newKind interface,
			// then requests "/forms:/info/form/newKind" will get an error
			return {error: 'No biz function corresponds to url ' + query.originalUrl.replace('/default:', '')};
		}
	}

	// Remove the originalUrl subsystem name prefix, like "/forms:" (from url request), "forms:" (from api call)
	// Note:
	// 		There is no direct use of api because the req.originalUrl for express also contains
	// 		the url parameter (eg "?formname=xxx"), which is not available in api.
	// 		So here's the originalUrl again, instead of using api directly
	const reg = new RegExp(`^\\/*${sysName}:\\/`, 'i');
	query.originalUrl = query.originalUrl.replace(reg, '/');

	let result;

	// Try to assign requests to another subsystem (if any)
	result = await assignTo(query);
	if (isValidResult(result)) return result;

	// Some preparation work (if any), such as pre-processing parameters
	sysAhaFn && (result = await sysAhaFn(query));
	if (isValidResult(result)) return result;

	// If it is a transfer call, then query.__ is not the current subsystem information,
	// it is easy to cause misunderstanding, so restore settings here
	saveToPrivateNameSpace(query, {sysName, api});

	// If there is no problem with preprocessing, execute the api
	result = await sysApiFn(query);

	return result;
};

module.exports = fn;
