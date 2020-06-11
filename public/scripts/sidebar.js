//Vertical navbar source: https://bootstrapious.com/p/bootstrap-vertical-navbar 

$(function() {
    // Sidebar toggle behavior
    $('#sidebarCollapse').on('click', function() {
      $('#sidebar, #content, .toggle-button').toggleClass('active');
    });
  });