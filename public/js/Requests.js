var Request = {
  Post: function (url, data) {
    return $.ajax({
       "url": url,
       "type": "POST",
       "data": data
    }); // end ajax call
  },
  Get: function (url, data) {
    return $.ajax({
       "url": url,
       "type": "Get",
       "data": data
    }); // end ajax call
  },
  getPosts: function (val, keywordArr) {
    return $.ajax({
       "url": url,
       "type": "Get",
       "data": data
    }); // end ajax call
  },

  convertDocumentToText: function (form_data) {
    $.ajax({
       url: "controllers/ajax/convert_documentToText.php",
       dataType: 'json', // what to expect back from the PHP script
       cache: false,
       contentType: false,
       processData: false,
       data: form_data,
       type: 'post',
       success: function(data, status) {
         if (!data.success && data.message)  {
           Analysis._activateAlertModal(data.message);
         } else if (data.success) {
           Analysis._resumeTextArea.html(data.text);
           Analysis._resumeTextArea.val(Analysis._resumeTextArea.html());
           Analysis._validateResumeTextBox();
         }
       },
       error: function(xhr, desc, err) {
         console.log(xhr);
         console.log("Details: " + desc + "\nError:" + err);
       }
     }); // end ajax call
  },

  getKeywords: function (resumeText, postText) {
    //postText = postText.substr(0, 100)
    //var url ="http://resumemarksman.com/controllers/ajax/getSkillKeywords.php?resumeText="
    //url += resumeText + "&postText=" + postText
    return $.ajax({
       url:  "http://resumemarksman.com/controllers/ajax/getSkillKeywords.php",
       crossDomain: true,
       type: "post",
       data: {
        "action": "getSkillKeywordsPost",
        "postText": postText,
        "resumeText": resumeText
       }
     })
  },

    //    success: function(data, status) {
    //      if (data) {
    //        return ({
    //          "success": true,
    //          "resumeCloudText": data.resumeCloudText,
    //          "postCloudText": data.cloudText,
    //          "result": data.result,
    //          "keywords": data.keyWords
    //        });
    //      }
    //    },
    //    error: function(xhr, desc, err) {
    //      console.log(xhr);
    //      console.log("Details: " + desc + "\nError:" + err);
    //      return ({"success": false, "err": err, "desription": desc});
    //    }
    //  }); // end ajax call
}
