<?php
// Устанавливаем заголовок для JSON-ответа
header('Content-Type: application/json; charset=utf-8');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Конфигурационные данные бота
    define('BOT_TOKEN', '8324572584:AAFjsaXfEJuOKcpQqvn45SxyV8cHt3CnDME');
    define('CHAT_ID', '591201674');

    // Получаем и фильтруем данные
    $name = isset($_POST['nameModal']) ? trim(strip_tags($_POST['nameModal'])) : '';
    $phone = isset($_POST['phoneModal']) ? trim(strip_tags($_POST['phoneModal'])) : '';
    $message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

    // Формируем текст сообщения
    $text = "Новая заявка:\nИмя: $name\nТелефон: $phone\nСообщение: $message";

    // Отправляем сообщение в Telegram
    $url = 'https://api.telegram.org/bot' . BOT_TOKEN . '/sendMessage';
    $params = array(
        'chat_id' => CHAT_ID,
        'text' => $text,
        'parse_mode' => 'HTML'
    );

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);

    // Формируем ответ
    $result = array();

    if ($response !== false) {
        $result['success'] = true;
        $result['message'] = 'Заявка успешно отправлена!';
    } else {
        $result['success'] = false;
        $result['message'] = 'Ошибка при отправке заявки';
        $result['error'] = curl_error($ch);
    }

    // Отправляем JSON-ответ
    echo json_encode($result);
    exit;
}

// Если запрос не POST
$result = array(
    'success' => false,
    'message' => 'Доступ запрещен',
    'error' => 'Invalid request method'
);
echo json_encode($result);
?>