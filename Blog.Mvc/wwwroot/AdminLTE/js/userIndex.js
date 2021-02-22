$(document).ready(function () {

    // DataTable start here 
    const dataTable = $('#usersTable').DataTable({
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
                                        user.FirstName,
                                        user.LastName,
                                        user.PhoneNumber,
                                        user.About.length > 75 ? user.About.substring(0, 75) : user.About,
                                        `<img src="/img/userImg/${user.Picture}" class="my-image-table" alt="${user.UserName}" />`,
                                        `
                                         <button class="btn btn-info btn-sm btn-detail" data-id="${user.Id}"><span class="fas fa-newspaper"></span></button>
                                         <button class="btn btn-warning btn-sm btn-assign" data-id="${user.Id}"><span class="fas fa-user-shield"></span></button>
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

    // Add
    $(function () {

        // Ajax GET / Getting the _UserAddPartial as Modal Form starts from here.
        const url = '/Admin/User/Add/';
        const placeHolderDiv = $('#modalPlaceHolder');

        $('#btnAdd').click(function () {
            $.get(url).done(function (data) {
                placeHolderDiv.html(data);
                placeHolderDiv.find('.modal').modal('show');
            });
        });
        // Ajax GET / Getting the _UserAddPartial as Modal Form ends from here.


        // Ajax POST / Posting the FormData as UserAddDto starts from here. 
        placeHolderDiv.on('click', '#btnSave', function (event) {
            event.preventDefault(); //btnSave butonu submit butonu olsaydı sayfamız otamatik olarak yeniden yüklenecekti ne olur nolmaz onu engellemek için preventDefault kullanılır.
            const form = $('#form-user-add');
            const actionUrl = form.attr('action');  //asp-action="Add" action attribute'u
            // const dataToSend = form.serialize();     // IFormFile gibi dosyaların gitmesi için gönderilecek olan datayı daha farklı kullanmamız gerekiyor.
            const dataToSend = new FormData(form.get(0)); //  form.get(0) , 0. indexteki formun verilerini buraya eklenmesini sağlıyoruz. Bunu kullandığımız için $.post kısmını kullanamayacağız.

            $.ajax({
                url: actionUrl,
                type: 'POST',
                data: dataToSend,
                processData: false,
                contentType: false,
                success: function (data) {    //fonksiyon parametresi olan data, actionUrl'den UserController Add(HttpPost) action'nundan dönen data

                    console.log(data);
                    const userAddAjaxModel = jQuery.parseJSON(data);    //ActionResult'dan dönen dtayı Json formatına çevirip değişkene atadık.
                    console.log(userAddAjaxModel);
                    const newFormBody = $('.modal-body', userAddAjaxModel.UserAddPartial);  //Controllerdan dönen, Json çevirmiş olduğmuz olduğumuz model'in içerisinde bulunan partial view kısmından class'ı modal-body olan kısmı seçip newFormBody değişkenine atıyoruz.
                    placeHolderDiv.find('.modal-body').replaceWith(newFormBody);    // Eski modal-body'i oluşturduğumuz yeni modal-nody ile yani newFormBody ile değiştir.
                    const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';  // newFormBody içerisindeki IsValid inputunun value'değerinin true olup olmadığına bakıyoruz.
                    if (isValid) {  //isValid True ise modal durumumuz doğru demektir ve buradaki bütün post işlemlerimiz gerçekleşmiş demektir.
                        placeHolderDiv.find('.modal').modal('hide');    //placeholder div'i içerisine yerleştirdiğimiz partial view olan momdal'ı sakla. 
                        const newTableRow = dataTable.row.add([ // dayfanın en başında atamış olduğumuz dataTable değişkenine, row.add diyerek eklemek istediğimiz bilgileri array olacak şekilde veriyoruz. Bu aray içerisinde, datatable içerisindeki kolonlarımıza denk gelen veriler var.
                            userAddAjaxModel.UserDto.User.Id,
                            userAddAjaxModel.UserDto.User.UserName,
                            userAddAjaxModel.UserDto.User.Email,
                            userAddAjaxModel.UserDto.User.FirstName,
                            userAddAjaxModel.UserDto.User.LastName,
                            userAddAjaxModel.UserDto.User.PhoneNumber,
                            userAddAjaxModel.UserDto.User.About.length > 75 ? userAddAjaxModel.UserDto.User.About.substring(0, 75) : userAddAjaxModel.UserDto.User.About,
                            `   <img src="/img/userImg/${userAddAjaxModel.UserDto.User.Picture}" class="my-image-table" alt="${userAddAjaxModel.UserDto.User.UserName}" />`,
                            `
                             <button class="btn btn-info btn-sm btn-detail" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas fa-newspaper"></span></button>
                             <button class="btn btn-warning btn-sm btn-assign" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas fa-user-shield"></span></button>
                             <button class="btn btn-warning btn-sm btn-update" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas faedit"><span><button>
                             <button class="btn btn-danger btn-sm btn-delete" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas fa-minus-circle"></span></button>
                            `
                        ]).node(); // buradaki table row'u bir değişkene atayabilmek, table row olarak seçebilmek için node() kullanmamız gerek.
                        // önceden- .draw() işlemi burada girmiş olduğumuz bilgilerin ekranda çizilmesini yani ekrana yazılmasını sağlıyor.

                        const jqueryTableRow = $(newTableRow);
                        jqueryTableRow.attr('name', `${userAddAjaxModel.UserDto.User.Id}`); //tableRow'a name attribute'u ve id değerini ekledik.

                        dataTable.row(newTableRow).draw(); // name attribute'nu ekledikten sonra dataTable api aracılığıyla row'a newTableRow'u girip, draw metodunu çağırıyoruz. Bu sayede oluşturduğumuz row ekrana yazılıyor.

                        // # region Before Jquery ajax implementation - Burada birşey eklenip çıkarmaya çalıştığımızda artık DataTable Api kullanacağız. O yüzden direk kendimizin müdahale ettiği bu kodlara ihtiyacımız yok.
                        //// Eklenen data için yeni row yapısını oluştur.
                        //const newTableRow = `
                        //         <tr name="${userAddAjaxModel.UserDto.User.Id}">
                        //            <td>${userAddAjaxModel.UserDto.User.Id}</td>
                        //            <td>${userAddAjaxModel.UserDto.User.UserName}</td>
                        //            <td>${userAddAjaxModel.UserDto.User.Email}</td>
                        //            <td>${userAddAjaxModel.UserDto.User.PhoneNumber}</td>
                        //            <td>${userAddAjaxModel.UserDto.User.Picture}</td>
                        //            <td>
                        //                <button class="btn btn-warning btn-sm btn-update" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas fa-edit"></span></button>
                        //                <button class="btn btn-danger btn-sm btn-delete" data-id="${userAddAjaxModel.UserDto.User.Id}"><span class="fas fa-minus-circle"></span></button>
                        //            </td>
                        //        </tr>`;
                        //const newTableRowObject = $(newTableRow);   // Table row normalde bir string iken bu işlem ile beraber newTableRow'u bir JQuery yada JAvascript objesi haline getiriyoruz.
                        //newTableRowObject.hide(); // önce hide ile görünmez hale getiriyoruz.(fade efektiyle ekleyebilmek için önce hide'ladık.)
                        //$('#usersTable').append(newTableRow);  // oluşturmuş olduğumuz row yapısını categoriesTable'ının sonuna ekle (append)
                        //newTableRowObject.fadeIn(3000);     // Eklemeyi fade efektiyse yap yani 3 saniyeda yavaşça belirsin.
                        // # endregion

                        toastr.success(`${userAddAjaxModel.UserDto.Message}`, 'Başarılı İşlem!');   // toastr ile de success mesajı göster.
                    } else { // validation false geldiği zaman toastr içerisinde hata mesajlarını gösteren kod
                        let summaryText = "";
                        $('#validation-summary > ul > li').each(function () {   // _UserAddPartial view'inde bulunan validation-summary id'li divimizi seçtik. Validation mesajlarımız liste olarak dönüyor ve bu divimizin içerisinde gösteriliyor. o yüzden ul li diyerek her bir liste elemenını seçtik. ve bunların her biri için fonksiyon çalıştırdık.
                            let text = $(this).text();
                            summaryText = `${text}\n`;
                        });
                        toastr.warning(summaryText); //en son bütün validation mesajlarını tek bir toastr içinde gösterdik.
                    }
                },
                error: function (err) {
                    console.log(err);
                    toastr.error(`${err.responseText}`, 'Hata!');
                }
            });
        });
        // Ajax POST / Posting the FormData as UserAddDto ends here.
    });


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


    // Update
    $(function () {

        // Ajax GET / Getting the _UserUpdatePartial as Modal Form starts from here.
        const url = '/Admin/User/Update/';      //Url adresini verdik.
        const placeHolderDiv = $('#modalPlaceHolder');  //index sayfasındaki modalPlaceHolder idsini verdiğimiz div'in içerisine partialView'imiİ modal olarak yerleştirmek için onu bir değişkene atadık.

        $(document).on('click', '.btn-update', function (event) {   //index sayfasında class'ı btn-update olan bir butona tıklanırsa belirttiğimiz fonksiyon içerisindeki kodlar çalışacak.
            event.preventDefault();
            const id = $(this).attr('data-id'); // tıklanan buton'a attribute olarak girmiş olduğumuz data-id'deki id değerini aldık.
            $.get(url, { userId: id }).done(function (data) {   //ajax get metoduna url'i, ve gönderilecek olan, yani beklenen categoryId parametresini, oluşturduğumuz id değişkenine eşitleyerek gönderir.
                placeHolderDiv.html(data);      // controllerdan dönen data'yı placeholder div içerisine ekledik. (dönen data partial view ve içerisinde model ile birlikte dönüyor.)
                placeHolderDiv.find('.modal').modal('show'); // placeHolderDiv'in içerisinde class'ı modal olan div'i modal'a çevirir ve ekranda gösterir.
            }).fail(function (err) {   // get işlemi hatayla sonuçlanırsa
                toastr.error(`${err.responseText}`, 'Hata!'); //toastr ile hatayı göster.
            });
        });
        // Ajax GET / Getting the _UserUpdatePartial as Modal Form ends here.


        // Ajax POST / Updating the FormData as UserUpdateDto starts from here. 
        placeHolderDiv.on('click', '#btnUpdate', function (event) {
            event.preventDefault();

            const form = $('#form-user-update');
            const actionUrl = form.attr('action');
            const dataToSend = new FormData(form.get(0)); //  form.get(0) , 0. indexteki formun verilerini buraya eklenmesini sağlıyoruz. Bunu kullandığımız için $.post kısmını kullanamayacağız.

            $.ajax({
                url: actionUrl,
                type: 'POST',
                data: dataToSend,
                processData: false,
                contentType: false,
                success: function (data) {
                    const userUpdateAjaxModel = jQuery.parseJSON(data);
                    console.log(userUpdateAjaxModel);

                    let tableRow = "";
                    let id = "";
                    if (userUpdateAjaxModel.UserDto !== null) {
                        id = userUpdateAjaxModel.UserDto.User.Id; //parse edilen data içerisindeki kullanıcı id'sini alıyoruz.
                        tableRow = $(`[name="${id}"]`); // update işlemini yapacağımız row'a ulaşabilmek için name attribute'nu kullanıyoruz.
                    }

                    const newFormBody = $('.modal-body', userUpdateAjaxModel.UserUpdatePartial);
                    placeHolderDiv.find('.modal-body').replaceWith(newFormBody);

                    const isValid = newFormBody.find('[name="IsValid"]').val() === 'True';
                    if (isValid) {
                        placeHolderDiv.find('.modal').modal('hide');

                        dataTable.row(tableRow).data([ // update işlemini yapmak istediğimiz row'u row(tableRow) şeklinde parametre olarak veriyoruz. ve o rowdaki datayı verdiğimiz data ile değiştiriyor.
                            userUpdateAjaxModel.UserDto.User.Id,
                            userUpdateAjaxModel.UserDto.User.UserName,
                            userUpdateAjaxModel.UserDto.User.Email,
                            userUpdateAjaxModel.UserDto.User.FirstName,
                            userUpdateAjaxModel.UserDto.User.LastName,
                            userUpdateAjaxModel.UserDto.User.PhoneNumber,
                            userUpdateAjaxModel.UserDto.User.About.length > 75 ? userUpdateAjaxModel.UserDto.User.About.substring(0, 75) : userUpdateAjaxModel.UserDto.User.About,
                            `   <img src="/img/userImg/${userUpdateAjaxModel.UserDto.User.Picture}" class="my-image-table" alt="${userUpdateAjaxModel.UserDto.User.UserName}" />`,
                            `
                                <button class="btn btn-info btn-sm btn-detail" data-id="${userUpdateAjaxModel.UserDto.User.Id}"><span class="fas fa-newspaper"></span></button>
                                <button class="btn btn-warning btn-sm btn-assign" data-id="${userUpdateAjaxModel.UserDto.User.Id}"><span class="fas fa-user-shield"></span></button>
                                <button class="btn btn-warning btn-sm btn-update" data-id="${userUpdateAjaxModel.UserDto.User.Id}"><span class="fas fa-edit"></span></button>
                                <button class="btn btn-danger btn-sm btn-delete" data-id="${userUpdateAjaxModel.UserDto.User.Id}"><span class="fas fa-minus-circle"></span></button>
                            `
                        ]);
                        tableRow.attr("name", `${id}`); //tableRow'a name attribute'nu ve id değerini ekliyoruz.
                        dataTable.row(tableRow).invalidate(); //invalidate sayesinde vermiş olduğumuz rowun değiştiğini belirtiyoruz. Bu durumda dataTable bu rowdaki verileri kontorl edip değişikliği yapıyor.

                        toastr.success(`${userUpdateAjaxModel.UserDto.Message}`, 'Başarılı İşlem!');
                    } else {
                        let summaryText = "";

                        $('#validation-summary > ul > li').each(function () {
                            let text = $(this).text();
                            summaryText = `* ${text}\n`;
                        });
                        toastr.warning(summaryText);
                    }
                },
                error: function (error) {
                    console.log(error);
                    toastr.error(`${error.responseText}`, 'Hata!');
                }
            });
        });
        // Ajax POST / Updating the FormData as UserUpdateDto ends here. 
    });


    // Get Detail Ajax Operation
    $(function () {

        const url = '/Admin/User/GetDetail/';
        const placeHolderDiv = $('#modalPlaceHolder');
        $(document).on('click',
            '.btn-detail',
            function (event) {
                event.preventDefault();
                const id = $(this).attr('data-id');
                $.get(url, { userId: id }).done(function (data) {
                    placeHolderDiv.html(data);
                    placeHolderDiv.find('.modal').modal('show');
                }).fail(function (err) {
                    toastr.error(`${err.responseText}`, 'Hata!');
                });
            });

    });
});