@echo off
setlocal
if "%PUBLIC_PUZZLEGEN_URL%"=="" (
	echo PUBLIC_PUZZLEGEN_URL no esta configurada.
	echo Define PUBLIC_PUZZLEGEN_URL en Web/.env o como variable de entorno y vuelve a lanzar.
	exit /b 1
)
echo Using backend: %PUBLIC_PUZZLEGEN_URL%
npm run dev
endlocal
