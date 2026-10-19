# Install Debian

Use this page for your complete installation walkthrough. Screenshots can be placed in `docs/assets/` and embedded with normal Markdown.

## Before you begin

- Back up anything important on the target machine.
- Download the installer from the [official Debian website](https://www.debian.org/distrib/).
- Verify the downloaded image before writing it to a USB drive.

!!! warning
    Installing an operating system can erase disks. Make the intended disk and partition layout unambiguous in your final guide.

## Suggested structure

Document your choices in the order a friend sees them:

1. Installer image and USB preparation
2. Firmware/UEFI settings
3. Network and hostname
4. Users and passwords
5. Partitioning and encryption
6. Desktop and package selection
7. Bootloader installation

```sh title="Example: inspect the downloaded checksum"
sha256sum debian-*.iso
```
