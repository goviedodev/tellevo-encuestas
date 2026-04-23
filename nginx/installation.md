# SSL Certificate Installation with Certbot

This guide provides instructions for obtaining and managing an SSL certificate for `ms-encuesta.tellevoapp.com` using Certbot.

## Prerequisites

- Nginx installed and running.
- Domain `ms-encuesta.tellevoapp.com` pointing to this server.
- Certbot installed (`apt install certbot python3-certbot-nginx` on Ubuntu/Debian).

## Steps to Obtain the Certificate

1. **Prepare the Nginx Configuration:**
   - Ensure the site configuration file `ms-encuesta.tellevoapp.com.conf` is created in this directory.
   - Run the provided scripts to enable the site:
     ```
     ./copy-to-sites-available
     ./link-sites-enable
     ```

2. **Obtain the Certificate:**
   - Run Certbot with the Nginx plugin:
     ```
     sudo certbot --nginx -d ms-encuesta.tellevoapp.com
     ```
   - Follow the prompts to enter your email and agree to the terms.
   - Certbot will automatically obtain the certificate and update the Nginx configuration.

3. **Verify Installation:**
   - Test the Nginx configuration:
     ```
     sudo nginx -t
     ```
   - Reload Nginx:
     ```
     sudo nginx -s reload
     ```
   - Visit `https://ms-encuesta.tellevoapp.com` to confirm HTTPS is working.

## Certificate Renewal

Certbot sets up automatic renewal by default. To manually renew:

- Run:
  ```
  sudo certbot renew
  ```
- Then reload Nginx:
  ```
  sudo nginx -s reload
  ```

For more information, visit the [Certbot documentation](https://certbot.eff.org/docs/).