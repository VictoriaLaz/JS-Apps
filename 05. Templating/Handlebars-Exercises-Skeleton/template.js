$(() => {
    let container = $("#allCats")
    let context = cats;
    let source = $('#cat-template').html();
    let template = Handlebars.compile(source);
    renderCatTemplate();
    function renderCatTemplate() {
        for (let cat of context) {
            container.append(template(cat))
        }
        $('.btn-primary').click(showHideStatus);

        function showHideStatus(){
            if ($(this).text() === 'Show status code')
                $(this).text('Hide status code');
            else
                $(this).text('Show status code');
            $(this).next().toggle();
        }
    }
});
