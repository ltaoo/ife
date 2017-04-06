let index = (ctx, next) => {
	ctx.render('index.html', {title: 'Index Page'})
}

module.exports = {
	'GET /': index
}