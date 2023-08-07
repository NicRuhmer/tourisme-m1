ClassicEditor
    .create(document.querySelector('#contenu'))
    .catch(error => {
        console.error(error);
    });