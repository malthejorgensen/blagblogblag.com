---
layout: post
title: Macbook Pro backlight on Arch Linux
---
I recently installed Arch Linux on my Macbook Pro.
In order to control the screen brightness I installed [nvidia-bl][nvidia-bl-aur]
from the AUR (I use _yaourt_ so: `yaourt -S nvidia-bl`). This sets up a folder in
`/sys/class/backlight/nvidia_backlight` and in this folder you can get and set the
screen brightness via the file `brightness`:

    > cat brightness
    1000
    > sudo su
    # echo 500 > brightness

But after a system update (`pacman -Syu`) the
`/sys/class/backlight/nvidia_backlight` folder was gone and I could no longer
change the brightness.

By running `dmesg` I could see that the `nvidia_bl` kernel module was not being
loaded during boot:

    [    7.183486] nvidia_bl: disagrees about version of symbol module_layout

Trying to load it manually also failed:

    > sudo modprobe -v nvidia-bl
    insmod /lib/modules/3.12.7-2-ARCH/extramodules/nvidia_bl.ko
    modprobe: ERROR: could not insert 'nvidia_bl': Exec format error

These errors mean that the kernel module is not compatible with the kernel.
This can be solved by recompiling the kernel module. Since I use _yaourt_ I can
simply reinstall _nvidia-bl_: `yaourt -S nvidia-bl`.

After that you can manually load the kernel module again:

    > sudo modprobe -v nvidia-bl
    insmod /lib/modules/3.12.7-2-ARCH/extramodules/nvidia_bl.ko

And you can now control the brightness again :)

[nvidiabl]: https://github.com/guillaumezin/nvidiabl
[nvidia-bl-aur]: https://aur.archlinux.org/packages/nvidia-bl/

> Note: I use a Aluminium Unibody Macbook Pro 5,5 from 2008
