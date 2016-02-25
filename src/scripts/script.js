var ref = new Firebase("https://pang-events.firebaseio.com");
var eventsRef = ref.child('events');
var authData = ref.getAuth();
var usersRef = ref.child('users');
var userDataRef = ref.child('userData');

// Firebase Authentication
function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}

// Authentication
function logout(ref) {
  ref.unauth();
  // var newUrl = window.location.protocol + "://" + window.location.host + "/" + window.location.pathname;
  var newUrl = "index.html";
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

// Show data in main page.
function getEvents(eventsRef,eventsSnapshot) {
  var events = [];

  eventsSnapshot.forEach(function(data) {
    var eventRef = eventsRef.child(data.key());
    eventRef.on("value",function(eventSnapshot) {
      var e = eventSnapshot.val();
      events.push({
        key: data.key(),
        name: e.eventName,
        type: e.eventType,
        host: e.eventHost,
        description: e.eventDescription,
        address: e.eventAddress,
        city: e.eventAddressCity,
        state: e.eventAddressState,
        zip: e.eventAddressZip,
        start: e.eventStartTime,
        end: e.eventEndTime,
        guests: e.guests,
      });
    });
  });

  return events;
}

function countGuests(guests) {
  var c=0;
  if (guests!==undefined) {
    for (var i=0;i<guests.length;i++) {
      if (guests[i]!==undefined) {
        c++;
      }
    }
  }
  return c;
}


function getEventsHtml(eventList) {
  var eventHtml = "";
  var lastEvent = eventList.length;
  for (var i=0;i<eventList.length;i++) {
    var e = eventList[i];
    var isEnd = (lastEvent==i+1) ? ' end' : '';
    var completeAddress = e.address + ', ' + e.city + ', ' + e.state + ' ' + e.zip;
    var eventStart = getDateFormat(e.start);
    eventHtml+= '<a href="event.html?key='+ e.key +'&action=edit" class="large-4 columns'+ isEnd +'">';
    eventHtml+= '<div class="callout event">';
    eventHtml+= '<h3 class="eventTitle">'+ e.name +'</h3>';
    eventHtml+= '<span class="success label">'+ e.type +'</span> ';
    eventHtml+= ' <span class="badge" title="Attendees">'+countGuests(e.guests)+'</span>';
    eventHtml+= '<div class="eventDescription">';
    eventHtml+= '<p>'+ e.description +'</p>';
    eventHtml+= '</div>';
    eventHtml+= '<span class="label alert eventHost">'+ e.host +'</span>';
    eventHtml+= '<div class="eventLocation">' + completeAddress + '</div>';
    eventHtml+= '<span class="date primary label">'+ eventStart +'</span>';
    eventHtml+= '</div>';
    eventHtml+= '</a>';
  }
  return eventHtml;
}

function getGuestListHtml(guests) {
  var guestListHtml = "";
  if (guests) {
    guestListHtml = "";
    for (var i=0;i<guests.length;i++) {
      if (guests[i]) {
        guestListHtml+= "<li>"+ guests[i] +"</li>";
      }
    }
  } else {
    guestsListHtml = "";
  }
  return guestListHtml;
}

function getGuests() {
  var guests = [];
  var guestList = $("#guest-list li").each(function(index) {
    var guest = $(this).text().trim();
    guests.push(guest);
  });
  return guests;
}

function displayEvents(eventsRef) {
  var eventSearch = (searchText) ? eventsRef.orderByChild("eventName").equalTo(searchText) : eventsRef.orderByChild("eventName");
  // displayEvents(eventSearch);
  eventSearch.on("value",function(eventsSnapshot) {
    // console.log(eventsSnapshot.val());
    var eventTotal = eventsSnapshot.numChildren();
    var events = getEvents(eventsRef,eventsSnapshot);
    var eventsHtml = getEventsHtml(events);
    $("#event-list").html(eventsHtml);

    // Display appropriate event containers
    $(".event-container").hide();

    // Display Events if there is any
    if (eventTotal > 0) {
      $("#event-list").show();
    } else {
      $("#no-events").show();
    }
  });
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
  createValidation("completeEmail",completeEmailRegex,"Email should have top level domains with at least 2 letters (.us, .com, .net, etc. ).");
}

function prepareAddressValidation() {
  createAddressValidation();
  createCityValidation();
  createZipValidation();
}

function createAddressValidation() {
  var addressRegex = /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
  createValidation("address",addressRegex,"Address should follow correct US format.");
}

function createCityValidation() {
  var cityRegex = /^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/;
  createValidation("city",cityRegex,"City should follow correct format.");
}

function createZipValidation() {
  var zipValidation = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
  createValidation("zip",zipValidation,"Zip code should follow correct format.");
}

function createErrorMessage(type,message,errorList,code) {
  var html= "";
  html+= "<div class='error ";
  html+= (type=="success") ? "success" : "alert";
  html+= " errorContainer callout'>";
  html+= (type=="success") ? "<h5><i class='fi-checkbox'></i> Cool!</h5>" : "<h5><i class='fi-alert'></i> Oops!</h5>";
  html+= "<p>"+ message +"</p>";
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
          errorMessage = createErrorMessage("error","The specified user account password is incorrect.");
          break;
        case "INVALID_USER":
          errorMessage = createErrorMessage("error","The specified user account does not exist.");
          break;
        default:
          errorMessage = createErrorMessage("error","Error changing password:"+error);
      }
    } else {
      errorMessage = createErrorMessage("success","User password changed successfully!");
    }
    displayErrorMessage(errorMessage);
  });
}

function getDateFormat(date) {
  var d = new Date(date);
  var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()];
  var hours = (d.getHours()< 10) ? ('0'+ d.getHours()) : d.getHours();
  var minutes = (d.getMinutes()< 10) ? ('0'+ d.getMinutes()) : d.getHours();
  return month + ', ' + d.getDate() + ' ' + d.getFullYear() + ' - ' + hours + ':' + minutes;
}

$(document).foundation();
