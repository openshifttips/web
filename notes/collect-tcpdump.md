---

title: Collecting a tcpdump from a pod

tags: 
 - Openshift 4
 - Networking
 - Troubleshooting
 - tcpdump

emoji: 🔌

---


# Collecting a tcpdump from a pod using only `oc`

1. Identify the namespace and pod that you wish to trace.

2. Determine the tcpdump filter and/or parameters you wish to use.

3. Modify the script below to match the desired namespace, pod, and tcpdump parameters to use.  

Note: `tcpdump` will output data to the console.

~~~
TRACE_NS=openshift-dns
TRACE_POD=dns-default-4mqsd

run_on_host() {
    oc debug node/$NODE -- chroot /host $@
}

run_in_toolbox() {
    oc debug node/$NODE -- $@
}

NODE=`oc get pod -n $TRACE_NS $TRACE_POD -o=jsonpath='{.spec.nodeName}'`

CID=`oc get pods -n $TRACE_NS $TRACE_POD --template '{{printf "%.21s" (index .status.containerStatuses 0).containerID}}{{"\n"}}' | sed -e 's|cri-o://||'`
PID=$(run_on_host crictl inspect -o yaml $CID | grep 'pid:' | awk '{print $2}')
run_in_toolbox nsenter -n -t $PID -- tcpdump -nn port 53 | tee tcpdump.log
~~~

# Collecting a pcap

Collecting a pcap is a very similar process.  The primary different is storing the pcap to the node and then copying it back.  For example:

~~~
run_in_toolbox nsenter -n -t $PID -- tcpdump -s 65535 -w /host/tmp/out.pcap
run_in_toolbox cat /host/tmp/out.pcap > out.pcap
~~~



