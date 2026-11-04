# GitHub profile README

These files are the profile README, styled like the site. Nothing here has been pushed.

1. Create a public repo named exactly after the account it's for (for example `jtmoot/jtmoot`).
2. Copy `README.md`, `banner-light.svg` and `banner-dark.svg` into its root and push.

The banner is an image, so its text is drawn as outlines and can't be edited by hand. To
change the font, stop lowercasing, or edit the name, role, intro or poster:

```bash
pip install fonttools brotli pillow
# edit the settings at the top of tools/readme/make_banner.py, then:
python tools/readme/make_banner.py
```

That rewrites both banners here. The links live in `README.md`, because GitHub doesn't
allow links inside images.
