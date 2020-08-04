jQuery('.box').find('.child1').addClass('red').end().addClass('yellow').next();

$('.box').css('background', 'red');
console.log($('.box').css({
    color: "#fff",
    border: "2px solid #000"
}))
$('.box').on('click', function() {
    console.log(this)
})
console.log($('.child2').index())