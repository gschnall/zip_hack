var user_list = {
  init: function () {
    this._generateUserRows(users);
  },
  // <<< Elements >>>
  // ***----------***
  _postContainer: $("#posting-container"),
  // ***----------***

  // <<< EVENTS >>>
  // ***----------***
  _setEventHandlers: function () {

  },

  _generateUserRows: function (arr) {
      arr.forEach(function (user, ind) {
        this._createUserRow(user, ind);
      }, this);
  },

  _createUserRow: function (user, n) {

    var $row = $("<div>", {id: "posting-row-" + String(n), "class": "card"});
    var $cb = $("<div>", {"class": "card-block"});
    var $name = $("<h3>", {"text": user.name, "class": "card-header"});
    $name.click(function(){
      window.location.href = "/user_demo?id=" + n;
    });
    var $currentLocation = $("<h4>", {"text": user.loc, "class": "posting-date"});
    var $keywords = $("<h4>", {"text": user.keywords, "class": "card-title"});
    var $sortPref = $("<p>", {"text": user.sortPref, "class": "card-text"});
    var $relocate = $("<p>", {"text": 'Relocate: ' + user.relocate, "class": "card-text"});
    var searchAreas = [];
    user.searchAreas.forEach(function(area){
      searchAreas.push($("<p>", {"text": area.city + ", " +area.state, "class": "card-text"}))
    });

    $row.append($cb)
      $cb.append($name)
      $cb.append($currentLocation)
      $cb.append($keywords)
      $cb.append($sortPref)
      $cb.append($relocate)
    searchAreas.forEach(function(area){
      $cb.append(area);
    })


    this._postContainer.append($row);
  },

}

$(document).ready(function() {
  user_list.init();
});

function getDefaultResume() {
  return Request.Get("/js/resume.txt");
}
