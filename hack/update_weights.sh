#!/bin/bash

weight=10
for f in $(ls -d content/*/ | sort); do
	sed -i -r 's/weight: ([0-9]+)/weight: '$weight'/g' ${f}/_index.md
	((weight=weight+1))
done
