$(document).ready(function () {

    // Trumbowyg text editor starts here
    $('#text-editor').trumbowyg({
        btns: [
            ['viewHTML'],
            ['undo', 'redo'], // Only supported in Blink browsers
            ['formatting'],
            ['strong', 'em', 'del'],
            ['superscript', 'subscript'],
            ['link'],
            ['insertImage'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
            ['unorderedList', 'orderedList'],
            ['horizontalRule'],
            ['removeformat'],
            ['fontfamily', 'fontsize'],
            ['foreColor', 'backColor'],
            ['emoji'],
            ['fullscreen']
        ]
    });
    // Trumbowyg text editor ends here

    //Select2 category list starts here
    $('#categoryList').select2({
        theme: 'bootstrap4',
        placeholder: "Lütfen bir kategori seçiniz",
        allowClear: true
    });
    //Select2 categoryList ends here

});