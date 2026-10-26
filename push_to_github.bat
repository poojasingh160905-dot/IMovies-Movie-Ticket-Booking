@echo off
title Push IMovies to GitHub
echo ========================================================
echo       IMovies - Push Project to GitHub Repository
echo ========================================================
echo.

set "GIT_EXE=C:\Users\MSI\AppData\Local\github-copilot-git-2.53.0-4\cmd\git.exe"
if not exist "%GIT_EXE%" (
    set "GIT_EXE=git"
)

echo Current Git status:
"%GIT_EXE%" status
echo.

set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/your-username/imovies.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] No GitHub URL provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Setting remote origin to: %REPO_URL%
"%GIT_EXE%" remote remove origin >nul 2>&1
"%GIT_EXE%" remote add origin %REPO_URL%

echo.
echo Pushing 'main' branch to GitHub...
"%GIT_EXE%" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  SUCCESS! Your project has been pushed to GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo  If GitHub asked for authentication, sign in through the browser.
    echo  Ensure you have created the empty repository on GitHub first!
    echo ========================================================
)
pause
