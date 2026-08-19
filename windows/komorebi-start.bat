@echo off
:: komorebi-start.bat — Auto-start komorebi + whkd + AHK
:: Place in shell:startup or Task Scheduler

:: Start AHK hyper key script (Right Alt as hyper)
start "" "C:\Users\pkhac\dotfiles\windows\hyper-alt.ahk"

:: Start whkd (hotkey daemon)
start /b whkd

:: Wait a beat
timeout /t 1 /nobreak >nul

:: Start komorebi
komorebic start --bar

:: Wait for komorebi to be ready
timeout /t 2 /nobreak >nul

echo Komorebi + whkd + AHK started successfully.
