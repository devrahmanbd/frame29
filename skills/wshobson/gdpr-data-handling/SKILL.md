---
name: gdpr-data-handling
description: Implement GDPR-compliant data handling with consent management, data subject rights, and privacy by design. Use when building systems that process EU personal data, implementing privacy controls, or conducting GDPR compliance reviews.
---

# GDPR Data Handling

Practical implementation guide for GDPR-compliant data processing, consent management, and privacy controls.

## Core Concepts

### Personal Data Categories

| Category | Examples | Protection |
|----------|-----------|------------|
| Basic | Name, email, phone | Standard |
| Sensitive (Art. 9) | Health, religion, ethnicity | Explicit consent |
| Criminal (Art. 10) | Convictions, offenses | Official authority |
| Children's | Under 16 data | Parental consent |

### Legal Bases (Art. 6)

- **Consent**: Freely given, specific, informed
- **Contract**: Necessary for contract performance
- **Legal Obligation**: Required by law
- **Vital Interests**: Protecting someone's life
- **Public Interest**: Official functions
- **Legitimate Interest**: Balanced against rights

### Data Subject Rights

Must respond within 1 month:
- Right to Access (Art. 15)
- Right to Rectification (Art. 16)
- Right to Erasure (Art. 17)
- Right to Restrict (Art. 18)
- Right to Portability (Art. 20)
- Right to Object (Art. 21)

## Implementation Patterns

### Consent Management

```javascript
const consentSchema = {
  userId: String,
  consents: [{
    purpose: String, // 'marketing', 'analytics'
    granted: Boolean,
    timestamp: Date,
    source: String,
    version: String, // Privacy policy version
    ipAddress: String,
    userAgent: String,
  }],
  auditLog: [{
    action: String, // 'granted', 'withdrawn'
    timestamp: Date,
  }]
};
```

### Consent UI

- Checkboxes per purpose (marketing, analytics, etc.)
- Necessary cookies: always on, disabled checkbox
- Clear links to Privacy Policy and Cookie Policy
- "Accept All" / "Reject All" / "Save Preferences"

### Data Subject Access Request (DSAR)

Response deadline: 30 days (extendable to 60 for complex requests)

Process:
1. Verify identity
2. Collect data from all sources
3. Generate portable export (JSON format)
4. Handle erasure with legal exceptions

### Data Retention

Define retention periods per data type:
- User account: 3 years after last activity
- Transaction records: 7 years (legal obligation)
- Marketing consent: 2 years
- Analytics data: 1 year (anonymize instead of delete)

## Breach Notification

- **Authority notification**: Within 72 hours if high risk
- **Affected individuals**: Notify if high severity (health, financial, credentials exposed)
- **Documentation**: Always document breach timeline

## Compliance Checklist

- [ ] Documented legal basis for each processing activity
- [ ] Consent mechanisms meet GDPR requirements
- [ ] Privacy policy clear and accessible
- [ ] Access/erasure/portability requests process implemented
- [ ] Response within 30-day deadline
- [ ] Encryption at rest and in transit
- [ ] Access controls in place
- [ ] Audit logging enabled
- [ ] Records of processing activities (Art. 30)
