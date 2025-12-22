$notifications = @(
    @{
        recipient = "temp-user-id"
        type = "success"
        title = "System Working!"
        message = "Your notification system is now properly configured and working! Click the bell icon to see this."
    },
    @{
        recipient = "temp-user-id"
        type = "info"
        title = "New SOR Created"
        message = "SOR-202512-001 has been created for Bosch Automotive."
        link = "/sor/list"
    },
    @{
        recipient = "temp-user-id"
        type = "warning"
        title = "Payment Pending"
        message = "Payment PAY-2024-456 requires your approval. Amount: Rs. 45,000"
        link = "/payments"
    },
    @{
        recipient = "temp-user-id"
        type = "sor"
        title = "SOR Approved"
        message = "Your Statement of Requirements SOR-202512-785 has been approved by the manager."
    },
    @{
        recipient = "temp-user-id"
        type = "payment"
        title = "Payment Processed"
        message = "Payment of Rs. 1,25,000 to NeoSky India has been processed successfully."
    }
)

Write-Output ""
Write-Output "Sending notifications with correct recipient ID..."
Write-Output ""

foreach ($notif in $notifications) {
    try {
        $body = $notif | ConvertTo-Json
        $response = Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/notifications' -Method Post -ContentType 'application/json' -Body $body
        Write-Output "Sent: $($notif.title)"
    }
    catch {
        Write-Output "Failed: $($notif.title) - Error: $($_.Exception.Message)"
    }
    Start-Sleep -Milliseconds 200
}

Write-Output ""
Write-Output "Done! Refresh your page and check the bell icon!"
Write-Output "The red badge should now appear with the notification count."
Write-Output ""
