const comparer = document.createElement('div');
export function sortAttributes(html: string): string {
	return html.replace(/<([a-z0-9-]+)((?:\s[a-z0-9:_.-]+=".*?")+)((?:\s*\/)?>)/gi, (_, pre, attrs, after) => {
		const attrName = (attribute: string): string => attribute.split('=')[0];
		const list: string[] = attrs.match(/\s[a-z0-9:_.-]+=".*?"/gi).sort( (a, b) => attrName(a) > attrName(b) ? 1 : -1 );
		if (~after.indexOf('/')) {
			after = '></' + pre + '>';
		}
		return '<' + pre + list.join('') + after;
	});
}

export function innerHTML(HTML: string): string {
	comparer.innerHTML = HTML;
	return sortAttributes(comparer.innerHTML);
}
