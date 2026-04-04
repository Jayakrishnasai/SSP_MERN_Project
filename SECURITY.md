# Security Policy

## Supported Versions

Currently, we support security updates for the following versions of the SSP MERN Project:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of the Perseverance Software Training Institute Platform seriously. If you believe you have found a security vulnerability, please report it to us as soon as possible.

### How to Report

To report a vulnerability, please use one of the following methods:

1. **GitHub Private Reporting**: Use the "Report a vulnerability" button in the [Security tab](<https://github.com/Jayakrishnasai/SSP_MERN_Project/security/advisories>) of this repository. This is the preferred method for private disclosure.
2. **Email**: If private reporting is unavailable, please email the maintainer at **<[EMAIL_ADDRESS]>** (or the contact listed in the project documentation).

Please include the following in your report:

- A description of the vulnerability.
- Steps to reproduce the issue (proof-of-concept).
- Potential impact if exploited.

### What to Expect

- **Acknowledgment**: You will receive an acknowledgment of your report within **48-72 hours**.
- **Investigation**: We will investigate the issue and may contact you for further information.
- **Resolution**: Once confirmed, we will work on a fix and notify you when it is ready.
- **Disclosure**: We will coordinate the public disclosure of the vulnerability after a fix is available.

### Security Best Practices

For those deploying or contributing to this project, please follow these security guidelines:

- **Secrets Management**: Never commit credentials (MongoDB strings, API keys) to the repository. Use environment variables and [GitHub Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) for CI/CD.
- **Dependency Updates**: Regularly update dependencies to mitigate supply chain vulnerabilities.
- **Container Security**: Use SHA-based image tags for predictable and verifiable deployments.
- **Environment Isolation**: Ensure production databases are isolated and require authentication.

### Please Do Not

- Disclose the vulnerability publicly before we have had a chance to address it.
- Use the vulnerability for malicious purposes or to access unauthorized data.
