# Example custom detections repo

A detection source for MITRE Detect Manager: your own rules, kept in Git and synced into the
`cribl-mitre-atomic-detections` pack next to its built-in rules. Copy this folder into a new
repository to start.

```
mitre-detect.yml                    source manifest (required)
rules/windows/process_creation/     Sigma: Windows process creation -> OCSF 1007
rules/cloud/aws/cloudtrail/         Sigma: AWS CloudTrail -> OCSF 6003 / 3002
rules/native/                       native OCSF rules (any class), tests inline
tests/sigma.yml                     test events for the Sigma rules, keyed by Sigma id
.github/workflows/                  validate on pull request, sync on push to main
```

| Rule | Format | ATT&CK |
|---|---|---|
| Rclone Copy or Sync to a Cloud Storage Remote | Sigma | T1567.002 |
| Local Account Created and Added to Administrators | Sigma | T1136.001 |
| Scheduled Task Created That Runs From a User-Writable Path | Sigma | T1053.005 |
| IAM Access Key Created | Sigma | T1098.001 |
| S3 Public Access Block Removed | Sigma | T1530 |
| Key appended to an SSH authorized_keys file from a shell | native | T1098.004 |

*IAM Access Key Created* overlaps the pack's built-in `aws_iam_access_key_created` on purpose. It
shows how the sync preview reports overlaps with rules you already have.

## Rules

- **Sigma:** standard Sigma YAML. Supported log sources are Windows `process_creation` and AWS
  `cloudtrail`. Each rule needs an `attack.tXXXX` tag that exists in ATT&CK v19.1. A rule the
  converter cannot express exactly is skipped, with the reason shown in the sync preview. The
  converter never approximates a rule.
- **Native:** the pack's own format, for OCSF classes Sigma does not map yet. See
  `rules/native/linux_persistence.yml`.
- **Tests:** every rule needs at least one positive and one negative event. If a rule's tests
  fail, the whole sync stops and nothing is written to Cribl.

## Connecting it

In the app, open **Settings → Detection sources → Add source**. Enter the clone URL with a
read-only token, for example `https://x-access-token:<token>@github.com/acme/detections.git`,
and the branch. The full guide is in the main repo at `docs/custom-detections.md`.
