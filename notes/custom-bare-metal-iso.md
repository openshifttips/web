# Custom ISO for Quick Bare Metal Installations

1. Obtain the bare metal installation ISO from mirror.openshift.com

2. Mount the ISO
~~~
sudo mount -t iso9660 -o loop install_iso.iso /mnt/rhcos_install_iso
~~~

3. The ISO is read-only.  To make changes the contents of the ISO must be copied to a another directory which has read/write permissions
~~~
cp -r /mnt/rhcos_install_iso/* /tmp/working-dir
~~~

4. Edit `isolinux/isolinux.cfg` to add menu entries corresponding to the kernel argument required to ignite your nodes.  For example:

~~~
label bootstrap
  menu label ^Install RHEL CoreOS - bootstrap 
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/bootstrap.ign ip=192.168.58.150::192.168.58.1:255.255.255.0:bootstrap:ens3:none nameserver=192.168.58.24

label master0
  menu label ^Install RHEL CoreOS - master-0
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/master.ign ip=192.168.58.151::192.168.58.1:255.255.255.0:master-0:ens3:none nameserver=192.168.58.24

label master1
  menu label ^Install RHEL CoreOS - master-1
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/master.ign ip=192.168.58.152::192.168.58.1:255.255.255.0:master-1:ens3:none nameserver=192.168.58.24

label master2
  menu label ^Install RHEL CoreOS - master-2
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/master.ign ip=192.168.58.153::192.168.58.1:255.255.255.0:master-2:ens3:none nameserver=192.168.58.24

label worker0
  menu label ^Install RHEL CoreOS - worker-0
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/worker.ign ip=192.168.58.160::192.168.58.1:255.255.255.0:worker-0:ens3:none nameserver=192.168.58.24

label worker1
  menu label ^Install RHEL CoreOS - worker-1
  kernel /images/vmlinuz
  append initrd=/images/initramfs.img nomodeset rd.neednet=1 coreos.inst=yes coreos.inst.install_dev=sda coreos.inst.image_url=http://192.168.58.24:9000/img.raw.gz coreos.inst.ignition_url=http://192.168.58.24:9000/worker.ign ip=192.168.58.161::192.168.58.1:255.255.255.0:worker-1:ens3:none nameserver=192.168.58.24
~~~

5. Create an updated ISO
~~~
mkisofs -o custom_rhcos.iso -b isolinux/isolinux.bin -c isolinux/boot.cat -no-emul-boot -boot-load-size 4 -boot-info-table -J -R -V "RHCOS $instance ISO" /tmp/working-dir
~~~

The ISO can now be burned to a physical CD or used to boot a virtual machine.
