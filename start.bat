@echo off
:: ------------------------------------------
:: Start Script for Docker Compose
:: ------------------------------------------

:: Function to clean the database folder
set DB_PATH=".\database\datas"

:menu
echo ========================================
echo What would you like to do?
echo [1] Clean the database folder and start Docker Compose
echo [2] Clean the database folder only (without starting Docker Compose)
echo [3] Skip cleaning and start Docker Compose
echo ========================================
set /p choice="Enter your choice (1/2/3): "

if "%choice%" == "1" (
    echo Cleaning the database folder...
    call :clean_database
    goto start_docker
) else if "%choice%" == "2" (
    echo Cleaning the database folder only...
    call :clean_database
    goto end
) else if "%choice%" == "3" (
    echo Skipping database cleanup.
    goto start_docker
) else (
    echo Invalid choice. Please select 1, 2, or 3.
    goto menu
)

:: Function to clean the database folder
:clean_database
if exist %DB_PATH% (
    attrib -h -s %DB_PATH%\* /s /d
    rmdir /s /q %DB_PATH%
    mkdir %DB_PATH%
    echo Database cleaned successfully!
) else (
    echo Error: Database folder not found. Skipping cleanup.
)
exit /b

:start_docker
echo ========================================
echo Starting Docker Compose...
echo ========================================
docker-compose up --build

:end
:: Keep the window open if necessary
pause
