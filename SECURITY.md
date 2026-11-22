# Security reporting

This is the default reporting policy for unset.sh repositories that do not provide their own security policy.
Check the affected repository's **Security → Policy** page first for project-specific scope and supported versions.

## Report privately

Use **Security → Advisories → Report a vulnerability** in the affected repository when that option is available.
Otherwise, email **[security@unset.sh](mailto:security@unset.sh)** and name the affected repository.
Do not publish vulnerability details in an issue, pull request, discussion or public attachment.

Include the affected component, version or commit, the expected security boundary, steps to reproduce, and the
potential impact. A minimal example using accounts and data you control is helpful. Remove credentials, private
keys and other people's personal data from supporting material; explain what you removed.

## During investigation

Keep follow-up details in the private report or email thread. Coordinate any public disclosure with the maintainers
so affected users can receive a fix or mitigation. Avoid accessing other people's data, disrupting services or
testing systems you do not have permission to test.

Each project maintains its own supported-version and remediation information. This organisation default does not
set a response deadline, promise a bounty or grant permission to test third-party systems.

For ordinary bugs and usage questions, follow [Support](https://github.com/unset-sh/.github/blob/main/SUPPORT.md).
