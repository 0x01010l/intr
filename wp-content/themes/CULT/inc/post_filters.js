jQuery(function($){
    $('.blog-posts__filter-list input').on('click', function( event ) {
        let filter = $(this),
            flex_key = filter.data( 'flex_key' ),
            post_type = filter.data( 'post_type' ),
            taxonomy = filter.data( 'taxonomy' ),
            offset = filter.data( 'offset' ),
            tag = filter.val();

        let button = $('#flex-' + flex_key + ' div.post_filters');

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            data: {
                post_type : post_type,
                filter: true,
                taxonomy: taxonomy,
                tag: tag,
                offset: offset,
                action : 'post_filters'
            },
            success : function( data ){
                const obj = $.parseJSON( data );
                $('#flex-' + flex_key + ' .blog-posts__list').html( obj.html );
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

    $('.post_filters').on('click', function( event ) {
        let button = $(this),
            paged = button.data( 'paged' ),
            label = button.data( 'label' ),
            post_type = button.data( 'post_type' ),
            flex_key = button.data( 'flex_key' ),
            offset = button.data( 'offset' ),
            taxonomy = button.data( 'taxonomy' );

        let checkedTag = document.querySelector('#flex-'+flex_key+' input[type="radio"]:checked'),
            tag = checkedTag ? checkedTag.value : '';

        $.ajax({
            type: 'POST',
            url: '/wp-admin/admin-ajax.php',
            data: {
                paged : paged,
                post_type : post_type,
                taxonomy: taxonomy,
                tag: tag,
                offset: offset,
                action : 'post_filters'
            },
            beforeSend : function( xhr ) {
                button.text( 'Loading ...' );
            },
            success : function( data ){
                paged++;
                button.data('paged', paged);
                const obj = $.parseJSON( data );
                $('#flex-' + flex_key + ' .blog-posts__list').append( obj.html );
                button.text( 'Load More' );
                if( paged === obj.max_pages ) {
                    button.hide();
                }
            }

        });
    });
});