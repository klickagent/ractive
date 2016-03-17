import gatherRefs from '../../view/helpers/gatherRefs';
import { addHelpers } from '../../view/helpers/contextMethods';

const query = document && document.querySelector;

export default function( node ) {
	if ( typeof node === 'string' && query ) {
		node = query.call( document, node );
	}

	if ( !node || !node._ractive ) return {};

	const storage = node._ractive;

	return addHelpers( {}, storage.proxy );
}
