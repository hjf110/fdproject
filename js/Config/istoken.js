
$(function () {
    var token = sessionStorage.getItem('token');
    if (token == null || token == "") {
        window.location.href = "error_qx.html";
    }
});