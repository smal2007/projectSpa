var APPLICATION_ID = '8C75EE00-12BF-1292-FF8F-EBEDE65D5500',
    SECRET_KEY = '374E32DA-C724-2D39-FF18-3F39D8DD4300',
    VERSION = 'v1'; //default application version;

Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);

var userToken;
var login = document.getElementById("LoginReg");
var password = document.getElementById("PasswordReg");

var loginForm = document.getElementById("LoginLogin");
var passwordForm = document.getElementById("PasswordLogin");

var setCurrentUser = document.getElementById("currentUser1");
var textSend = document.getElementById("TextSend");
var emailSend = document.getElementById("EmailSend");
//Регистрация---------------------
document.getElementById("RegistrationBtn").addEventListener("click", function() {
    registration(login, password);
});

function registration(login, pass) {
    var user = new Backendless.User();
    user.email = login.value;
    user.password = pass.value;

    Backendless.UserService.register(user);
};

//Отправка сообщения------------------------
document.getElementById("SendBtn").addEventListener("click", function() {
    sendMessage(document.getElementById("EmailSend"), document.getElementById("TextSend"));
});

function sendMessage(email, mess) {
    var dataStore = Backendless.Persistence.of(TestTable);
    var commentObject = new TestTable({
        message: textSend.value,
        email: emailSend.value || Backendless.UserService.getCurrentUser().email
    })
    dataStore.save(commentObject);
}

function TestTable(args) {
    args = args || {};
    this.message = args.message || "";
    this.email = args.email || "";

}

//Получение текущего пользователя----------------
document.getElementById("getCurrentUser").addEventListener("click", function() {
    checkUser();
});
//Логин-----------------------------------------
function Login(login, password) {
    Backendless.UserService.login(login, password, true, new Backendless.Async(userLoggedIn, gotError));
    userToken = Backendless.UserService.loggedInUser();
}

document.getElementById("LoginBtn").addEventListener("click", function() {
    Login(loginForm.value, passwordForm.value);
});


function userLoggedIn(user) {
    console.log("user has logged in");
    checkUser();
}

function gotError(err) {
    console.log("error message - " + err.message);
    console.log("error code - " + err.statusCode);
}

//Логаут-------------------
function logoutUser() {
    Backendless.UserService.logout(new Backendless.Async(userLoggedout, gotError));
}


function userLoggedout() {
    console.log("user has been logged out");
    checkUser();
}

document.getElementById("LogOutBtn").addEventListener("click", function() {
    logoutUser();
});



document.addEventListener("DOMContentLoaded", function() {

    checkUser();


    var userObjectId = Backendless.LocalCache.get("current-user-id");

    // get user-token of the logged-in user:
    var userToken = Backendless.LocalCache.get("user-token");

    // get current user object:
    var userObject = Backendless.UserService.getCurrentUser();

    console.log(userObjectId);
    console.log(userToken);
    console.log(userObject);

});

function checkUser() {
    var curUser = "Выполните вход";
    if (Backendless.UserService.getCurrentUser() != null) {
        curUser = Backendless.UserService.getCurrentUser().email;
    }
    setCurrentUser.innerHTML = curUser;
}
