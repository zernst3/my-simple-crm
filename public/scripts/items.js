$(document).ready(function() {
    $.fn.dataTable.moment( 'dddd MMM D YYYY' );

    $('table.displayTickets').DataTable({
        "order": [[ 2, "asc" ]]
    });
} );

$(document).ready(function() {
    $('table.displayUsers').DataTable({
        "order": [[ 0, "asc" ]]
    });
} );

$(document).ready(function() {
    $('table.displayClients').DataTable({
        "order": [[ 0, "asc" ]]
    });
} );

$(document).ready(function() {
    $.fn.dataTable.moment( 'dddd MMM D YYYY' );

    $('table.displayJobs').DataTable({
        "order": [[ 1, "desc" ]]
    });
} );

$(document).ready(function() {
    $.fn.dataTable.moment( 'dddd MMM D YYYY' );

    $('table.displayTransactions').DataTable({
        "order": [[ 0, "desc" ]]
    });
} );

$(document).ready(function() {
    $.fn.dataTable.moment( 'dddd MMM D YYYY' );

    $('table.displayAssociatedJobs').DataTable({
        "order": [[ 2, "desc" ]]
    });
} );

$(document).ready(function() {
    $.fn.dataTable.moment( 'dddd MMM D YYYY' );
    
    $('table.displayAssociatedTransactions').DataTable({
        "order": [[ 0, "desc" ]]
    });
} );