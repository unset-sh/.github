# Profile icons

The profile cards use Tabler Icons 3.52.0 outline drawings, taken from
[`@unset-sh/brand`](https://github.com/unset-sh/brand) at exactly
[v0.1.1](https://github.com/unset-sh/brand/tree/v0.1.1)
(`icons/tabler/icons.json`, commit `8c998a2990ae477daf5ac1636028f6cbf379577b`).
Only the drawings the cards use are copied here. The paths and the 2px stroke
are unchanged; a CSS rule sets currentColor to Onyx (#0A090C) in light mode and
Platinum (#F0EDEE) in dark mode, the mark colours in brand's
`guidelines/logo.md`.

The Tabler copyright and permission notice is in
[LICENSE-tabler.md](LICENSE-tabler.md), copied from brand's
`icons/tabler/LICENSE.md`.

| Repository | Icon |
| --- | --- |
| `.github` | `users` |
| `agent-kit` | `robot` |
| `tooling` | `terminal-2` |
| `docs` | `book` |
| `brand` | `palette` |
| `rendering` | `photo` |
| `lexicons` | `file-code` |
| `profile-recipes` | `layout` |
| `pds` | `server` |
| `backend` | `stack-2` |
| `web` | `world` |
| `deployment` | `cloud-upload` |

The app entry uses the original unset.sh marks (`logo/unset-mark-onyx.svg` and
`logo/unset-mark-platinum.svg`) from brand at the same v0.1.1 commit,
referenced unchanged under brand's
[asset licence](https://github.com/unset-sh/brand/blob/v0.1.1/LICENSE-ASSETS.md).
The mark is not a Tabler icon.

repos.json selects each icon from the renderer's closed list. Decorative
images have empty alt text beside visible labels and use picture elements so
GitHub does not add separate image links, keeping them out of keyboard
navigation. Relative icon paths follow the README's branch in previews.
