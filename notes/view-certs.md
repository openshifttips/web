---
title: View certificates
tags:
  - Troubleshooting
  - Certificates
emoji: 🎓
---

The following are useful commands to view certificates to assist in troubleshooting.

## View a certificate chain for a local certificate file (i.e. _.cer, _.pem)

```bash
openssl x509 -in mycert.cer -noout -text
```

## View a certificate chain on a remote server

If the remote server is using SNI (that is, sharing multiple SSL hosts on a single IP address) you will need to send the correct hostname in order to get the right certificate.

```bash
openssl s_client -showcerts -servername www.example.com -connect www.example.com:443
```

If the remote server is not using SNI, then you can skip -servername parameter:

```bash
openssl s_client -showcerts -connect www.example.com:443
```
