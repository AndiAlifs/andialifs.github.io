# Webpage Performance Benchmark (curl.exe)
# URL   : https://andialifs.github.io/shila-mdsc-2025
# Runs  : 50 requests - fresh connection each time
# Metrics: DNS, TCP Connect, TLS Handshake, TTFB, Transfer, Total, Speed, Size, HTTP Status, Redirects

$url     = "https://andialifs.github.io/shila-mdsc-2025"
$runs    = 50
$csvPath = Join-Path $PSScriptRoot "benchmark_results.csv"
$records = @()

# ── Credentials (Optional) ────────────────────────────────────────────────────
# If the site requires Basic Auth, fill in user/pass.
# If it requires a Bearer token, fill in authToken (e.g. "Bearer <token>").
$authUser  = ""
$authPass  = ""
$authToken = "" 


# curl --write-out format - pipe-delimited, times in seconds, sizes in bytes
# All time_* values are cumulative from the start of the request
$writeOut = "%{time_namelookup}|%{time_connect}|%{time_appconnect}|%{time_starttransfer}|%{time_total}|%{speed_download}|%{size_download}|%{http_code}|%{num_redirects}|%{url_effective}"

Write-Host ""
Write-Host "Benchmarking : $url"
Write-Host "Runs         : $runs"
Write-Host "Tool         : $(curl.exe --version | Select-Object -First 1)"
Write-Host ("-" * 90)
Write-Host ("  {0,3}  {1,9}  {2,7}  {3,7}  {4,7}  {5,8}  {6,8}  {7,9}  {8,7}  {9}" -f `
    "Run", "Total ms", "DNS ms", "TCP ms", "TLS ms", "TTFB ms", "Xfer ms", "KB/s", "KB", "HTTP")
Write-Host ("-" * 90)

for ($i = 1; $i -le $runs; $i++) {
    # --silent       : no progress meter
    # --output NUL   : discard body (we only want timing)
    # --location     : follow redirects
    # --no-keepalive : force fresh TCP connection every run
    
    $curlArgs = @("--silent", "--output", "NUL", "--location", "--no-keepalive", "--write-out", $writeOut)

    if (-not [string]::IsNullOrWhiteSpace($authUser)) {
        $curlArgs += "--user"
        $curlArgs += "${authUser}:${authPass}"
    }

    if (-not [string]::IsNullOrWhiteSpace($authToken)) {
        $curlArgs += "--header"
        $curlArgs += "Authorization: $authToken"
    }

    $curlArgs += $url

    # Execute curl with the constructed arguments
    $raw = & curl.exe $curlArgs 2>&1

    $parts = ($raw -join "") -split '\|'

    if ($parts.Count -lt 10) {
        Write-Warning "Run ${i}: unexpected curl output: $raw"
        continue
    }

    # Cumulative seconds from curl
    $dns_s   = [double]$parts[0]
    $tcp_s   = [double]$parts[1]
    $tls_s   = [double]$parts[2]
    $ttfb_s  = [double]$parts[3]
    $total_s = [double]$parts[4]
    $speed   = [double]$parts[5]   # bytes/sec
    $size    = [double]$parts[6]   # bytes
    $http    = $parts[7].Trim()
    $redirs  = [int]$parts[8]
    $finalUrl = $parts[9].Trim()

    # Convert cumulative → per-phase deltas in ms
    $dns_ms   = [math]::Round($dns_s * 1000, 2)
    $tcp_ms   = [math]::Round(($tcp_s  - $dns_s)  * 1000, 2)
    $tls_ms   = [math]::Round(($tls_s  - $tcp_s)  * 1000, 2)
    $ttfb_ms  = [math]::Round(($ttfb_s - $tls_s)  * 1000, 2)
    $xfer_ms  = [math]::Round(($total_s - $ttfb_s) * 1000, 2)
    $total_ms = [math]::Round($total_s * 1000, 2)
    $speed_kbs = [math]::Round($speed / 1024, 2)
    $size_kb   = [math]::Round($size  / 1024, 2)

    $records += [PSCustomObject]@{
        Run          = $i
        Timestamp    = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        HTTP_Status  = $http
        Redirects    = $redirs
        DNS_ms       = $dns_ms
        TCP_ms       = $tcp_ms
        TLS_ms       = $tls_ms
        TTFB_ms      = $ttfb_ms
        Transfer_ms  = $xfer_ms
        Total_ms     = $total_ms
        Speed_KBs    = $speed_kbs
        Size_KB      = $size_kb
        Final_URL    = $finalUrl
    }

    Write-Progress `
        -Activity "Benchmarking $url" `
        -Status "Run $i/$runs | Total: ${total_ms} ms | TTFB: ${ttfb_ms} ms" `
        -PercentComplete (($i / $runs) * 100)

    Write-Host ("  {0,3}  {1,9}  {2,7}  {3,7}  {4,7}  {5,8}  {6,8}  {7,9}  {8,7}  {9}" -f `
        $i, $total_ms, $dns_ms, $tcp_ms, $tls_ms, $ttfb_ms, $xfer_ms, $speed_kbs, $size_kb, $http)
}

Write-Progress -Activity "Benchmarking" -Completed

if ($records.Count -eq 0) {
    Write-Warning "No successful requests recorded."
    exit 1
}

# ── Summary helper ────────────────────────────────────────────────────────────
function Get-Stats($values) {
    $s = $values | Measure-Object -Minimum -Maximum -Average
    [PSCustomObject]@{
        Min = [math]::Round($s.Minimum, 2)
        Max = [math]::Round($s.Maximum, 2)
        Avg = [math]::Round($s.Average, 2)
    }
}

$stTotal = Get-Stats ($records.Total_ms)
$stDns   = Get-Stats ($records.DNS_ms)
$stTcp   = Get-Stats ($records.TCP_ms)
$stTls   = Get-Stats ($records.TLS_ms)
$stTtfb  = Get-Stats ($records.TTFB_ms)
$stXfer  = Get-Stats ($records.Transfer_ms)
$stSpeed = Get-Stats ($records.Speed_KBs)
$stSize  = Get-Stats ($records.Size_KB)

Write-Host ""
Write-Host ("-" * 70)
Write-Host ("  Summary ({0} runs)  --  {1}" -f $records.Count, $url)
Write-Host ("-" * 70)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "Metric", "Min", "Max", "Avg")
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f ("-"*22), ("-"*10), ("-"*10), ("-"*10))
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "Total Load (ms)",    $stTotal.Min, $stTotal.Max, $stTotal.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "DNS Lookup (ms)",    $stDns.Min,   $stDns.Max,   $stDns.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "TCP Connect (ms)",   $stTcp.Min,   $stTcp.Max,   $stTcp.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "TLS Handshake (ms)", $stTls.Min,   $stTls.Max,   $stTls.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "TTFB (ms)",          $stTtfb.Min,  $stTtfb.Max,  $stTtfb.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "Transfer (ms)",      $stXfer.Min,  $stXfer.Max,  $stXfer.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "Speed (KB/s)",       $stSpeed.Min, $stSpeed.Max, $stSpeed.Avg)
Write-Host ("  {0,-22} {1,10}  {2,10}  {3,10}" -f "Response Size (KB)", $stSize.Min,  $stSize.Max,  $stSize.Avg)
Write-Host ("-" * 70)
Write-Host ""

# ── Export CSV ────────────────────────────────────────────────────────────────
$records | Export-Csv -Path $csvPath -NoTypeInformation -Encoding UTF8
Write-Host "  CSV exported to: $csvPath"
Write-Host ""
