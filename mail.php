<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require 'vendor/autoload.php';

$mail = new PHPMailer(true);


/*--------------------------------------------
				Index Form
----------------------------------------------*/
if($_POST["action"] == "index") {
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

	$return = [];
	$message = NULL;
	foreach($_POST as $key => $value) {
		if(!$value) $value = '-';
		if($key != 'action') $message .= ucfirst($key) ." : ".filter_var($value, FILTER_SANITIZE_STRING)."<br>";
	}
	
	try {

        //Recipients
        $mail->setFrom('message@vistacarehealthservices.com', $name);
        $mail->addAddress('hamza55454@gmail.com', 'Hamza'); 
        $mail->addAddress('info@vistacaremn.com', 'Hamza'); 
        $mail->addReplyTo($email, $name);
        
        //Content
        $mail->isHTML(true); 
        $mail->Subject = 'A message from '.$name;
        $mail->Body    = $message;
    
        $mail->send();
        $return['success'] = 'success';

    } catch (Exception $e) {
        $return['fail'] = 'fail';
    }

	echo json_encode($return);
	exit;
}



/*--------------------------------------------
				Contact Form
----------------------------------------------*/
if($_POST["action"] == "contact") {

    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
	$return = [];
	$message = NULL;

	foreach($_POST as $key => $value) {
		if(!$value) $value = '-';
		if($key != 'action') $message .= ucfirst($key) ." : ".filter_var($value, FILTER_SANITIZE_STRING)."<br>";
	}


    if(isset($_FILES) && (bool) $_FILES){

		// files details
        $filesar    =   []; 
		$errors 	= 	[];
        $files      =   $_FILES['files'];
		$file_name 	= 	$_FILES['files']['name'];
		$file_size 	=	$_FILES['files']['size'];
		$file_tmp 	=	$_FILES['files']['tmp_name'];
		$file_type	=	$_FILES['files']['type'];
		
		$maxsize 	= 	10 * 1024 * 1024;
		$extensions	= 	array("jpeg","jpg","png", "pdf", "doc", "docx", "zip", "rtf");
		
        
        for( $i=0; $i < count($file_name); $i++ ) {

            // extension checkup
            $file_ext	=	strtolower(end(explode('.',$_FILES['files']['name'][$i])));
            if(in_array($file_ext,$extensions)=== false){
                $return['error'] = 'Extension not allowed! Please choose a JPEG, PNG, PDF, DOCX, DOC, ZIP or RFT file.';
                echo json_encode($return);
                exit;
            }

            // file size checkup
            if($file_size[$i] > $maxsize){
                $return['error'] = 'File size must be lower than 10MB';
                echo json_encode($return);
                exit;
            }
            
            $tmpFilePath = $_FILES['files']['tmp_name'][$i];         
            
            
            if ($tmpFilePath != ""){
                $uploads = dirname(__FILE__) . "/uploads/" . $file_name[$i];
                if(!move_uploaded_file($tmpFilePath, $uploads)) {
                    $return['error'] = 'File upload failed!';
                    echo json_encode($return);
                    exit;               
                }
                array_push($filesar, $uploads);
            }
        }

	}

    


    try {
        

        $return['test'] = $_FILES["files"]["name"];

        $mail->setFrom('message@vistacarehealthservices.com', $name);
        $mail->addAddress('hamza55454@gmail.com', 'Hamza'); 
        $mail->addAddress('info@vistacaremn.com', 'Hamza'); 
        $mail->addReplyTo($email, $name);

        if($filesar){
            foreach ($filesar as $file) {
                $mail->addAttachment($file);
            }
        }

        //Content
        $mail->isHTML(true); 
        $mail->Subject = 'A message from '.$name;
        $mail->Body    = $message;
    
        $mail->send();   
        
        if($filesar){ 
            foreach ($filesar as $file) { 
                unlink($file);
            }
        }

        $return['success'] = 'success';

    } catch (Exception $e) {
        $return['fail'] = 'fail';
    }

    echo json_encode($return);
    exit;



	
	
}



