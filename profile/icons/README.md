# Profile icons

Six Iconoir 7.12.1 regular icons identify each repository's contents. The
drawings and 1.5 stroke widths are unchanged; a CSS rule sets currentColor
to Onyx (#0A090C) in light mode and Platinum (#F0EDEE) in dark mode.

Source: [Iconoir v7.12.1](https://github.com/iconoir-icons/iconoir/tree/d7dfa4d0341df0670bfed9fc24221c9d7ef2112e/icons/regular).
The original copyright and permission notice is in [LICENSE-iconoir.txt](LICENSE-iconoir.txt).

| Local file | Original Git blob SHA |
| --- | --- |
| `palette.svg` | `272c4aec61c20227567f093803ecbc7834adf22e` |
| `media-image.svg` | `f6aacc9adb675d7194c91ff9105da19e9081c5fb` |
| `layout-left.svg` | `edf78687d1ecf135b34d7892a9a950f907f77361` |
| `code-brackets-square.svg` | `19596ab04abdc7ad96bc66bcc53643be055d6a57` |
| `repository.svg` | `097d11ab407d12fa0e662199237cf60f452d8b27` |
| `open-book.svg` | `8cfbd822bac357a07adb367dde77ed6b343e3b1b` |

The app entry uses the original [unset.sh marks](https://github.com/unset-sh/brand/tree/08ecda2dcdbd8eb44b5262887cc215d501a59db6/logo)
from the brand repository at a pinned commit. The light and dark files are
referenced unchanged and keep their intrinsic proportions and brand licence.

[Brand guidelines](https://github.com/unset-sh/brand/blob/08ecda2dcdbd8eb44b5262887cc215d501a59db6/guidelines/brand.md)
define the colours and mark usage. The mark has its own
[asset licence](https://github.com/unset-sh/brand/blob/08ecda2dcdbd8eb44b5262887cc215d501a59db6/LICENSE-ASSETS.md);
it is not an Iconoir icon.

repos.json selects each icon from the renderer's closed list. Decorative
images have empty alt text beside visible labels and use picture elements
to avoid GitHub adding separate image links. Relative icon paths follow
the README's branch in previews.
