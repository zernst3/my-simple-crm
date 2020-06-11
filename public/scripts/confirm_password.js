function confirmPassword(e){    
    if (document.getElementById("password").value != document.getElementById("confirm_password").value){
        e.preventDefault();
        alert("Passwords Do Not Match");
        return false;
    }
    return true;
}