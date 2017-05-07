var post = {
  init: function () {
    this._setEventHandlers.call(this);
  },
  // <<< Elements >>>
  // ***----------***
  _searchBtn: $("#search-btn"),
  _searchInp: $("#search-input"),
  _postContainer: $("#posting-container"),
  _postLoader: $("#posting-loader"),
  _modal: $('#myModal'),
  _modalContent: $('#modalBody'),

  // ***----------***

  // <<< EVENTS >>>
  // ***----------***
  _setEventHandlers: function () {
    this._searchBtn.on('click', this._searchForPostings.bind(this));
    //$(document).on("click", $(".applyBtn"), this.TransformToCheck);
  },
  // ***----------***

  _searchForPostings: function (e) {
    e.preventDefault();
    this._showLoader(true);
    this._postContainer.empty();
    var content = this._searchInp.val();

    Request.Post("/api/search", {"keywords": content})
     .then(function (postings){
       this._showLoader(false);
       this._generatePostingRows(postings);
     }.bind(this))
  },

  _generatePostingRows: function (arr) {
    getDefaultResume().then(function(resume){
      arr.forEach(function (post, ind) {
        var skillNumber = Math.round(Math.random() * 100);
        this._createPostingRow(post, ind, skillNumber);
        this._modalContent.html(post.skills.toString());
      }, this);
    }.bind(this));
  },

  _showLoader: function (show) {
    if (show) { return this._postLoader.removeClass("hide") }
    return this._postLoader.addClass("hide")
  },

  _skillAlert: function (evt, skills) {
    window.alert(evt.data.param1) 
  },

  _createPostingRow: function (post, n, skillNumber) {
    //console.log("post",post);
    var bikeTime;
    var carTime;
    var $staticmap;
    //var skillNumber = Math.round(Math.random() * 100);
    var skillColor = skillNumber > 70 ? "text-success" : "text-danger";
    var mapBaseUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=300x300&zoom=15&maptype=roadmap&key=AIzaSyBl9dkTrB28BcxG4ArsEdA_1yx7ZrquqIQ&center='
    var description = post.summary.substr(0, 144) + "...";
    var commuteSeverity = (post.commute > 25 ? "text-danger" : "text-success");

    if (post.transit.startLatlon && post.transit.startLatlon.lat &&
        post.transit.bicycling && post.transit.driving
      ) {
      bikeTime = post.transit.bicycling.duration.text;
      carTime = post.transit.driving.duration.text;
      $staticmap = $("<img>", {
        "src": mapBaseUrl + post.transit.endLatlon.lat + ',' + post.transit.endLatlon.lng + '&markers=color:blue%7C' + post.transit.endLatlon.lat + ',' + post.transit.endLatlon.lng, "style": "margin-bottom:6px; width:160px;"});
    } 

    var $row = $("<div>", {id: "posting-row-" + String(n), "class": "card"});
    var $cb = $("<div>", {"class": "card-block"});
    var $title = $("<h3>", {"text": post.jobtitle, "class": "card-header"});
    var $date = $("<h4>", {"text": post.formattedRelativeTime, "class": "posting-date"});
    var $company = $("<h4>", {"text": post.company, "class": "card-title"});
    var $location = $("<p>", {"text": post.formattedLocationFull, "class": "card-text"});
    var $description = $("<p>", {"text": description, "class": "card-text"});
    var $biking = $("<p>", {"text": "Biking: " + bikeTime, "class": "card-text"});
    var $driving = $("<p>", {"text": "Driving: " + carTime, "class": "card-text"});
    var $review = $("<p>", {
      "class": "card-text",
      "html": "<strong>Glassdoor Rating</strong>: " + String(post.review.overallRating) + " based off of " + String(post.review.numberOfRatings) + " ratings."
    });
    $review.click({"param1": JSON.stringify(post.review)}, this._skillAlert);
    var $skill = $("<p>", {"text": String(skillNumber) + "%", "class": "skills-number card-text " + skillColor});
    $skill.click({"param1":post.skills.toString()}, this._skillAlert);

    // -- less than 100 green, more make it red, Purchansing Power
    if (post.rpp && post.rpp.dest) {
      var thePrice = post.rpp.dest["RPPs: All items"]
      var priceColor = thePrice > 100 ? "text-danger" : "text-success"; 
      var $price = $("<p>", {"text": "Purchasing Power: " + String(thePrice), "class": "card-text " + priceColor});
      $price.click({"param1": JSON.stringify(post.rpp)}, this._skillAlert);
    }

    var $apply = $("<a>", {"text": "Apply", "class": "btn btn-primary apply-btn"});
    $apply.click({"param1": "thing"}, this._transformToCheck);

    $row.append($cb)
      $cb.append($title)
      $cb.append($date)
      $cb.append($skill);
      $cb.append($company)
      $cb.append($description)
      if (post.rpp && post.rpp.dest) {
        $cb.append($price);
      }
      if (post.review.numberOfRatings && post.review.numberOfRatings > 0) { $cb.append($review); }
      if (post.transit.startLatlon && post.transit.startLatlon.lat) {
        $cb.append($staticmap)
        $cb.append($biking)
        $cb.append($driving)
      }
      $cb.append($apply)

    this._postContainer.append($row);
  },

  _getSampleSkills: function () {
    return {"javascript":1, "node.js":1, "html":1, "css":1, "security":1, "design":1, "php":1, "security":1, "developer":1, "angular":1, "bootstrap":1, "java":1, "ajax":1, "github":1, "photoshop":1, "dreamweaver":1, "web":1};
  },

  _generateSkillsResult: function(postText, resumeText, ind) {
    Request.getKeywords(postText, resumeText, ind).then(function(result) {
      console.log(result)
    });
  },

  _transformToCheck: function (e) {
    e.preventDefault();
    e.target.innerHTML = "<span class='fa fa-check'></span>";
  }
}

$(document).ready(function() {
  post.init();
});

function getDefaultResume() {
  return Request.Get("/js/resume.txt");
}
