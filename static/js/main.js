$(document).ready(function() {
    // Track when a user clicks the start button
    $('.start-btn').on('click', function() {
        console.log('User started the course');
    });
    
    // Add hover effects to topic cards
    $('.topic-card').hover(
        function() {
            $(this).find('.topic-number').css('transform', 'scale(1.1)');
        },
        function() {
            $(this).find('.topic-number').css('transform', 'scale(1)');
        }
    );
}); 