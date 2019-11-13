export default class ColorPicker extends elementorModules.Module {
	constructor( ...args ) {
		super( ...args );

		this.createPicker();
	}

	getColorPickerPaletteIndex( paletteKey ) {
		return [ '7', '8', '1', '5', '2', '3', '6', '4' ].indexOf( paletteKey );
	}

	getColorPickerPalette() {
		const colorPickerScheme = elementor.schemes.getScheme( 'color-picker' ),
			items = _.sortBy( colorPickerScheme.items, ( item ) => {
				return this.getColorPickerPaletteIndex( item.key );
			} );

		return _.pluck( items, 'value' );
	}

	getDefaultSettings() {
		return {
			theme: 'monolith',
			swatches: this.getColorPickerPalette(),
			position: 'bottom-' + ( elementorCommon.config.isRTL ? 'end' : 'start' ),
			components: {
				opacity: true,
				hue: true,
				interaction: {
					input: true,
					clear: true,
				},
			},
			strings: {
				clear: elementor.translate( 'clear' ),
			},
		};
	}

	createPicker() {
		const settings = this.getSettings();

		settings.default = settings.default || null;

		const picker = Pickr.create( settings ),
			onChange = ( ...args ) => {
				picker.applyColor();

				if ( settings.onChange ) {
					settings.onChange( ...args );
				}
			},
			onClear = ( ...args ) => {
				if ( settings.onClear ) {
					settings.onClear( ...args );
				}
			};

		picker
			.on( 'change', onChange )
			.on( 'swatchselect', onChange )
			.on( 'clear', onClear );

		this.picker = picker;

		this.addPlusButton();
	}

	getValue() {
		return this.picker.getColor().toRGBA().toString( 0 );
	}

	addPlusButton() {
		const $button = jQuery( '<button>', { class: 'elementor-color-picker-palette--add' } ).html( jQuery( '<i>', { class: 'eicon-plus' } ) );

		$button.on( 'click', () => this.onAddButtonClick() );

		this.$addButton = $button;

		this.addPlusButtonToSwatches();
	}

	addPlusButtonToSwatches() {
		jQuery( this.picker.getRoot().swatches ).append( this.$addButton );
	}

	destroy() {
		this.picker.destroyAndRemove();
	}

	onAddButtonClick() {
		const value = this.getValue();

		elementor.schemes.addSchemeItem( 'color-picker', { value } );

		this.picker.addSwatch( value );

		this.addPlusButtonToSwatches();

		elementor.schemes.saveScheme( 'color-picker' );
	}
}
