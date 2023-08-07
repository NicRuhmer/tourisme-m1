$(document).ready(function () {
    $('#updateForm').on('submit', function (e) {
        e.preventDefault();

        $.ajax({
            url: $(this).attr('action'),
            method: 'PUT',
            data: new FormData(this),
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                // Gérer la réponse ici, par exemple rafraîchir la page ou afficher un message.
            },
            error: function (error) {
                console.error('Erreur:', error);
            }
        });
    });
});

$('#updateSous').on('click', function() {
    const id = $(this).data('id');

    const image = document.getElementById('formFile').file;

    const form_data = new FormData();
    form_data.append("image", image);
    form_data.append("categorie", $("#categ").val());
    form_data.append("name", $("#SousCateg").val());
    form_data.append("description", $("#descript").val());

    var url_ = "/api/updateSousCategorie/"+id;

    $.ajax({
        url: url_,
        method: "PUT",
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function (response) {
            if (response.status == 200) {
                res.redirect('/dashboard')
            } else {
                console.log('erreur');
            }
        },
    });
});

