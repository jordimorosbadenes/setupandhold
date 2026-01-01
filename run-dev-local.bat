@echo off
setlocal
set "PUBLIC_PUZZLEGEN_URL=http://localhost:5000"
echo Using local backend: %PUBLIC_PUZZLEGEN_URL%
npm run dev
endlocal
