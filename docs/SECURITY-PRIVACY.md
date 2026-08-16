# Security and Privacy

## Development vs Production

Local/mock authentication is acceptable for prototype work only.

Never describe mock auth as production secure.

## Production Security Expectations

When the project moves toward production, require:

- hardened identity/authentication
- server-side session validation
- server-side authorization
- secure credential/token handling
- CSRF strategy where applicable
- input validation
- output encoding
- secure headers/CSP strategy
- dependency vulnerability management
- secrets management
- audit logging for privileged operations
- rate limiting/abuse controls where appropriate
- privacy-aware analytics
- data retention rules

## Authorization

UI visibility is not an authorization boundary.

Every protected server/API operation must enforce permissions independently.

## Client Data

Treat saved properties, interests, enquiries, recently viewed items, sales notes, and behavioral analytics as user-related data.

Do not expose client behavioral data to staff unless:

- product policy allows it
- permissions allow it
- the implementation is privacy-compliant

## Least Privilege

Default to the least privilege needed for each role.

## Enterprise Evolution

Only introduce SSO, SCIM, advanced policy engines, data residency, or tenant isolation when the business/enterprise requirements justify them.
