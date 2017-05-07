var Requests = {
  data: function (url, data) {
    $.ajax({
       "url": url,
       "type": "POST",
       "data": data,
       "success": function(data, status) {
         return ({"success": true, "status": status, "data": data:});
       },
       "error": function(xhr, desc, err) {
         console.log(xhr);
         console.log("Details: " + desc + "\nError:" + err);
         return ({"success": false, "err": err, "desription": desc});
       }
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

  function getKeywords (resumeText, postText) {
    $.ajax({
       url: "http://resumemarksman.com/controllers/ajax/get_skill_keywords.php",
       type: "post",
       data: {
        "action": "getSkillKeywordsPost",
        "postText": postText,
        "resumeText": resumeText,
       },
       success: function(data, status) {
         if (data) {
           return ({
             "success": true,
             "resumeCloudText": data.resumeCloudText, 
             "postCloudText": data.cloudText, 
             "result": data.result,
             "keywords": data.keyWords
           }); 
         }
       },
       error: function(xhr, desc, err) {
         console.log(xhr);
         console.log("Details: " + desc + "\nError:" + err);
         return ({"success": false, "err": err, "desription": desc});
       }
     }); // end ajax call
  }

  // END Analysis Object ------------
}


Analysis.init();
