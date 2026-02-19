<?php

// If the Post method is from is submitted it will make isset equals to true and thus the conditions is true.
// oure checking if the button has submited . the button name is called submit
if (isset($_POST["submit"])){
    $name = $_POST["name"];
    $emailFrom = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    // my email
    $mailTo = "jrgeorge991@gmail.com";
    // Since we are sending a post request we want to include our header information
    $headers = "From: ".$emailFrom;
    $txt = "You have received an email from ".$name.".\n\n".$message;

    // mail function takes 4 parameters 
    // 1. the email we want to send to
    // 2. the subject of the email
    // 3. the message we want to send
    // 4. the header information
    mail($mailTo, $subject, $txt, $headers);
    //if mail is sent send us to this page 
    header("Location: index.php?mailsend");

}