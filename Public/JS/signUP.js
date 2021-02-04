(function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {
        var overlapId = false;
        var EffectivenessPw = false;
        var authCode = null;
        var authFlag = false;

        //length>8 //num + upper case + lower case + Special Characters //no blank //no id //no korean
        $("#passwordCheckButton").off("click").on("click", function () {
            var pw = $("#password").val();
            var id = $("#memberID").val();
            var c_p = $("#passwordConfirmation").val();

            var check_attr = {
                pw: pw,
                id: id,
                c_p: c_p,
            }
            $.ajax({
                url: "/User/Register/checkPW",
                type: "post",
                data: check_attr,
                success: function (data) {
                    console.log(data);
                    if (data == "errortype7") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'ID must be filled first',
                        }).then(function(){
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    }
                    if (data === "errortype1") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'Password must be at least 8 characters long and must contain all numbers/case letters/special characters.',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype2") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use same letter 4 times',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype3") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use id in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype4") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use blank in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype5") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use korean in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype6") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You have to insert same password',
                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);

                        })
                    }
                    else if (data === "errortype0") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Effectiveness Check',
                            text: "You can use this password!!",
                        }).then(function () {
                            EffectivenessPw = true;
                            console.log(EffectivenessPw);

                        })

                    }
                },
                error: function () {

                }
            })
        })
        //check overlap user ID
        $("#idCheckButton").off("click").on("click", function () {
            var memberID = $("#memberID").val();
            console.log('idCheckButton is clicked' + memberID);
           if (memberID != "") {
                $.ajax({
                    url: '/User/Register/MemberID',
                    type: 'post',
                    data: {'memberID': memberID},
                    success: function (data) {
                        console.log(data);
                        if (data == true) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Overlap Check',
                                text: "You can use this Id!!",
                            }).then(function () {
                                overlapId = true;
                                console.log(overlapId);
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Fail',
                                text: 'You can not use this Id!!',
                            }).then(function () {
                                overlapId = false;
                                console.log(overlapId);
                            })
                        }
                    }

                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'Please insert your Id',
                })
            }

        })
        $('#sendAuthCode').click(function(){
            var email =  $('#email').val();
            if(email!=''){
                $.ajax({
                url: '/User/Register/EmailIDF',
                type: 'POST',
                data: {'email': email},
                  success: function(rcvData){
                    if(rcvData.result == false) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: "Please try again.",
                        }).then(function () {
                        })
                    }
                    else{
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: "Mail was sended",
                        }).then(function () {
                            authCode = rcvData.authCode;
                        })
                    }
                }
                });
            }
          });
          $('#codeCheck').click(function(){
            var vCode = $("#authCode").val();
            if(email!=''){
                console.log('server sended authCode :' + authCode);
                if(vCode == authCode){
                    authFlag = true;
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'valid AuthCode!!'
                    })
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: 'invalid AuthCode!!'
                    })
                }
            }
          });
        //send sign up data to server
        $("#regFormBtn").off("click").on("click", function () {
            var id = $("#memberID").val();
            var pw = $("#password").val();
            var name = $("#name").val();
            var email = $("#email").val();
            var address = $("#address").val();
            var national =$("#national").val();
            var CN = $("#CN").val();
            var CA = $("#CA").val();
            var CCN = $("#CCN").val();
            var type = $("#type").val();
            //check id is not null
            if (!id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your Id'
                })
            }
            //check id overlap
            else if (overlapId == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check Id'
                })
            }
            else if (!name) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your name'
                })
            }
            //check password is not null
            else if (!pw) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your Password'
                })
            }
            else if (EffectivenessPw == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check Password Effectiveness'
                })
            }                 
            //check email is not null
            else if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your email'
                })
            }
            else if (!address) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your address'
                })
            }
            else if (!national) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your country'
                })
            }
            else if (!CN) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your company name'
                })
            }
            else if (!CA) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your company address'
                })
            }
            else if (!CCN) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your company contact number'
                })
            }
            //finish all test
            else {
                var formData = $("#regForm").serialize();

                console.log('serializedForm :' + formData);
                $.ajax({
                    url: '/User/Register',
                    type: 'POST',
                    data: formData,
                    success: function (data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sign up',
                            text:  'Sign up success',
                        }).then(() => {
                            location.href = "/";
                        })
                    },
                    error: function (request, status, error) {
                        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    }
                })
            }
        })
    })
})(jQuery);
