$(document).ready(function () {

    // DataTable start here 
    $('#categoriesTable').DataTable({
        dom:
            "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "order": [[1, "desc"]],
        // Data table içerisine yerleştireceğimiz butonlar ve özellikleri
        buttons: [
            {
                // Ekle butonu özellikleri
                text: 'Ekle',
                attr: {
                    id: "btnAdd"
                },
                className: 'btn btn-success',
                action: function (e, dt, node, config) {
                    //alert('Ekle butonuna basıldı');
                }
            },
            {
                // Tabloyu Yenile butonu özellikleri
                text: 'Yenile',
                className: 'btn btn-primary',
                action: function (e, dt, node, config) {
                    // Yenile butonuna basıldığında ihityacımız olacak olan özellikler ve işlemler
                    $.ajax({
                        type: 'GET',    // Ne tipte bir Ajax işlemi kullandığımızı belirtiyoruz.
                        url: '/Admin/Category/GetAllCategories/', //Get işlemi yapacağımız URL adresini veriyoruz.
                        contentType: "application/json",    // Ajax işlemini yaptığımızda hangi tipte işlem yapacağımızı belirtiyoruz. Burada json tipini verdik.
                        beforeSend: function () {       //Ajax işlemini yapmadan önce çalışacak olan actionınımız.
                            $('#categoriesTable').hide();   // tablomuzun gizlenmesi
                            $('.spinner-border').show();    // sayfanın yenilendiğini göstermek için spinnerin görünmesi
                        },
                        success: function (data) { //Ajax get işlemi başarılı olarak gerçekleşirse
                            //console.log(data);
                            const categoryListDto = jQuery.parseJSON(data); // controllerdan categoryListDto Json formatında dönüyor
                            console.log(categoryListDto);
                            if (categoryListDto.ResultStatus === 0) {   // controllerdan dönen categoryListDto datamızın içerisinde yer alan ResultStatus değerimizi kontrol ediyoruz.
                                let tableBody = "";
                                $.each(categoryListDto.Categories.$values, function (index, category) { // Jquery each metodunda parametre olarak önce hangi değerleriçerisinde dönecekse onu veriyoruz, sonrasinda ise her bir değer üzerinde gerçekleştireceği işlemleri fonksiyon olarak yazıyoruz.
                                    // categoryListDto datamızın içerisindeki Categories'in içerisindeki değerlerin valuelarını alıyoruz.
                                    tableBody += `<tr name="${category.Id}">
                                                     <td>${category.Id}</td>
                                                     <td>${category.Name}</td>
                                                     <td>${category.Description}</td>
                                                     <td>${category.IsActive ? "Evet" : "Hayır"}</td>
                                                     <td>${category.IsDeleted ? "Evet" : "Hayır"}</td>
                                                     <td>${category.Note}</td>
                                                     <td>${convertToShortDate(category.CreatedDate)}</td>
                                                     <td>${category.CreatedByName}</td>
                                                     <td>${convertToShortDate(category.ModifiedDate)}</td>
                                                     <td>${category.ModifiedByName}</td>
                                                     <td>
                                                         <button class="btn btn-warning btn-sm btn-update" data-id="${category.Id}"><span class="fas fa-edit"></span></button>
                                                         <button class="btn btn-danger btn-sm btn-delete" data-id="${category.Id}"><span class="fas fa-minus-circle"></span></button>
                                                     </td>
                                                  </tr>`;
                                });
                                $('#categoriesTable > tbody').replaceWith(tableBody); // tablomuzun body'sini oluşturmuş olduğumuz tableBody ile değiştiriyoruz.
                                $('.spinner-border').hide(); //spinner'ı gizliyoruz.
                                $('#categoriesTable').fadeIn(1400); //tablomuzun fade efekti ile tekrar görünmesini sağlıyoruz.
                            } else {    //ResultStatus 1 yani false dönerse
                                toastr.error(`${categoryListDto.Message}`, 'işlem Başarısız!'); //toastr.error ile controllerdan döndürüğümüz hata mesajını bastırır
                            }
                        },
                        error: function (err) { //AJax get işlemimizde hata oluşursa
                            console.log(err);   //hatayı console yazdır.
                            $('.spinner-border').hide(); //Hata aldığımızda spinnerin sonsuza kadar dönmemesi için spinner'ı gizliyoruz.
                            $('#categoriesTable').fadeIn(1000); //Ve tekrardan tablomuzun fade efekti ile görünmesini sağlıyoruz.
                            toastr.error(`${err.responseText}`, 'Hata!'); //toastr.error ile controllerdan döndürüğümüz hata mesajını bastırır
                        }
                    });
                }
            },
        ],
        language:
        {
            "emptyTable": "Tabloda herhangi bir veri mevcut değil",
            "info": "_TOTAL_ kayıttan _START_ - _END_ arasındaki kayıtlar gösteriliyor",
            "infoEmpty": "Kayıt yok",
            "infoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
            "infoThousands": ".",
            "lengthMenu": "Sayfada _MENU_ kayıt göster",
            "loadingRecords": "Yükleniyor...",
            "processing": "İşleniyor...",
            "search": "Ara:",
            "zeroRecords": "Eşleşen kayıt bulunamadı",
            "paginate": {
                "first": "İlk",
                "last": "Son",
                "next": "Sonraki",
                "previous": "Önceki"
            },
            "aria": {
                "sortAscending": ": artan sütun sıralamasını aktifleştir",
                "sortDescending": ": azalan sütun sıralamasını aktifleştir"
            },
            "select": {
                "rows": {
                    "_": "%d kayıt seçildi",
                    "1": "1 kayıt seçildi",
                    "0": "-"
                },
                "0": "-",
                "1": "%d satır seçildi",
                "2": "-",
                "_": "%d satır seçildi",
                "cells": {
                    "1": "1 hücre seçildi",
                    "_": "%d hücre seçildi"
                },
                "columns": {
                    "1": "1 sütun seçildi",
                    "_": "%d sütun seçildi"
                }
            },
            "autoFill": {
                "cancel": "İptal",
                "fill": "Bütün hücreleri <i>%d<i> ile doldur<\/i><\/i>",
                "fillHorizontal": "Hücreleri yatay olarak doldur",
                "fillVertical": "Hücreleri dikey olarak doldur",
                "info": "-"
            },
            "buttons": {
                "collection": "Koleksiyon <span class=\"ui-button-icon-primary ui-icon ui-icon-triangle-1-s\"><\/span>",
                "colvis": "Sütun görünürlüğü",
                "colvisRestore": "Görünürlüğü eski haline getir",
                "copy": "Koyala",
                "copyKeys": "Tablodaki sisteminize kopyalamak için CTRL veya u2318 + C tuşlarına basınız.",
                "copySuccess": {
                    "1": "1 satır panoya kopyalandı",
                    "_": "%ds satır panoya kopyalanUrlı"
                },
                "copyTitle": "Panoya kopyala",
                "csv": "CSV",
                "excel": "Excel",
                "pageLength": {
                    "-1": "Bütün satırları göster",
                    "1": "-",
                    "_": "%d satır göster"
                },
                "pdf": "PDF",
                "print": "Yazdır"
            },
            "decimal": "-",
            "infoPostFix": "-",
            "searchBuilder": {
                "add": "Koşul Ekle",
                "button": {
                    "0": "Arama Oluşturucu",
                    "_": "Arama Oluşturucu (%d)"
                },
                "clearAll": "Hepsini Kaldır",
                "condition": "Koşul",
                "conditions": {
                    "date": {
                        "after": "Sonra",
                        "before": "Önce",
                        "between": "Arasında",
                        "empty": "Boş",
                        "equals": "Eşittir",
                        "not": "Değildir",
                        "notBetween": "Dışında",
                        "notEmpty": "Dolu"
                    },
                    "moment": {
                        "after": "Sonra",
                        "before": "Önce",
                        "between": "Arasında",
                        "empty": "Boş",
                        "equals": "Eşittir",
                        "not": "Değildir",
                        "notBetween": "Dışında",
                        "notEmpty": "Dolu"
                    },
                    "number": {
                        "between": "Arasında",
                        "empty": "Boş",
                        "equals": "Eşittir",
                        "gt": "Büyüktür",
                        "gte": "Büyük eşittir",
                        "lt": "Küçüktür",
                        "lte": "Küçük eşittir",
                        "not": "Değildir",
                        "notBetween": "Dışında",
                        "notEmpty": "Dolu"
                    },
                    "string": {
                        "contains": "İçerir",
                        "empty": "Boş",
                        "endsWith": "İle biter",
                        "equals": "Eşittir",
                        "not": "Değildir",
                        "notEmpty": "Dolu",
                        "startsWith": "İle başlar"
                    }
                },
                "data": "Veri",
                "deleteTitle": "Filtreleme kuralını silin",
                "leftTitle": "Kriteri dışarı çıkart",
                "logicAnd": "ve",
                "logicOr": "veya",
                "rightUrlitle": "Kriteri içeri al",
                "title": {
                    "0": "Arama Oluşturucu",
                    "_": "Arama Oluşturucu (%d)"
                },
                "value": "Değer"
            },
            "searchPanes": {
                "clearMessage": "Hepsini Temizle",
                "collapse": {
                    "0": "Arama Bölmesi",
                    "_": "Arama Bölmesi (%d)"
                },
                "count": "{total}",
                "countFiltered": "{shown}\/{total}",
                "emptyPanes": "Arama Bölmesi yok",
                "loadMessage": "Arama Bölmeleri yükleniyor ...",
                "title": "Etkin filtreler - %d"
            },
            "searchPlaceholder": "Ara",
            "thousands": "."
        }
    });
    // DataTable end here 

    // Add
    $(function () {

        // Ajax GET / Getting the _CategoryAddPartial as Modal Form starts from here.
        const url = '/Admin/Category/Add/';
        const placeHolderDiv = $('#modalPlaceHolder');

        $('#btnAdd').click(function () {
            $.get(url).done(function (data) {
                placeHolderDiv.html(data);
                placeHolderDiv.find('.modal').modal('show');
            });
        });
        // Ajax GET / Getting the _CategoryAddPartial as Modal Form ends from here. 


        // Ajax POST / Posting the FormData as CategoryAddDto starts from here. 
        placeHolderDiv.on('click', '#btnSave', function (event) {
            event.preventDefault(); //btnSave butonu submit butonu olsaydı sayfamız otamatik olarak yeniden yüklenecekti ne olur nolmaz onu engellemek için preventDefault kullanılır.
            const form = $('#form-category-add');
            const actionUrl = form.attr('action');  //asp-action="Add" action attribute'u
            const dataToSend = form.serialize();    //form değişkenine atamış olduğumuz partial view içerisindeki form-category-add id'li html forunu text'e çevirir.
            //console.log(dataToSend)
            $.post(actionUrl, dataToSend).done(function (data) {    //fonksiyon parametresi olan data, actionUrl'den CategoryController Add(HttpPost) action'nundan dönen data
                //console.log(data);
                const categoryAddAjaxModel = jQuery.parseJSON(data);    //ActionResult'dan dönen dtayı Json formatına çevirip değişkene atadık.
                //console.log(categoryAddAjaxModel);
                const newFormBody = $('.modal-body', categoryAddAjaxModel.CategoryAddPartial);  //Controllerdan dönen, Json çevirmiş olduğmuz olduğumuz model'in içerisinde bulunan partial view kısmından class'ı modal-body olan kısmı seçip newFormBody değişkenine atıyoruz.
                placeHolderDiv.find('.modal-body').replaceWith(newFormBody);    // Eski modal-body'i oluşturduğumuz yeni modal-nody ile yani newFormBody ile değiştir.
                const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';  // newFormBody içerisindeki IsValid inputunun value'değerinin true olup olmadığına bakıyoruz.
                if (isValid) {  //isValid True ise modal durumumuz doğru demektir ve buradaki bütün post işlemlerimiz gerçekleşmiş demektir.
                    placeHolderDiv.find('.modal').modal('hide');    //placeholder div'i içerisine yerleştirdiğimiz partial view olan momdal'ı sakla. // Eklenen data için yeni row yapısını oluştur.
                    const newTableRow = `
                             <tr name="${categoryAddAjaxModel.CategoryDto.Category.Id}">
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Id}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Name}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Description}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.IsActive ? "Evet" : "Hayır" }</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.IsDeleted ? "Evet" : "Hayır" }</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.Note}</td>
                                <td>${convertToShortDate(categoryAddAjaxModel.CategoryDto.Category.CreatedDate)}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.CreatedByName}</td>
                                <td>${convertToShortDate(categoryAddAjaxModel.CategoryDto.Category.ModifiedDate)}</td>
                                <td>${categoryAddAjaxModel.CategoryDto.Category.ModifiedByName}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-update" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}"><span class="fas fa-edit"></span></button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${categoryAddAjaxModel.CategoryDto.Category.Id}"><span class="fas fa-minus-circle"></span></button>
                                </td>
                            </tr>`;
                    const newTableRowObject = $(newTableRow);   // Table row normalde bir string iken bu işlem ile beraber newTableRow'u bir JQuery yada JAvascript objesi haline getiriyoruz.
                    newTableRowObject.hide(); // önce hide ile görünmez hale getiriyoruz.(fade efektiyle ekleyebilmek için önce hide'ladık.)
                    $('#categoriesTable').append(newTableRow);  // oluşturmuş olduğumuz row yapısını categoriesTable'ının sonuna ekle (append)
                    newTableRowObject.fadeIn(3000);     // Eklemeyi fade efektiyse yap yani 3 saniyeda yavaşça belirsin.
                    toastr.success(`${categoryAddAjaxModel.CategoryDto.Message}`, 'Başarılı İşlem!');   // toastr ile de success mesajı göster.
                } else { // validation false geldiği zaman toastr içerisinde hata mesajlarını gösteren kod
                    let summaryText = "";
                    $('#validation-summary > ul > li').each(function () {   // _CategoryAddPartial view'inde bulunan validation-summary id'li divimizi seçtik. Validation mesajlarımız liste olarak dönüyor ve bu divimizin içerisinde gösteriliyor. o yüzden ul li diyerek her bir liste elemenını seçtik. ve bunların her biri için fonksiyon çalıştırdık.
                        let text = $(this).text();
                        summaryText = `${text}\n`;
                    });
                    toastr.warning(summaryText); //en son bütün validation mesajlarını tek bir toastr içinde gösterdik.
                }
            });
        });
        // Ajax POST / Posting the FormData as CategoryAddDto ends here. 
    });


    // Delete
    // Ajax POST / Deleting a Category starts from here. 
    $(document).on('click', '.btn-delete', function (event) {
        event.preventDefault(); //eğer buton submit butonu olsaydı sayfa tekrar yüklenirdi o yüzden önlem amaçlı event.preventDefault yazıyoruz.
        const id = $(this).attr('data-id');
        const tableRow = $(`[name="${id}"]`); // Silme işleminin yapılacağı row seçiliyor.Silme mesajından sonra silinen veriye ait row'un tablodan kaybolması için ve bu rowun özelliklerinden yararlanmak için rowu bir değişkene atıyoruz.
        const categoryName = tableRow.find('td:eq(1)').text(); // TableRowa ait olan 2. kolondaki table datayı seçiyoruz.
        // SweetAlert kodlarımız kaynak: https://sweetalert2.github.io/
        Swal.fire({
            title: `${categoryName} adlı kategoriyi silmek istediğinize emin misiniz?`,
            text: "Bu işlemi geri alamazsınız!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Evet, Sil!',
            cancelButtonText: 'Hayır, işlemi iptal et.'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: 'POST',   //yapacağımız işlemin türü (type)
                    dataType: 'json',   // yapacağımız işlemi hangi veri tipinde yapıyoruz ( json tipinde bir veri göndericez)
                    data: { categoryId: id }, // veri controllera nereden gelecek? action kısmınde ne bekliyorsak onu bir javascript objesi olarak göndereceğiz. Controller içerisindeki Delete actionumuza parametre olarak controllerId göndermemiz gerekiyor.
                    url: '/Admin/Category/Delete/',   // veriyi göndereceğimiz url(action adresi)
                    // actionlar
                    // success actionu
                    success: function (data) { // controllerdaki actionumuzdan Json formatında bir IResult tipinde bir data döner, bunu fonksiyonumuza parametre olarak veriyoruz.
                        const categoryDto = jQuery.parseJSON(data); // gelen datayı Json'a parse edip modele dönüştürüyor.
                        console.log(categoryDto);
                        if (categoryDto.ResultStatus === 0) {    // dönen verimizde ReultStatus'umuz 0 yani başarılı ise Swal.fire ile silindi mesajı gösterilir.
                            Swal.fire(
                                'Silindi!',
                                `${categoryDto.Category.Name} adlı kategori başarıyla silinmiştir.`,
                                'success'
                            );
                            tableRow.fadeOut(3500); // Ardından rowumuzun tablodan fadeOut efektiyle yok olmasını sağlarız.
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Bir hata oluştu...',
                                text: `${categoryDto.Message}`,
                            });
                        }
                    },
                    // error actionu
                    error: function (err) {
                        console.log(err);
                        toastr.error(`${err.responseText}`, "Hata!");
                    }
                });
            }
        });
    });
    // Ajax POST / Deleting a Category ends here. 


    // Update
    $(function () {

        // Ajax GET / Getting the _CategoryUpdatePartial as Modal Form starts from here.
        const url = '/Admin/Category/Update/';      //Url adresini verdik.
        const placeHolderDiv = $('#modalPlaceHolder');  //indedx sayfasındaki modalPlaceHolder idsini verdiğimiz div'in içerisine partialView'imiİ modal olarak yerleştirmek için onu bir değişkene atadık.

        $(document).on('click', '.btn-update', function (event) {   //index sayfasında class'ı btn-update olan bir butona tıklanırsa belirttiğimiz fonksiyon içerisindeki kodlar çalışacak.
            event.preventDefault();
            const id = $(this).attr('data-id'); // tıklanan buton'a attribute olarak girmiş olduğumuz data-id'deki id değerini aldık.
            $.get(url, { categoryId: id }).done(function (data) {   //ajax get metoduna url'i, ve gönderilecek olan, yani beklenen categoryId parametresini, oluşturduğumuz id değişkenine eşitleyerek gönderir.
                placeHolderDiv.html(data);      // controllerdan dönen data'yı placeholder div içerisine ekledik. (dönen data partial view ve içerisinde model ile birlikte dönüyor.)
                placeHolderDiv.find('.modal').modal('show'); // placeHolderDiv'in içerisinde class'ı modal olan div'i modal'a çevirir ve ekranda gösterir.
            }).fail(function () {   // get işlemi hatayla sonuçlanırsa
                toastr.error("Bir hata oluştu.", "Hata!");  //toastr ile hatayı göster.
            });
        });
        // Ajax GET / Getting the _CategoryUpdatePartial as Modal Form ends here.


        // Ajax POST / Posting the FormData as CategoryUpdateDto starts from here. 
        placeHolderDiv.on('click', '#btnUpdate', function (event) {
            event.preventDefault();

            const form = $('#form-category-update');
            const actionUrl = form.attr('action');
            const dataToSend = form.serialize();
            $.post(actionUrl, dataToSend).done(function (data) {
                const categoryUpdateAjaxModel = jQuery.parseJSON(data);
                console.log(categoryUpdateAjaxModel);

                const newFormBody = $('.modal-body', categoryUpdateAjaxModel.CategoryUpdatePartial);
                placeHolderDiv.find('.modal-body').replaceWith(newFormBody);

                const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';
                if (isValid) {
                    placeHolderDiv.find('.modal').modal('hide'); 
                    const newTableRow = `
                             <tr name="${categoryUpdateAjaxModel.CategoryDto.Category.Id}">
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.Id}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.Name}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.Description}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.IsActive ? "Evet" : "Hayır"}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.IsDeleted ? "Evet" : "Hayır"}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.Note}</td>
                                <td>${convertToShortDate(categoryUpdateAjaxModel.CategoryDto.Category.CreatedDate)}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.CreatedByName}</td>
                                <td>${convertToShortDate(categoryUpdateAjaxModel.CategoryDto.Category.ModifiedDate)}</td>
                                <td>${categoryUpdateAjaxModel.CategoryDto.Category.ModifiedByName}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-update" data-id="${categoryUpdateAjaxModel.CategoryDto.Category.Id}"><span class="fas fa-edit"></span></button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${categoryUpdateAjaxModel.CategoryDto.Category.Id}"><span class="fas fa-minus-circle"></span></button>
                                </td>
                            </tr>`;
                    const newTableRowObject = $(newTableRow); 

                    const categoryTableRow = $(`[name=${categoryUpdateAjaxModel.CategoryDto.Category.Id}]`);
                    newTableRowObject.hide();
                    categoryTableRow.replaceWith(newTableRowObject);
                    newTableRowObject.fadeIn(3000);     
                    toastr.success(`${categoryUpdateAjaxModel.CategoryDto.Message}`, 'Başarılı İşlem!');  
                } else { 
                    let summaryText = "";
                    $('#validation-summary > ul > li').each(function () { 
                        let text = $(this).text();
                        summaryText = `${text}\n`;
                    });
                    toastr.warning(summaryText);
                }
            }).fail(function (response) {
                console.log(response);
            });
        });
        // Ajax POST / Posting the FormData as CategoryUpdateDto ends here. 
    });
});