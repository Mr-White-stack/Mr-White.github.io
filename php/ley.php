<?php
    // Import PHPMailer classes into the global namespace
    // These must be at the top of your script, not inside a function
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    //SMTP needs accurate times, and the PHP time zone MUST be set
    //This should be done in your php.ini, but this is how to do it if you don't have access to that
    date_default_timezone_set('UTC');

    require 'PHPMailer/Exception.php';
    require 'PHPMailer/PHPMailer.php';
    require 'PHPMailer/SMTP.php';

    $action = isset($_REQUEST["action"]) ? $_REQUEST["action"] : "";

    if ($action == "sendMail"){		
		$subject = isset($_POST["subject"]) ? ($_POST["subject"]) : "";
        $body    = isset($_POST["body"]) ? ($_POST["body"]) : "";
        $toMail  = isset($_POST["toMail"]) ? ($_POST["toMail"]) : "";
        $ccMail  = isset($_POST["ccMail"]) ? ($_POST["ccMail"]) : "";
		//Create a new PHPMailer instance
		$mail = new PHPMailer(true);
        
		try {
			//Tell PHPMailer to use SMTP
			$mail->isSMTP();
			//Enable SMTP debugging
			// 0 = off (for production use)
			// 1 = client messages
			// 2 = client and server messages
			$mail->SMTPDebug = 0;

			//TEST SERVER
			// $mail->Host = 'SMTP.office365.com';
			// $mail->Port = 587;
			// $mail->SMTPAuth = true;
			// $mail->SMTPSecure = 'tls';
			// $mail->Username = 'notanothertest@outlook.com';
			// $mail->Password = 'Apasswordisrequired';
			// $mail->setFrom('notanothertest@outlook.com', 'Info ETAP');

			//INTRACTO SERVER TEST
			$mail->Host = 'localhost';
			$mail->Port = 25;
			$mail->SMTPAuth = false;
			$mail->SMTPSecure = false;
            $mail->SMTPAutoTLS = false;
            //FROM
            $mail->setFrom('info@etaplighting.com', 'ETAP Lighting');
            $mail->addReplyTo('info@etaplighting.com', 'ETAP Lighting');
			//TO			
            //$mail->addAddress('gbcarrasco@gmail.com', 'ETAP Lighting'); //test only
            $mail->addAddress($toMail, 'ETAP Lighting');
            //CC

			$mail->addCC($ccMail);
			//CONTENT
			$mail->isHTML(true); // Set email format to HTML
			$mail->Subject = $subject;
			$mail->Body    = $body;
			$mail->AltBody = $body;
			
			//ATTACHMENTS			
			if(!empty($_POST['attachMail'])){
				$clean = strtr($_POST['attachMail'], ' ', '+');
				$decoded = base64_decode($clean);	
			}
			else {
				echo json_encode("No data to send");
				exit();
			}
					
			$mail->AddStringAttachment($decoded, 'Ley_Project_Summary.pdf', 'base64', 'application/pdf');			
			$mail->send();			
			echo json_encode('Message has been successfuly sent! TO: $toMail | CC: $ccMail');
		} catch (Exception $e) {
			echo json_encode("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
		}

    }
?>