$body = @{
    recipient = "temp-user-id"
    type = "success"
    title = "🎉 System Test - Notification Working!"
    message = "Congratulations! Your notification system is working perfectly. This is a test notification to verify the bell icon and notification center."
    link = "/dashboard"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/notifications' -Method Post -ContentType 'application/json' -Body $body

Write-Output "✅ Test notification sent successfully!"
Write-Output $response | ConvertTo-Json
