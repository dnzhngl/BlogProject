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
                        url: '/Admin/User/GetAllUsers/', //Get işlemi yapacağımız URL adresini veriyoruz.
                        contentType: "application/json",    // Ajax işlemini yaptığımızda hangi tipte işlem yapacağımızı belirtiyoruz. Burada json tipini verdik.
                        beforeSend: function () {       //Ajax işlemini yapmadan önce çalışacak olan actionınımız.
                            $('#usersTable').hide();   // tablomuzun gizlenmesi
                            $('.spinner-border').show();    // sayfanın yenilendiğini göstermek için spinnerin görünmesi
                        },
                        success: function (data) { //Ajax get işlemi başarılı olarak gerçekleşirse
                            //console.log(data);
                            const userListDto = jQuery.parseJSON(data); // controllerdan userListDto Json formatında dönüyor
                            console.log(userListDto);

                            dataTable.clear(); // Önce dataTable içerisindeki herşeyi temizliyoruz.

                            if (userListDto.ResultStatus === 0) {   // controllerdan dönen userListDto datamızın içerisinde yer alan ResultStatus değerimizi kontrol ediyoruz.

                                $.each(userListDto.Users.$values, function (index, user) { // Jquery each metodunda parametre olarak önce hangi değerleriçerisinde dönecekse onu veriyoruz, sonrasinda ise her bir değer üzerinde gerçekleştireceği işlemleri fonksiyon olarak yazıyoruz.
                                    // userListDto datamızın içerisindeki Categories'in içerisindeki değerlerin valuelarını alıyoruz.

                                    const newTableRow = dataTable.row.add([
                                        user.Id,
                                        user.UserName,
                                        user.Email,
                                        user.PhoneNumber,
                                        `<img src="/img/userImg/${user.Picture}" class="my-image-table" alt="${user.UserName}" />`,
                                        `
                                         <button class="btn btn-warning btn-sm btn-update" data-id="${user.Id}"><span class="fas fa-edit"></span></button>
                                         <button class="btn btn-danger btn-sm btn-delete" data-id="${user.Id}"><span class="fas fa-minus-circle"></span></button>
                                         `
                                    ]).node(); // newTableRow = o an eklenmiş olan row'umuz oluyor.

                                    const jqueryTableRow = $(newTableRow);
                                    jqueryTableRow.attr('name', `${user.Id}`); //tableRow'a name attribute'u ve id değerini ekledik.

                                });
                                dataTable.draw();

                                $('.spinner-border').hide(); //spinner'ı gizliyoruz.
                                $('#usersTable').fadeIn(1400); //tablomuzun fade efekti ile tekrar görünmesini sağlıyoruz.
                            } else {    //ResultStatus 1 yani false dönerse
                                toastr.error(`${userListDto.Message}`, 'işlem Başarısız!'); //toastr.error ile controllerdan döndürüğümüz hata mesajını bastırır
                            }
                        },
                        error: function (err) { //AJax get işlemimizde hata oluşursa
                            console.log(err);   //hatayı console yazdır.
                            $('.spinner-border').hide(); //Hata aldığımızda spinnerin sonsuza kadar dönmemesi için spinner'ı gizliyoruz.
                            $('#usersTable').fadeIn(1000); //Ve tekrardan tablomuzun fade efekti ile görünmesini sağlıyoruz.
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
    // Ajax POST / Deleting a User starts from here. 
    $(document).on('click', '.btn-delete', function (event) {
        event.preventDefault(); //eğer buton submit butonu olsaydı sayfa tekrar yüklenirdi o yüzden önlem amaçlı event.preventDefault yazıyoruz.
        const id = $(this).attr('data-id');
        const tableRow = $(`[name="${id}"]`); // Silme işleminin yapılacağı row seçiliyor.Silme mesajından sonra silinen veriye ait row'un tablodan kaybolması için ve bu rowun özelliklerinden yararlanmak için rowu bir değişkene atıyoruz.
        const userName = tableRow.find('td:eq(1)').text(); // TableRowa ait olan 2. kolondaki table datayı seçiyoruz.
        // SweetAlert kodlarımız kaynak: https://sweetalert2.github.io/
        Swal.fire({
            title: `${userName} adlı kullanıcıyı silmek istediğinize emin misiniz?`,
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
                    data: { userId: id }, // veri controllera nereden gelecek? action kısmınde ne bekliyorsak onu bir javascript objesi olarak göndereceğiz. Controller içerisindeki Delete actionumuza parametre olarak controllerId göndermemiz gerekiyor.
                    url: '/Admin/User/Delete/',   // veriyi göndereceğimiz url(action adresi)
                    // actionlar
                    // success actionu
                    success: function (data) { // controllerdaki actionumuzdan Json formatında bir IResult tipinde bir data döner, bunu fonksiyonumuza parametre olarak veriyoruz.
                        const userDto = jQuery.parseJSON(data); // gelen datayı Json'a parse edip modele dönüştürüyor.
                        console.log(userDto);
                        if (userDto.ResultStatus === 0) {    // dönen verimizde ReultStatus'umuz 0 yani başarılı ise Swal.fire ile silindi mesajı gösterilir.
                            Swal.fire(
                                'Silindi!',
                                `${userDto.User.UserName} adlı kullanıcı başarıyla silinmiştir.`,
                                'success'
                            );
                            //tableRow.fadeOut(3500); // Ardından rowumuzun tablodan fadeOut efektiyle yok olmasını sağlarız. -- DataTable Api uygulamadan önce

                            dataTable.row(tableRow).remove().draw(); // sil butonuna basıldıktan sonra hangi row'un butonu olduğunu yukarıda tableRow isimli değişkenimizle çekmiştik. Burada row(tableRow) diyerek, row'un içerisine vermiş olduğumuz tableRow isimli rowun üzerinde işlem yapacağımızı belirtiyoruz. Yani burada silinmesi gereken row parametre olarak verdiğimiz tableRow'dur.

                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Bir hata oluştu...',
                                text: `${userDto.Message}`,
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
    // Ajax POST / Deleting a User ends here. 
});