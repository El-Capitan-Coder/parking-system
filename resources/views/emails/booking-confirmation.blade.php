<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Booking Confirmation</title>
</head>
<body>
    <h2>Parking Booking Confirmation</h2>
    <p>Hi {{ $user->name }},</p>

    <p>Your parking booking has been confirmed with the following details:</p>

    <ul>
        <li><strong>Vehicle:</strong> {{ $vehicle->plate_number }} ({{ $vehicle->vehicle_type }})</li>
        <li><strong>Slot Number:</strong> {{ $slot->slot_number }}</li>
        <li><strong>Date:</strong> {{ $booking->date }}</li>
        <li><strong>Time:</strong> {{ $booking->time_in }} - {{ $booking->time_out }}</li>
        <li><strong>Status:</strong> {{ $booking->status }}</li>
    </ul>

    <p>Thank you for using our parking system!</p>
</body>
</html>
