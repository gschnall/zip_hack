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
        this._createPostingRow(post, ind);
      }, this);
    }.bind(this));
  },

  _showLoader: function (show) {
    if (show) { return this._postLoader.removeClass("hide") } 
    return this._postLoader.addClass("hide")
  },

  _createPostingRow: function (post, n) {
    var description = post.summary.substr(0, 144) + "...";
    var commuteSeverity = (post.commute > 25 ? "text-danger" : "text-success");

    var $row = $("<div>", {id: "posting-row-" + String(n), "class": "card"});
    var $cb = $("<div>", {"class": "card-block"});
    var $title = $("<h3>", {"text": post.jobtitle, "class": "card-header"});
    var $date = $("<h4>", {"text": post.formattedRelativeTime, "class": "posting-date"});
    var $company = $("<h4>", {"text": post.company, "class": "card-title"});
    var $location = $("<p>", {"text": post.formattedLocationFull, "class": "card-text"});
    var $description = $("<p>", {"text": description, "class": "card-text"});
    var $commuteNumb = $("<span>", {"text": post.commute + " miles", "class": "card-text " + commuteSeverity});
    var $commute = $("<p>", {"text": "Commute: ", "class": "card-text"}).append($commuteNumb);
    var $review = $("<p>", {
      "class": "card-text",
      "html": "<strong>Glassdoor Rating</strong>: " + String(post.review.overallRating) + " based off of " + String(post.review.numberOfRatings) + " ratings."
    });
    var $apply = $("<a>", {"text": "Apply", "class": "btn btn-primary apply-btn"});

    $row.append($cb)
      $cb.append($title)
      $cb.append($date)
      $cb.append($company)
      $cb.append($description)
      if (post.review.numberOfRatings && post.review.numberOfRatings > 0) { $cb.append($review); }
      $cb.append($commute)
      $cb.append($apply)

    this._postContainer.append($row);
  },

  _getSampleSkills: function () {
    return ["JavaScript", "Node.js", "HTML", "CSS"]; 
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
