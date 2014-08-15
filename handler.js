/* 
I always wanted to download Contents from Quora as there were many interesting things which i found only on Quora.
But the traditional copy and paste method have some limitation so i created this extension which allow user to
download Q&A in PDF fromat.
Library used:
* jquery 1.11.1
* jsPDF for generating PDFs




*/ 


var follow_item = $('a[class^="follow_button"]');
var follow_text = follow_item.text();





var hidden_content = document.getElementsByClassName('hidden pager_next');

//Using jsPDF library for PDF generation
var doc = new jsPDF('p', 'mm', [300, 210]);



//Setting Flags to check if images answers are stored first or text answers are stored first
var imageloading = false;
var output_pdf = false;
var answerpages =  0;

var count ;
var imagelength = 20;



var modify = 0;
var question_main = document.getElementsByClassName("inline_editor_value");
if ($(question_main).find('.more_link').length > 0)
    modify = 1;


var specialElementHandlers_main = {
    '#test': function(element, renderer) {
        return true;
    }
};

//Function to Display DOWNLOAD button on a particular Question Page only.

if (follow_item.length > 0 && (follow_text.match("Follow Question.") || follow_text.match("Following Question.")) && window.location.pathname != "/") {
    var main_div = document.getElementsByClassName('ActionBar QuestionActionBar');
    var download_button = document.createElement('a');
    download_button.setAttribute("id", "download");
    download_button.style.color = "blue";
    download_button.href = "#";

    download_button.innerHTML = "Download";


    main_div[0].appendChild(download_button);
    _gaq.push(['_trackEvent', 'download', 'clicked']);
    download_button.addEventListener('click', Download_Answer, false);


}




//Function to initalize the images and call callback function to write images to PDF 
var getImageFromUrl = function(url, imagetext,index,image_tags_length ,clone_temp,callback) {
    var img = new Image();


    img.onError = function() {
        alert('Cannot load image: "' + url + '"');
    };
    img.crossOrigin = '';
    img.onload = function() {

        callback(img, index ,imagetext, image_tags_length , clone_temp);

    };


    img.src = url;
}
//Writing images to PDF format
var createPDF = function(imgData, index,imagetext , image_tags_length , clone_temp) {
 
  
   if (index==0) {
      answerpages = answerpages + 1;

                doc.setFontSize(10);
                doc.text(10, 10, 'Answer ' + answerpages);
                doc.setFontSize(40);
                doc.setTextColor(0, 0, 0);
                imagelength = 20;
   };
    count =  count- 1;

   
     if (imagelength>230 )
        {

            imagelength=20;
            doc.addPage();}

    doc.fromHTML(imagetext, 15, imagelength, {
        'width': 175,
        'elementHandlers': specialElementHandlers_main

        

    });

    var  imagereset = imagetext.length;
 

    
        reset = Math.round(imagereset/240);
    
        for (var i = 0; i <= reset; i++)
            imagelength = imagelength + 5;
        for(var i =0 ; i<=$(imagetext).filter("h2").length;i++)
         imagelength = imagelength+ 2;
     for(var i =0 ; i<=$(imagetext).filter("li").length;i++)
         imagelength = imagelength+ 50;

        if (reset>17)
        {
            doc.addPage();
            imagelength = 20;
        }
          
  // Checking if images can captured in a existing page or not             
    
    if((290 -imagelength)  > imgData.height/4)
    { 
        
      
  
          doc.addImage(imgData, 'JPEG', 30,imagelength, imgData.width / 3, imgData.height / 4);
          imagelength = imagelength+ imgData.height/4 + 20;
          
          //For Last image and getting the text after that image
           if (image_tags_length == index+1) {
            
        imagetext = $(clone_temp).html().split(/<img[^>]*>/)[index+1];
        if (imagelength>260 &&  Math.round(imagetext.length/240)>3)
        {

            imagelength=20;
            doc.addPage();
        }
       
        doc.fromHTML(imagetext, 15, imagelength+10, {
        'width': 175,
        'elementHandlers': specialElementHandlers_main

    });
        doc.addPage();
        imagelength=20;
        

    };
   
      

    }
    else{
    
    imagelength = 10;
       
    doc.addPage();
    doc.addImage(imgData, 'JPEG', 30,imagelength, imgData.width / 3, imgData.height / 4);
    imagelength = 30+ imgData.height/4; 
   
    if (image_tags_length == index+1) {
         

        imagetext = $(clone_temp).html().split(/<img[^>]*>/)[index+1];
         if (imagelength>260 &&  Math.round(imagetext.length/240)>3)
        {

            imagelength=20;
            doc.addPage();
        }
          doc.fromHTML(imagetext, 15, imagelength, {
        'width': 175,
        'elementHandlers': specialElementHandlers_main

    });
          doc.addPage();
          imagelength =20;
        

    };

   
    }
    




    if (count == 0) {
        imageloading = false;
        if (output_pdf == true) {
            location.reload();
            doc.addPage();
            doc.setFont("times");
            doc.setFontType("italic");
            var end = quotes(Math.round(10*Math.random()))
             doc.setFontSize(30);
           doc.text(30, 120, end);
            doc.setFontSize(10);
          
            doc.text(50,280, 'For bugs and suggestions mail it to sompathaka@gmail.com');
           
           doc.save('Quora_downloads.pdf');
        }
    }
    

}




function Download_Answer() {

       download_button.removeEventListener('click', Download_Answer, false);
       main_div[0].removeChild(download_button);
       
        
        var remove = $(".feed_item_overlay").detach();   // Removing the Top Stories from bottom
        var remove1 = $(".ContentPageFeed").detach();



        doc.setFontSize(40);




        var contents = $("div");

            
     // Getting the Main Question from web page
        var question_main = document.getElementsByClassName("inline_editor_value");


      

    // Getting the  Main Question extra content if any
        var question_small = $("span[id^=__w2][id$=_text_snip_content]");
    
  //Checking if whole Main Question contents are  displayed or not
        if ($(question_main).find('.more_link').length > 0) {

            question_small = question_main[1].getElementsByClassName("hidden");

        }
        if (modify == 1) {
            question_small = $(question_main[1]).find("span[id^=__w2][id$=_full_text_content]");
        }
        var length = 15;

        if ( $('.link_text').length !=1) {

        question_main_clone = question_main[0].cloneNode(true);
        var reset = $(question_main_clone).text().length
        $(question_main_clone).find('.best_source_icon').remove();
        question = $(question_main_clone).html();
        question = question.replace(/<br>/g, "<h2></h2>")
         
    }
    else
    {
          question =  $('.link_text').html();
          var reset = $(question).text().length
           question = question.replace(/<br>/g, "<h2></h2>")
        
    }


        doc.setFontSize(10);
        doc.text(10, 10, 'Main Question');
        doc.setFontSize(60);
        doc.setTextColor(0, 0, 0);

        doc.fromHTML(question, 15, length, {
            'width': 175,
            'elementHandlers': specialElementHandlers_main

        });


        
        reset = Math.round(reset / 45);
        for (var i = 0; i <= reset; i++)
            length = length + 10;




        doc.setFontSize(40);

        question = $(question_small[0]).html();
        
        question = question.replace(/<br>/g, "<h2></h2><h2></h2>")

        
        
        doc.fromHTML(question, 15, length, {
            'width': 175,
            'elementHandlers': specialElementHandlers_main
        });
    


        doc.setFontSize(30);
        doc.addPage();
        var j = 0,
            line = 10;
        var div_length = contents.length;

       // Getting all The Answers of a Question

         var selected_div = $("div[id^=__w2]").filter("[id$=_container] ,[id$=_truncated]").not( $(".expanded_q_text")). not($(".truncated_q_text")).not(".hidden").not('.more_link');
      
      // Finding Total Numbers of images in an answer
        count = $(selected_div).find('img').length;

        
     // Making a loop for Each Answers
        selected_div.each(function(){
                 
            // Answers is having an id of length 22 only 
                 if($(this).attr('id').length == 22 )
                 {

               
                var image_tags = $(this).find('img');
                var image_tags_length = image_tags.length;


    // If an answer is having an image in it
                if (image_tags_length > 0) {

                    
                              
                     var clone_temp = $(this).clone();

                    imagelength = 30;
                    $(this).find('img').each(function(index) {
                        
            // Getting a text before a image  
                        var split_text = $(clone_temp).html().split(/<img[^>]*>/)[index];

                        // br tags does not work on jsPDF so replacing it with h2 tags
                         
                         split_text = split_text.replace(/<br>/g, "<h2></h2><h2></h2>")
                        
                         
                        var som = $(this).attr('src');

                        imageloading = true;
                        
                        
                        getImageFromUrl(som, split_text, index,  image_tags_length, clone_temp ,createPDF);
                       

                    });
                    
                     


// If answers are only text

                } else 
                {

                     answerpages = answerpages + 1;

                     doc.setFontSize(10);
                    doc.text(10, 10, 'Answer ' + answerpages);
                    doc.setFontSize(40);
                    doc.setTextColor(0, 0, 0);
                     
                
                    
                   
                   
                 
                    question = $(this).html().replace(/<br>/g, "<h2></h2><h2></h2>");
                    
                  
                   
                   
        
                   


                    doc.fromHTML(question, 15, 30, {
                        'width': 170,
                        'elementHandlers': specialElementHandlers_main
                    });
                    doc.addPage();
                }




            
   }

        });



        remove.appendTo('body');         // Re-adding Top stories
        remove1.appendTo('body');
        if (imageloading == false) 
        {

            doc.addPage();
            doc.setFont("times");
            doc.setFontType("italic");
            var end = quotes(Math.round(10*Math.random()))
             doc.setFontSize(30);
           doc.text(30, 120, end);
            doc.setFontSize(10);
          
            doc.text(50,280, 'For bugs and suggestions mail it to sompathaka@gmail.com');

          
            location.reload();
        doc.save('Quora_downloads.pdf');
    }
        

        output_pdf = true;
         }
        
      





function quotes(index){

    var quotes_array = ["Madness,as you know, is like a\nGRAVITY.All it takes is little push and\nif you are Mad in if PULL also works","Either you run the day,or the day runs \nyou.So stay calm and Wait for a night",
    "I didn’t fail the test.I just found 100\n ways to REATTEMPT the PAPER","Two roads diverged in a wood\nand I took the one less traveled \non returning back wood were\n converted into CEMENTED FOREST",
    "A Hero can be anyone so change your\n plans be a DIRECTOR","If you are good at something always \ndo it for FREE until you become\nPERFECT IN IT",
    "    You only live once but if you do\n    it right once is enough.","  Mistake is a single page of life\n  but relation is a complete book.\n That's why we have BOOK STORE\n  NOT A PAPER STORE.","\tDon't Forgot to be\n\t\t\tAWESOME",
    "\tYou Are the\n\t\t\tBEST","\tI am in LOVE with you"


    ];
    return quotes_array[index]
}







