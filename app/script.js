// Authentication
function logout() {
  ref.unauth();
  var newUrl = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname;
  window.location.replace(newUrl);
}

// Get the auth Name
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}



// Helpers
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function createValidation(methodName,regex,message) {
  $.validator.addMethod(methodName,
    function(value,element) {
      return this.optional(element) || regex.test(value);
    },
    message
  );
}

function preparePasswordValidation() {
  createValidation("passwordHasNumber",/\d/,"Passwords should have a number.");
  createValidation("passwordHasUppercase",/[A-Z]/,"Passwords should have uppercase.");
  createValidation("passwordHasSpecialCharacters",/[^a-zA-Z\d]/,"Passwords should have special characters such as exclamation points (!), question marks (?), hashtags (#), periods(.), commas(,), or slash(/).");
}

function createCompleteEmailValidation() {
  var completeEmailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  createValidation("completeEmail",completeEmailRegex,"Passwords should have special characters such as exclamation points (!), question marks (?), hashtags (#), periods(.), commas(,), or slash(/).");
}

function createErrorMessage(type,message,errorList,code) {
  var html= "";
  html+= "<div class='error ";
  html+= (type=="success") ? "success" : "alert";
  html+= " errorContainer callout'>";
  html+= (type=="success") ? "<h5><i class='fi-checkbox'></i> Cool!</h5>" : "<h5><i class='fi-alert'></i> Oops!</h5>";
  html+= "<p>"+ message +"</p>"
  html+= "</div>";
  return html;
}

function displayErrorMessage(html) {
  $("#errorMessage").html(html);
}

function resetPassword(ref,emailAddress) {
  ref.resetPassword({
    email: emailAddress
  },function(error) {
    var errorMessage = "";
    if (error) {
      switch (error.code) {
        case "INVALID_USER":
          errorMessage = createErrorMessage("error","The specified user account does not exist.");
          break;
        default:
          errorMessage = createErrorMessage("error","Error resetting password:" + error + ".");
      }
    } else {
      var message = "Password reset and email sent successfully! ";
      message+= "Check email for the password and <a href='/sign-in.html'>sign in</a>.";
      errorMessage = createErrorMessage("success",message);
    }
    displayErrorMessage(errorMessage);
  });
}

function changePassword(ref,emailAddress,oldPassword,newPassword) {
  ref.changePassword({
    email: emailAddress,
    oldPassword: oldPassword,
    newPassword: newPassword
  }, function(error) {
    var errorMessage = "";
    if (error) {
      switch (error.code) {
        case "INVALID_PASSWORD":
          errorMessage = createErrorMessage("error","The specified user account password is incorrect.")
          break;
        case "INVALID_USER":
          errorMessage = createErrorMessage("error","The specified user account does not exist.")
          break;
        default:
          errorMessage = createErrorMessage("error","Error changing password:"+error)
      }
    } else {
      errorMessage = createErrorMessage("success","User password changed successfully!");
    }
    displayErrorMessage(errorMessage);
  });
}


$(document).foundation();
