define([
	'config/errors',
	'config/isClient',
	'utils/warn',
	'utils/isObject',
	'registries/partials',
	'parse/_parse',
	'render/DomFragment/Partial/deIndent'
], function (
	errors,
	isClient,
	warn,
	isObject,
	partials,
	parse,
	deIndent
) {

	'use strict';

	return function getPartialDescriptor ( ractive, name ) {
		var el, partial, errorMessage;

		// If the partial was specified on this instance, great
		if ( partial = getPartialFromRegistry( ractive, name ) ) {
			return partial;
		}

		// Does it exist on the page as a script tag?
		if ( isClient ) {
			el = document.getElementById( name );
			if ( el && el.tagName === 'SCRIPT' ) {
				if ( !parse ) {
					throw new Error( errors.missingParser );
				}

				registerPartial( parse( deIndent( el.text ), ractive.parseOptions ), name, partials );
			}
		}

		partial = partials[ name ];

		// No match? Return an empty array
		if ( !partial ) {
			errorMessage = 'Could not find descriptor for partial "' + name + '"';

			if ( ractive.debug ) {
				throw new Error( errorMessage );
			} else {
				warn( errorMessage );
			}

			return [];
		}

		return partial;
	};

	function getPartialFromRegistry ( ractive, name ) {
		var partial;

		if ( ractive.partials[ name ] ) {

			// If this was added manually to the registry, but hasn't been parsed,
			// parse it now
			if ( typeof ractive.partials[ name ] === 'string' ) {
				if ( !parse ) {
					throw new Error( errors.missingParser );
				}

				partial = parse( ractive.partials[ name ], ractive.parseOptions );
				registerPartial( partial, name, ractive.partials );
			}

			return ractive.partials[ name ];
		}
	}

	function registerPartial ( partial, name, registry ) {
		var key;

		if ( isObject( partial ) ) {
			registry[ name ] = partial.main;

			for ( key in partial.partials ) {
				if ( partial.partials.hasOwnProperty( key ) ) {
					registry[ key ] = partial.partials[ key ];
				}
			}
		} else {
			registry[ name ] = partial;
		}
	}

});
