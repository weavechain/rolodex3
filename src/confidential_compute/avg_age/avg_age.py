import os, sys
import json
import base64
import traceback
import requests
import urllib
import zipfile
import csv
from io import StringIO
import time
import math

from weaveapi.records import *
from weaveapi.options import *
from weaveapi.weaveh import *

LOCAL_CONFIG = None

organization = "icprolodex"
scope = "rolodex"
table_core_profile = "core_profile"
table_dir_profile = "directory_profile"

nodeApi, session = connect_weave_api(LOCAL_CONFIG)

none_output = { "avg_age": "~~~" }

def compute_avg():
    # get userIds whose age is included in compute
    directory_id=os.environ.get('directoryId')

    directory_id = int(directory_id)
    filter_dir_profiles=Filter(FilterOp.eq("directoryId", directory_id), None, None, None)

    dir_profiles = nodeApi.read(session, scope, table_dir_profile, filter_dir_profiles, READ_DEFAULT_NO_CHAIN).get()
    if "data" not in dir_profiles:
        return none_output
    if len(dir_profiles["data"]) == 0:
        return none_output

    user_ids_with_compute = []
    for dir_profile in dir_profiles["data"]:
        if "birthday" in dir_profile:
            if "true" in dir_profile["birthday"]:
                user_ids_with_compute.append(dir_profile["userId"])

    if len(user_ids_with_compute) == 0:
        return none_output

    # build filter with these userIds
    op = FilterOp.eq("userId", 0)
    for userId in user_ids_with_compute:
        op = FilterOp.opor(op, FilterOp.eq("userId", userId))

    # get core profiles who share for compute
    filter_core_profiles = Filter(op, None, None, None)
    core_profiles = nodeApi.read(session, scope, table_core_profile, filter_core_profiles, READ_DEFAULT_NO_CHAIN).get()

    if "data" not in core_profiles:
        return none_output

    if len(core_profiles["data"]) == 0:
       return none_output

    from datetime import date, timedelta
    from datetime import datetime

    # compute average age
    today_ts = time.time() * 1000
    bday_format = "%Y-%m-%d %H:%M:%S"

    age_sum = 0
    age_count = 0
    for core_profile in core_profiles["data"]:
        if "birthday" in core_profile:
            bday_obj = datetime.strptime(core_profile["birthday"], bday_format)
            bday_ts = bday_obj.timestamp() * 1000
            age_sum += (today_ts - bday_ts)
            age_count += 1

    if age_count == 0:
        return none_output

    avg_age = (age_sum / age_count) / (1000 * 60 * 60 * 24 * 365)
    return { "avg_age": math.floor(avg_age) }

weave_task_output(nodeApi, session, compute_avg())
print("Done.")
