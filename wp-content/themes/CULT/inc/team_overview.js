const fireResize = () => {
    window.dispatchEvent(new Event('resize'))
}

jQuery(function($){
    let selected_filters = [];
    $('.team-filter__btn input[type="checkbox"]').on('click', function( event ) {
        const filter = $(this)
        const name = filter.attr('name')
        const value = filter.attr('value')
        if(!Array.isArray(selected_filters[name])) {
            selected_filters[name] = []
        }
        if(value === 'all') {
            selected_filters[name] = []
        } else {
            if(filter[0].checked) {
                selected_filters[name].push(value)
            } else {
                const id = selected_filters[name].indexOf(value)
                selected_filters[name].splice(id,  1)
            }
        }

        let button = $('div.team_overview');

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            data: {
                filter: true,
                filters: JSON.stringify(Object.assign({}, selected_filters)),
                action : 'team_overview',
            },
            success : function( data ){
                const obj = $.parseJSON( data );
                $('.team-list__list').html( obj.html );
                button.data('paged', 1);
                button.data('max_pages', obj.max_pages);
                if(obj.max_pages < 2) {
                    button.hide()
                } else {
                    button.show()
                }
            }

        });
    });


    $('.team_overview').on('click', function( event ) {
        let button = $(this),
            paged = button.data( 'paged' );

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            data: {
                filters: JSON.stringify(Object.assign({}, selected_filters)),
                paged : paged,
                action : 'team_overview'
            },
            beforeSend : function( xhr ) {
                button.text( 'Loading ...' );
            },
            success : function( data ){
                paged++;
                button.data('paged', paged);
                const obj = $.parseJSON( data );
                $('.team-list__list').append( obj.html );
                button.text( 'Load More' );
                if( paged === obj.max_pages ) {
                    button.hide();
                }
            }

        });
    });
});