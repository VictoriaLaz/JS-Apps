/**
 * Created by Vicky on 8/14/2017.
 */
function attachEvents() {
    let container = $("#root")
    let source = $('#towns-template').html();
    let template = Handlebars.compile(source);
    $("#btnLoadTowns").click(attachTowns)
    function attachTowns() {
        let input = $('#towns').val();
        let towns = input.split(', ');
        for (let town of towns) {
            let townLi = template({town: town})
            container.append(townLi)
        }
    }
}