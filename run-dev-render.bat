@echo off
setlocal
set "PUBLIC_PUZZLEGEN_URL=https://puzzle-generator-vkgt.onrender.com"
echo Using Render backend: %PUBLIC_PUZZLEGEN_URL%
npm run dev
endlocal
