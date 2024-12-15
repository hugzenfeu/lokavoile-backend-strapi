#!/bin/bash
source scripts/failover/venv/bin/activate
pip install -r scripts/failover/requirements.txt
python -u scripts/failover/Failover.py
deactivate