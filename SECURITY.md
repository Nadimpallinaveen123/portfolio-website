# Security Best Practices

## Secrets

- Store all production secrets in Vercel, Render, and Supabase environment variables.
- Do not commit `.env` files.
- Use a 64+ character random `JWT_SECRET`.
- Use a Gmail app password, not your main Gmail password.
- Configure Gmail credentials as `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD`.

## Resume Protection

- Recruiter details are stored only after OTP request.
- OTP values are hashed with BCrypt before being saved.
- OTP expires after 10 minutes.
- Resume download requires a short-lived download JWT.
- Each successful download is logged with recruiter ID, timestamp, and IP address.

## Admin

- Admin passwords are hashed with BCrypt.
- Admin users are stored in the `admin_users` table.
- Admin API routes require JWT authentication.
- Use a strong admin password in Render environment variables.
- Rotate the admin password if it is shared or exposed.

## Database

- Use Supabase SSL mode in production.
- Restrict direct database access.
- Export recruiter records only from the authenticated admin dashboard.
- Delete recruiter records when they are no longer needed for hiring communication.

## CORS

- In production, set `ALLOWED_ORIGINS` to the exact Vercel domain.
- Avoid wildcard origins for authenticated admin APIs.

## Operational Notes

- Keep dependencies updated.
- Monitor Render logs for failed email delivery.
- Add rate limiting before high-traffic production use.
- Replace the placeholder resume PDF before launch.
