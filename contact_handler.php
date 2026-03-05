<?php
// contact_handler.php - Handles portfolio contact form submissions securely
header('Content-Type: application/json');

// Allow only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Read raw POST data (since we will likely send JSON from frontend via fetch)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

if (!$input) {
    // Fallback if sent as standard form URL encoded
    $input = $_POST;
}

// 1. Sanitize Inputs
$name = isset($input['name']) ? strip_tags(trim($input['name'])) : '';
$email = isset($input['email']) ? filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL) : '';
$message_body = isset($input['message']) ? htmlspecialchars(trim($input['message'])) : '';

// 2. Validation
if (empty($name) || empty($email) || empty($message_body)) {
    echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
    exit;
}

// Validate Name: Allows English and Amharic letters and spaces
if (!preg_match('/^[\p{L}\s]+$/u', $name)) {
    echo json_encode(['status' => 'error', 'message' => 'Name should only contain letters. Numbers and special characters are not allowed.']);
    exit;
}

// Validate Email Address
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Please provide a valid email address.']);
    exit;
}

// Validate Message Length
if (strlen($message_body) < 10) {
    echo json_encode(['status' => 'error', 'message' => 'Your message must be at least 10 characters long.']);
    exit;
}

// 3. Prepare Email Details
$to = "diemasdawit.21@gmail.com, heruyane@gmail.com";
$subject = "New Portfolio Message: $name";
$email_content = "You have received a new message from your portfolio contact form.\n\n";
$email_content .= "Client Name: $name\n";
$email_content .= "Client Email: $email\n\n";
$email_content .= "Message Details:\n$message_body\n";

// Headers
$headers = "From: noreply@dawitportfolio.local\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// 4. Save to Local Backup File (Crucial for Localhost/XAMPP without SMTP setups)
$log_dir = __DIR__ . '/logs';
if (!is_dir($log_dir)) {
    mkdir($log_dir, 0777, true);
}
$log_entry = "========================================\n";
$log_entry .= "DATE: " . date('Y-m-d H:i:s') . "\n";
$log_entry .= "FROM: $name <$email>\n";
$log_entry .= "MESSAGE:\n$message_body\n";
$log_entry .= "========================================\n\n";
file_put_contents($log_dir . '/contact_inbox.log', $log_entry, FILE_APPEND);

// 5. Send Real Email Notification
$mail_sent = @mail($to, $subject, $email_content, $headers);

// Respond with a professional Success Message
echo json_encode([
    'status' => 'success',
    'message' => 'Your message has been sent successfully! I will get back to you shortly.',
    'email_attempted' => true
]);
exit;
?>