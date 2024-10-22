@echo off
:: ------------------------------------------
:: Start Script for Docker Compose
:: ------------------------------------------

:: Function to clean the database folder
set DB_PATH=".\database\data"

:menu
echo ========================================
echo Would you like to clean the database folder before starting?
echo This will remove all contents from %DB_PATH%, including hidden and protected files.
echo ========================================
echo [1] Yes
echo [2] No
set /p choice="Enter your choice (1/2): "

if "%choice%" == "1" (
    echo Cleaning the database folder...
    :: Remove hidden and protected attributes from all files and directories inside the database folder
    if exist %DB_PATH% (
        attrib -h -s %DB_PATH%\* /s /d
        :: Remove all files and directories inside the database folder
        rmdir /s /q %DB_PATH%
        mkdir %DB_PATH%
        echo Database cleaned successfully!
    ) else (
        echo Error: Database folder not found. Skipping cleanup.
    )
    goto start_docker
) else if "%choice%" == "2" (
    echo Skipping database cleanup.
    goto start_docker
) else (
    echo Invalid choice. Please select 1 or 2.
    goto menu
)

:start_docker
echo ========================================
echo Starting Docker Compose...
echo ========================================
docker-compose up --build

:: Keep the window open if docker-compose finishes
pause
