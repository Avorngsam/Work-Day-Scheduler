var events = [];

// displays current day
$("#currentDay").text(moment().format('MMMM Do YYYY'));

// creates row
var createRow = function (time, event) {

  //console.log(time);

  var row = $("<div>").addClass("row");
  $("#time-container").append(row);

  // creates time block
  var timeBlock = $("<div>").text(time.format("hA")).addClass("time-block hour col-2 col-lg-1");
  row.append(timeBlock);

  var textBox = $("<div>").addClass("textBox col-8 col-lg-10");
  row.append(textBox);

  //if the time is after now thats the future
  if (time.isAfter(moment())) {
    textBox.addClass("future")
  };

  //if time is before now thats the past
  if (time.isBefore(moment())) {
    textBox.addClass("past")
  };

  // if moment() is after TIME AND before TIME with an hour added, then its within the present hour
  if (moment().isAfter(time) && moment().isBefore(time.add(1, 'h'))) {
    textBox.addClass("present")
  };


  var description = $("<p>").text(event).addClass("description");
  textBox.append(description);

  var saveBtn = $("<btn>").addClass("saveBtn col-2 col-lg-1").html("<i class='fas fa-save'></i>").attr("data-hour",time.hour())
  row.append(saveBtn);

}

//save button is clicked
$(".container").on("click", "btn", function () {
 
 saveEvents();
});

// save to local storage
var saveEvents = function () {
  localStorage.setItem("schedule", JSON.stringify(events));
}

//Loading
var loadEvents = function () {
  events = JSON.parse(localStorage.getItem("schedule"));

  // if nothing in localStorage, create a new object to track all events
  if (!events) {
    events = [];
    for(var i = 9; i <= 17; i++)
    {
      var newTime = i;
      var newDescription = "";
      events.push({
        time: newTime,
        description: newDescription})
    }

  }

  for (let i = 0; i < events.length; i++) {
  createRow(moment().hour(events[i].time).minute(0), events[i].description );
  }  
}


// click/add text to textBox
$(".container").on("click", "p", function () {

    // get current text of p element
  var text = $(this)
    .text()
    .trim();

  // replace p element with a new textarea
  var textInput = $("<textarea>").val(text);
  $(this).replaceWith(textInput);

  // auto focus new element
  textInput.trigger("focus");
});

// editable field was un-focused
$(".container").on("blur", "textarea", function() {
  // get current value of textarea
  var text = $(this).val();
 
 // get the event's position in the list of other li elements
  var index = $(this).closest(".row").index();

  //array of events
  events[index].description = text;

  console.log(events);
  
  // recreate p element
  var taskP = $("<p>")
    .addClass("description")
    .text(text);

  // replace textarea with new content
  $(this).replaceWith(taskP);
});

// load event for the first time
loadEvents();
