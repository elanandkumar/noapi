
const fn = async (query) => {
	let isShowBom = false;

	if (query.formname === 'goods') {
		isShowBom = true;
	}

	return {
		formName: query.formname,
		tableName: query.tablename,
		billName: query.billname,
		infoName: query.infoname,
		isbill: query.isbill,
		isinfo: query.isinfo,
		isShowBom: isShowBom,
	};
};

module.exports = fn;
