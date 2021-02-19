$(document).ready(function () {

    // Trumbowyg text editor starts here
    $('#textEditor').trumbowyg({
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

    // Select2 category list starts here
    $('#categoryList').select2({
        theme: 'bootstrap4',
        placeholder: "Lütfen bir kategori seçiniz",
        allowClear: true
    });
    // Select2 categoryList ends here

    // Datepicker starts here
    $("#datePicker").datepicker({
        closeText: "kapat",
        prevText: "&#x3C;geri",
        nextText: "ileri&#x3e",
        currentText: "bugün",
        monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
        monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz",
            "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"],
        dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
        dayNamesShort: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
        dayNamesMin: ["Pz", "Pt", "Sa", "Ça", "Pe", "Cu", "Ct"],
        weekHeader: "Hf",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "",
        duration: 500, // Ne kadar sürede açılıp kapansın
        showAnim: "drop",
        showOptions: {direction: "left"},
        minDate: -3 ,// şuanki tarihten birgün öncesine kadar tarih seçimine izin verir.
        maxDate: 3 // şuanki tarihten birgün sonrasına kadar tarih seçimine izin verir.
    });
    // Datepicker ends here


});