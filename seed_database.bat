@echo off
title Seed IMovies Database
echo Seeding IMovies sample movies, showtimes, and demo user accounts...
cd backend
npm run seed
pause
