var demo = {

  init : function(){
    var query = window.location.search.substring(1);
    var splitQuery = query.split('&');
    var params = {};
    for (var i = 0; i < splitQuery.length; i ++)
    {
      var tempQuery = splitQuery[i].split('=');
      params[tempQuery[0]] = tempQuery[1];
    }
    this._searchForUserPostings(users[(params.id || 0)]);
  },
  _searchForUserPostings : function(user){
    user.searchAreas.forEach(function(area){
      var startLoc = ''
      if (user.relocate){
        startLoc = area.city + ', ' + area.state;
      } else {
        startLoc = user.loc;
      }
      Request.Post("/api/search", {
        'loc': startLoc,
        'city': area.city,
        'state': area.state,
        'keywords': user.keywords
      })
      .then(function(postings){
        post._generatePostingRows(postings);
      })
    })
  },


}

$(document).ready(function() {
  demo.init();
});
