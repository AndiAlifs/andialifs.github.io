@echo off
setlocal EnableDelayedExpansion

set "URL=https://andialifs.github.io/shila-mdsc-2025"
set "RUNS=50"
set "CSV_PATH=benchmark_results.csv"

:: The format string for curl output
set "WRITEOUT=%%{time_namelookup}|%%{time_connect}|%%{time_appconnect}|%%{time_starttransfer}|%%{time_total}|%%{speed_download}|%%{size_download}|%%{http_code}|%%{num_redirects}|%%{url_effective}"

echo Benchmarking : %URL%
echo Runs         : %RUNS%
echo ----------------------------------------------------------------------

:: Create CSV Header
echo Run,DNS_s,TCP_s,TLS_s,TTFB_s,Total_s,Speed_bps,Size_bytes,HTTP_Status > "%CSV_PATH%"

for /L %%i in (1,1,%RUNS%) do (
    :: Execute curl and parse the pipe-delimited output
    for /F "tokens=1-10 delims=|" %%a in ('curl.exe --silent --output NUL --location --no-keepalive --write-out "%WRITEOUT%" "%URL%"') do (
        
        echo Run %%i: Total: %%e s ^| TTFB: %%d s ^| HTTP: %%h
        
        :: Append raw data to CSV
        echo %%i,%%a,%%b,%%c,%%d,%%e,%%f,%%g,%%h >> "%CSV_PATH%"
    )
)

echo ----------------------------------------------------------------------
echo Done! Open %CSV_PATH% in Excel to calculate deltas and summaries.
pause