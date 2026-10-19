# Useful commands

Keep frequently used commands here for quick lookup.

## Packages

```sh
apt search <term>              # Search available packages
apt show <package>             # Show package details
sudo apt install <package>     # Install a package
sudo apt remove <package>      # Remove a package
```

## Services

```sh
systemctl status <service>
sudo systemctl enable --now <service>
journalctl -u <service> -e
```

## System information

```sh
cat /etc/debian_version
uname -a
lsblk -f
ip address
```
