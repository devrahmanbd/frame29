---
name: attack-tree-construction
description: "Build comprehensive attack trees to visualize threat paths. Use when mapping attack scenarios, identifying defense gaps, or communicating security risks to stakeholders."
---

# Attack Tree Construction

Systematic attack path visualization and analysis.

## When to Use

- Visualizing complex attack scenarios
- Identifying defense gaps and priorities
- Communicating risks to stakeholders
- Planning defensive investments or test scopes

## Do Not Use When

- Lacking authorization or a defined scope
- General risk review without attack-path modeling
- Request is unrelated to security assessment

## Instructions

1. Confirm scope, assets, and attacker goal for root node
2. Decompose into sub-goals with AND/OR structure
3. Annotate leaves with cost, skill, time, and detectability
4. Map mitigations per branch
5. Prioritize high-impact paths

## Node Types

| Type | Symbol | Description |
|------|--------|-------------|
| **OR** | Oval | Any child achieves goal |
| **AND** | Rectangle | All children required |
| **Leaf** | Box | Atomic attack step |

## Attack Attributes

| Attribute | Values |
|-----------|--------|
| **Cost** | Free, Low, Medium, High, Very High |
| **Time** | Hours, Days, Weeks |
| **Skill** | Low, Medium, High |
| **Detection** | Low, Medium, High |

## Safety

- Share attack trees only with authorized stakeholders
- Avoid sensitive exploit details unless required

## Resources

See `resources/implementation-playbook.md` for detailed patterns, templates, and code samples.
