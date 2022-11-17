- login : Thathsara
- registration : Sisi
- save message as strings : Sudaraka

# install openSSL on windows

https://slproweb.com/products/Win32OpenSSL.html

# generate private key

openssl genrsa -out key.pem

# create a new certificate signing request

openssl req -new -key key.pem -out csr.pem

# generate the SSL certificate from CSR

openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
