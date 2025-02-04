PennController.ResetPrefix(null); // Shorten command names (keep this line here))
//PennController.Debug()
PennController.SetCounter("increase");
PennController.DebugOff();

// REMOVE COMMENT SYMBOL TO RUN ONLY A SINGLE LATIN SQUARE GROUP 
// LEAVE IT COMMENTED OUT IF YOU WANT IT TO INCREMENT AUTOMATICALLY 
//var counterOverride = 2; // group 3 (OLD: DEPRECATED)


// this _should_ increment the counter immediately and ensure that there is a good mix of groups
SetCounter("inc", 1);
var counterOverride = 2; // group 3 <- Change this to change starting group


Header(
)


.log( "PROLIFIC_PID" , GetURLParameter("PROLIFIC_PID") ); // Add the ID to all trials' results lines

// The following is the definition of dashed; customized self-paced reading controller

dashed = (name,sentence) => [
    newText(name,"").css({display:'flex','flex-direction':'row','flex-wrap':'wrap','line-height':'2em','max-width':'100%'}).print()
    ,
    ...sentence.split(/[*<>]+/).map( (w,i) => (w=="br"?
            newText("").css("width","100vw").print(getText(name))
            :
            newText(name+'-'+i, w.replace(/([^\s])/g,'_'))
                .css({margin:"0em 0.2em",'font-family':'monospace',"font-size":"12pt"})
                .print(getText(name))
    ))
    ,
    newKey(name+'-start', " ").log().wait() // first keypress, to reveal first chunk
    ,
    ...sentence.split(/[*<>]+/).map((w,i)=>(w!="br"?[
        getText(name+'-'+i).text(w) // reveal chunk
        ,
        newKey(i+"-"+w," ").log().wait() // wait for keypress
        ,
        getText(name+'-'+i).text(w.replace(/([^\s])/g,'_')) // hide chunk
    ]:null))
];

// "increase" increments the latin square counter at the start of the session if added at start of list
// Not sure if you need to remove it when you set the group manually (try it out to be sure)
// If you don't include "increase" explicitly, I think what happens is that the increment happens
// right at the end (then you will get loads in the first group if you are doing it automatically)
Sequence("increase", "demographics", "consent", "demo","demo2","continuation-message",rshuffle("filler","exp"),SendResults(),"final")


newTrial("demographics", 
    newText("demographics-text", "Please provide the following demographic information.")
        .print(),
    newText("gender-text", "Please indicate your gender")
        .print(),
    newDropDown("gender","")
        .log()
        .add("Male", "Female", "Non-binary / other", "Prefer not to say")
        .print(),
    newText("age-text", "Please enter your age")
        .print(),
    newTextInput("age","")
        .print(),
    newText("native-text", "Are you a native British English speaker?")
        .print(),
    newDropDown("native","")
        .log()
        .add("Yes, I am a native British English speaker.", 
            "No, I am a native English speaker but not from Britain (specify if you are comfortable to do so)", 
            "No, I am not a native English speaker (specify if you are comfortable to do so)")
        .print(),
    
    newButton("send", "Proceed")
        .print()
        .wait()
        // .wait(getTextInput("age").test.text(/^(0|[1-9][0-9]*)$/))
        // .failure(newText("integer", "Please input an integer")
)


newTrial("consent",
    newHtml("consent_form", "consent.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("continue", "Click to agree with 1-3 above")
        .center()
        .print()
        .wait(getHtml("consent_form").test.complete()
        .failure(getHtml("consent_form").warn())
        )
)



// Instructions
newTrial("instructions",
     // Automatically print all Text elements, centered
    defaultText.center().print()
    ,
    newText("Welcome to this self-paced reading experiment!</p>")
    ,
    newText("Are you ready?</p>")
 //   ,
 //   newText("<b>Please type in your Prolific ID below and then click on the Start button to start the experiment.</b></p>")
 //   ,
 //   newTextInput("inputID", "")
 //       .center()
 //       .css("margin","1em")    // Add a 1em margin around this element
 //       .print()
    ,
    newButton("Start")
        .center()
        .print()
        // Only validate a click on Start when inputID has been filled
        // .wait( getTextInput("inputID").testNot.text("") )
    ,
    // Store the text from inputID into the Var element
    getVar("ID").set( GetURLParameter("id"))
)





//demo
newTrial("demo",
    defaultText.center().print()
    ,
    newText("instruction-1","In this task, you will have to read some sentences.</p>")
    ,
    newText("instruction-2", "Each sentence begins with a row of dashes. </p>")
    ,
    newText("instruction-3","When you see the dashes, press the SPACEBAR on your keyboard, with the index finger of your dominant hand.</p>")
    ,
    newText("instruction-4","Keep pressing the SPACEBAR to see the next part of the sentence.</p>")
    ,
    newText("instruction-5", "There will be a question after some sentences, with possible answers numbered 1 or 2.</p>")
    ,
    newText("instruction-6", "To answer the question, press 1 or 2</p>")
    ,
    newText("instruction-7", "Please do the task alone in a quiet place without distractions.</p>")
    ,
    newText("instruction-8", "PLEASE NOTE. THIS TASK NEEDS TO BE DONE ON A COMPUTER, NOT A MOBILE PHONE OR TABLET</p>")
    ,
    newButton("Start practice")
        .center()
        .print()
        .wait()
        .remove()
    ,
    getText("instruction-1")
        .remove()
    ,
    getText("instruction-2")
        .remove()    
    ,
    getText("instruction-3")
        .remove()
    ,
    getText("instruction-4")
        .remove()
    ,
    getText("instruction-5")
        .remove()
    ,
    getText("instruction-6")
        .remove()
    ,  
     getText("instruction-7")
        .remove()
    ,  
         getText("instruction-8")
        .remove()
    ,  
    newTimer("break", 1000)
        .start()
        .wait()
    ,    
    newText("firstdisplay", "Keep pressing the SPACEBAR")
    .color("blue")
    .print()
,
newKey("spacebar", " ")
    .log()
    .wait()
,
    newController("DashedSentence", {s : "You have just begun reading the sentence you have just finished reading."})
        .center()
        .print()
        .wait()
        .remove()
    )
    
    newTrial("demo2",

    newTimer("break", 1000)
        .start()
        .wait()
    ,
    // dashed("example","This is*my dog*and it likes*to chase*rabbits." ),
    newController("DashedSentence", {s : "My dog likes chasing rabbits and my cat hates the dog."})
//    dashed("example","This is*my dog*and it likes*to chase*rabbits." )
        .center()
        .print()
        .wait()
        .remove()
    ,
    newText("questionhint", "Press either 1 or 2")
    .center()
    .color("blue")
    .print()
    ,
    newController("Question", {q : "Does my dog like chasing rabbits?", as: ["Yes","No"], hasCorrect:0,randomOrder:false})
        .center()
        .print()
        .wait()
        .remove()
    )
    
    newTrial("continuation-message",
    newText("That's the end of the practice</p><p>Remember, use the SPACEBAR to click through the sentence, and 1 and 2 to answer questions</p>")
    .center()
    .print()
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()
)

newTrial( "final" ,
     newText("<p>Thank you for your participation!</p>")
            .center()
           .print()
    ,
    newText("<p><a href='https://edinburgh.eu.qualtrics.com/jfe/form/SV_ehbo4ZELmAoAhds?PROLIFIC_PID="+GetURLParameter("PROLIFIC_PID")+"'>Please click here to continue the experiment</a></p>")
        .center()
        .print()
    ,
    newButton("void")
    .wait()
    )









Template("stimuli.csv", row =>
    newTrial("exp",
        defaultText.print()
        ,
        newTimer("break", 400)
            .start()
            .wait()
        ,
        dashed(row.itemid,row.sentence )
        ,
        getText(row.itemid).remove()
        ,
    ( row.hasquestion==1 ? [
        newController("Question", {q : row.question, as: ["Yes","No"], hasCorrect:0,randomOrder:false})   
                .center()
            .print()
            .wait()
            .remove()
            .log()
    ] : [
        null
    ])



    

     )   

    .log("type",row.itemid)
    .log("group",row.group)
)

Template("fillers.csv", row =>
    newTrial("filler",
        defaultText.print()
        ,
        newTimer("break", 400)
            .start()
            .wait()
        ,
        dashed(row.itemid,row.sentence )
        ,
        getText(row.itemid).remove()
        ,
    ( row.hasquestion==1 ? [
        newController("Question", {q : row.question, as: ["Yes","No"], hasCorrect:0,randomOrder:false})   
                .center()
            .print()
            .wait()
            .remove()
            .log()
    ] : [
        null
    ])



    

     )   

    .log("type",row.itemid)

)


