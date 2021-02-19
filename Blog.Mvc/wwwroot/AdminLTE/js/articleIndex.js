$(document).ready(function () {

    // DataTable start here 
    const dataTable = $('#articlesTable').DataTable({
        dom:
            "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
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
                    let url = window.location.href; // URl'i window location üzerinden alma sebebimiz, şuanda localhost üzerinde çalışıyoruz ama ileride başka bir adreste çalışabiliriz. O yüzden dinamik bir şekilde alıyoruz.
                    url = url.replace("/Index", ""); // Kullanıcı Article/Index ile article sayfasına giderse aşağıdaki kodumuz çalışmayacaktır. O yüzden url içerisinde Index var ise onu "" ile replace ediyoruz.
                    window.open(`${url}/Add`,"_self");  //Url'adresimize Add eklediğimizde controllerdaki Add metoduna yönlendiriliyoruz. "_self" ise aynı sayfa içerisinde aç anlamına geliyor.
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
                        url: '/Admin/Article/GetAllArticles/', //Get işlemi yapacağımız URL adresini veriyoruz.
                        contentType: "application/json",    // Ajax işlemini yaptığımızda hangi tipte işlem yapacağımızı belirtiyoruz. Burada json tipini verdik.
                        beforeSend: function () {       //Ajax işlemini yapmadan önce çalışacak olan actionınımız.
                            $('#articlesTable').hide();   // tablomuzun gizlenmesi
                            $('.spinner-border').show();    // sayfanın yenilendiğini göstermek için spinnerin görünmesi
                        },
                        success: function (data) { //Ajax get işlemi başarılı olarak gerçekleşirse
                            //console.log(data);
                            const articleResult = jQuery.parseJSON(data); // controllerdan articleResult Json formatında dönüyor
                            console.log(articleResult);

                            dataTable.clear(); // Önce dataTable içerisindeki herşeyi temizliyoruz.

                            if (articleResult.Data.ResultStatus === 0) {   // controllerdan dönen userListDto datamızın içerisinde yer alan ResultStatus değerimizi kontrol ediyoruz.

                                let categoriesArray = []; // Kategori dizisi

                                $.each(articleResult.Data.Articles.$values, function (index, article) { // Jquery each metodunda parametre olarak önce hangi değerleriçerisinde dönecekse onu veriyoruz, sonrasinda ise her bir değer üzerinde gerçekleştireceği işlemleri fonksiyon olarak yazıyoruz.
                                    // userListDto datamızın içerisindeki Categories'in içerisindeki değerlerin valuelarını alıyoruz.
                                    const newArticle = getJsonNetObject(article, articleResult.Data.Articles.$values);
                                    console.log(newArticle);

                                    let newCategory = getJsonNetObject(newArticle.Category, newArticle);    // newArticle üzerinden newCategory'i aldık.
                                    console.log(newCategory);

                                    if (newCategory !== null) {
                                        categoriesArray.push(newCategory);  // newCategory boş değilse array'e ekledik.
                                    }
                                    if (newCategory === null) { //newCategory boş ise, categoriesArray içerisinden listeye eklenmekte olan newArticle'ın Category alanındaki ref değeri categoriesArray içerisindeki categorinin id'sine eşit olanı çektik.
                                        newCategory = categoriesArray.find((cat) => {
                                            return cat.$id === newArticle.Category.$ref;
                                        });
                                    }
                                    console.log(newCategory);

                                    const newTableRow = dataTable.row.add([
                                        newArticle.Id,
                                        // newArticle.Category.Name,
                                        newCategory.Name,
                                        newArticle.Title,
                                        `<img src="/img/postImages/${newArticle.Thumbnail}" class="my-image-table" alt="${newArticle.Title}" />`,
                                        `${convertToShortDate(newArticle.Date)}`,
                                        newArticle.ViewCount,
                                        newArticle.CommentCount,
                                        `${newArticle.IsActive ? "Evet" : "Hayır" }`,
                                        `${newArticle.IsDeleted ? "Evet" : "Hayır"}`,
                                        `${convertToShortDate(newArticle.CreatedDate)}`,
                                        newArticle.CreatedByName,
                                        `${convertToShortDate(newArticle.ModifiedDate)}`,
                                        newArticle.ModifiedByName,
                                        `
                                         <button class="btn btn-warning btn-sm btn-update" data-id="${newArticle.Id}"><span class="fas fa-edit"></span></button>
                                         <button class="btn btn-danger btn-sm btn-delete" data-id="${newArticle.Id}"><span class="fas fa-minus-circle"></span></button>
                                         `
                                    ]).node(); // newTableRow = o an eklenmiş olan row'umuz oluyor.

                                    const jqueryTableRow = $(newTableRow);
                                    jqueryTableRow.attr('name', `${newArticle.Id}`); //tableRow'a name attribute'u ve id değerini ekledik.

                                });
                                dataTable.draw();

                                $('.spinner-border').hide(); //spinner'ı gizliyoruz.
                                $('#articlesTable').fadeIn(1400); //tablomuzun fade efekti ile tekrar görünmesini sağlıyoruz.
                            } else {    //ResultStatus 1 yani false dönerse
                                toastr.error(`${articleResult.Data.Message}`, 'işlem Başarısız!'); //toastr.error ile controllerdan döndürüğümüz hata mesajını bastırır
                            }
                        },
                        error: function (err) { //AJax get işlemimizde hata oluşursa
                            console.log(err);   //hatayı console yazdır.
                            $('.spinner-border').hide(); //Hata aldığımızda spinnerin sonsuza kadar dönmemesi için spinner'ı gizliyoruz.
                            $('#articlesTable').fadeIn(1000); //Ve tekrardan tablomuzun fade efekti ile görünmesini sağlıyoruz.
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


    // Delete
    // Ajax POST / Deleting an Article starts from here. 
    $(document).on('click', '.btn-delete', function (event) {
        event.preventDefault(); //eğer buton submit butonu olsaydı sayfa tekrar yüklenirdi o yüzden önlem amaçlı event.preventDefault yazıyoruz.
        const id = $(this).attr('data-id');
        const tableRow = $(`[name="${id}"]`); // Silme işleminin yapılacağı row seçiliyor.Silme mesajından sonra silinen veriye ait row'un tablodan kaybolması için ve bu rowun özelliklerinden yararlanmak için rowu bir değişkene atıyoruz.
        const articleTitle = tableRow.find('td:eq(2)').text(); // TableRowa ait olan 2. kolondaki table datayı seçiyoruz.
        // SweetAlert kodlarımız kaynak: https://sweetalert2.github.io/
        Swal.fire({
            title: `${articleTitle} başlıklı makaleyi silmek istediğinize emin misiniz?`,
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
                    data: { articleId: id }, // Buradaki articleId bizim ilgili actionımızın bizden beklediği isim, id değeri de delete işlemlerin başında name attribute'undan aldığımız değer. Veri controllera nereden gelecek? action kısmınde ne bekliyorsak onu bir javascript objesi olarak göndereceğiz. Controller içerisindeki Delete actionumuza parametre olarak controllerId göndermemiz gerekiyor.
                    url: '/Admin/Article/Delete/',   // veriyi göndereceğimiz url(action adresi)
                    // actionlar
                    // success actionu
                    success: function (data) { // controllerdaki actionumuzdan Json formatında bir IResult tipinde bir data döner, bunu fonksiyonumuza parametre olarak veriyoruz.
                        const articleResult = jQuery.parseJSON(data); // gelen datayı Json'a parse edip modele dönüştürüyor.
                        console.log(articleResult);

                        if (articleResult.ResultStatus === 0) {    // dönen verimizde ResultStatus'umuz 0 yani başarılı ise Swal.fire ile silindi mesajı gösterilir.
                            Swal.fire(
                                'Silindi!',
                                `${articleResult.Message}`,
                                'success'
                            );
                            //tableRow.fadeOut(3500); // Ardından rowumuzun tablodan fadeOut efektiyle yok olmasını sağlarız. -- DataTable Api uygulamadan önce

                            dataTable.row(tableRow).remove().draw(); // sil butonuna basıldıktan sonra hangi row'un butonu olduğunu yukarıda tableRow isimli değişkenimizle çekmiştik. Burada row(tableRow) diyerek, row'un içerisine vermiş olduğumuz tableRow isimli rowun üzerinde işlem yapacağımızı belirtiyoruz. Yani burada silinmesi gereken row parametre olarak verdiğimiz tableRow'dur.

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Bir hata oluştu...',
                                text: `${articleResult.Message}`,
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
    // Ajax POST / Deleting an Article ends here. 
});