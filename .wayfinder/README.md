# Local Markdown issue tracker

This directory is the issue tracker for the Pascual Code Labs website planning effort.

- The canonical map is [`map.md`](map.md).
- Each file in `tickets/` is a child issue of the map.
- `status: open` and an empty `assignee` means the ticket is unclaimed.
- A ticket is on the frontier when it is open, unclaimed, and every ticket named in `blocked_by` is closed.
- Claim a ticket by filling `assignee` before working it.
- Resolve a ticket by appending a `## Resolution` comment, changing `status` to `closed`, and adding one linked gist to the map's `Decisions so far` section.
- Refer to maps and tickets by their linked titles in human-facing text, never by their numeric filename alone.

