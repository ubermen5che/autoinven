(function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {
        var engishDigit = /^[a-zA-Z0-9]+$/;    //영어 대소문자 및 숫자 받는 정규식
        var pwCheck = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/; // 비밀번호 정규식 (최소8자리 영문 대소문자 및 숫자, 특수문자 허용)
        //send sign up data to server
        $("#loginFormBtn").off("click").on("click", function () {
            var id = $("#memberID").val();
            var pw = $("#password").val();

            //check id is not null
            if (!id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your Id'
                })
            }
            //check id overlap
            else if (!pw) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check PW'
                })
            }
            else if (((engishDigit.test(id)) || (pwCheck.test(pw))) == false)
            {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check ID, PW'
                })
            }
            //finish all test
            else {
                var formData = $("#form1").serialize();

                console.log('serializedForm :' + formData);
                $.ajax({
                    url: '/User/Login',
                    type: 'POST',
                    data: formData,
                    success: function (data) {
                        console.log(data);
                        if (data == "loginError01") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Fail',
                                text:  'The ID does not exist.',
                            }).then(() => {
                            })
                        } else if (data == "loginError02") {
                            Swal.fire({
                                icon: 'error',
                                title: 'fail',
                                text:  'Wrong password',
                            }).then(() => {
                            })
                        } else if (data == "loginSuccess") {
                            window.location.href="/";
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title : 'fail',
                                text: '알수없는 오류가 발생하였습니다',
                            }).then(() => {
                            }
                            )}
                    },
                    error: function (request, status, error) {
                        alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                    }
                })
            }
        })
    })
})(jQuery);
