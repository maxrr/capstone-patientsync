# Copyright 2021-2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# -----------------------------------------------------------------------------
# Imports
# -----------------------------------------------------------------------------
import asyncio
import struct
import sys
import os
import logging
import json
import uuid
import binascii

from bumble.device import Device, Connection, DeviceConfiguration
from bumble.transport import open_transport_or_link
from bumble.att import ATT_Error, ATT_INSUFFICIENT_ENCRYPTION_ERROR
from bumble.gatt import (
    Service,
    Characteristic,
    CharacteristicValue,
    Descriptor,
    GATT_CHARACTERISTIC_USER_DESCRIPTION_DESCRIPTOR,
    GATT_MANUFACTURER_NAME_STRING_CHARACTERISTIC,
    GATT_DEVICE_INFORMATION_SERVICE,
)


# -----------------------------------------------------------------------------
class Listener(Device.Listener, Connection.Listener):
    def __init__(self, device):
        self.device = device

    def on_connection(self, connection):
        print(f'=== Connected to {connection}')
        connection.listener = self

    def on_disconnection(self, reason):
        print(f'### Disconnected, reason={reason}')


def read_room(connection):
    print('----- READ ROOM from', connection)
    return bytes(f'Sample room {connection}', 'ascii')


def write_room(connection, value):
    print(f'----- WRITE ROOM from {connection}: {value}')

def read_patient(connection):
    print('----- READ PATIENT from', connection)
    return bytes(f'Sample patient {connection}', 'ascii')

def write_patient(connection, value):
    print(f'----- WRITE PATIENT FROM {connection}: {value}')
    
def my_custom_read_with_error(connection):
    print('----- READ from', connection, '[returning error]')
    if connection.is_encrypted:
        return bytes([123])

    raise ATT_Error(ATT_INSUFFICIENT_ENCRYPTION_ERROR)


def my_custom_write_with_error(connection, value):
    print(f'----- WRITE from {connection}: {value}', '[returning error]')
    if not connection.is_encrypted:
        raise ATT_Error(ATT_INSUFFICIENT_ENCRYPTION_ERROR)


# -----------------------------------------------------------------------------

SERVICE_PATIENTSYNC_UUID = '50DB505C-8AC4-4738-8448-3B1D9CC09CC5'
CHAR_CUR_ROOM_UUID = 'EB6E7163-A3EA-424B-87B4-F63EB8CCB65A'
CHAR_CUR_PATIENT_UUID = '6DF4D135-1F8A-409E-BCA4-5265DA56DF4F'

def encode_to_hex_str(s: str) -> str:
    acc = ""
    for c in s:
        acc += num_to_hex_byte(ord(c))
    return acc

def num_to_hex_byte(n: int, base: int = 16) -> str:
    return format(int(n), "02x")

def prepare_uuid(s: str) -> str:
    acc = ""
    if (len(s) % 2 != 0):
        raise "String length not divisible by two"
    
    for i in range(len(s) - 2, -1, -2):
            segment = s[i:i+2]
            # print(i, segment)
            acc += segment
    return acc

def generate_advertisement_data(name, services: list[str]):
    # The elements composed in these fields https://stackoverflow.com/questions/27506474/how-to-byte-swap-a-32-bit-integer-in-python

    # format: (type, content); content is unreversed
    intro = (0x1, '06', 2)
    joined_services = "".join(list(map(lambda a : prepare_uuid(a.replace("-", "")), services))).lower()
    complete_list_of_services = (0x7, joined_services)
    complete_local_name = (0x9, encode_to_hex_str(name))

    to_include = [intro, complete_list_of_services, complete_local_name]
    acc = ""
    for entry in to_include:
        entry_type = num_to_hex_byte(entry[0])
        entry_content = entry[1]
        entry_content_len = len(entry_content) / 2 + 1
        entry_content_len_bytes = num_to_hex_byte(entry_content_len)
        if len(entry) > 2:
            entry_content_len_bytes = num_to_hex_byte(entry[2])

        print(f'adding type {entry_type} with length {entry_content_len} ({entry_content_len_bytes}): {entry_content}')
        # print(type(entry_type), type(entry_content), type(entry_content_len_bytes))

        # acc += entry_content_len_bytes + entry_type + entry_content
        acc += entry_content_len_bytes + entry_type + entry_content

    acc = str(acc)
    # for i, c in enumerate(acc):
    #     print(i, c)
    print(acc)
    return acc

async def run_device(config):
    async with await open_transport_or_link(sys.argv[2]) as (hci_source, hci_sink):
        print('<<< connected')

        device = Device.from_config_with_hci(config, hci_source, hci_sink)
        device.listener = Listener(device)
        # Create a device to manage the host
        # device = Device.from_config_file_with_hci(sys.argv[1], hci_source, hci_sink)
        # device.listener = Listener(device)

        # Add a few entries to the device's GATT server
        descriptor = Descriptor(
            GATT_CHARACTERISTIC_USER_DESCRIPTION_DESCRIPTOR,
            Descriptor.READABLE,
            'An example Connect+ device for use in prototyping.',
        )
        manufacturer_name_characteristic = Characteristic(
            GATT_MANUFACTURER_NAME_STRING_CHARACTERISTIC,
            Characteristic.Properties.READ,
            Characteristic.READABLE,
            'The Bar Coders',
            [descriptor],
        )
        device_info_service = Service(
            GATT_DEVICE_INFORMATION_SERVICE, [manufacturer_name_characteristic]
        )

        print(">>>>ATTN!!", GATT_DEVICE_INFORMATION_SERVICE)
        patientsync_service = Service(
            SERVICE_PATIENTSYNC_UUID,
            [
                Characteristic(
                    CHAR_CUR_ROOM_UUID,
                    Characteristic.Properties.READ | Characteristic.Properties.WRITE,
                    Characteristic.READABLE | Characteristic.WRITEABLE,
                    CharacteristicValue(read=read_room, write=write_room),
                ),
                Characteristic(
                    CHAR_CUR_PATIENT_UUID,
                    Characteristic.Properties.READ | Characteristic.Properties.WRITE,
                    Characteristic.READABLE | Characteristic.WRITEABLE,
                    CharacteristicValue(read=read_patient, write=write_patient),
                ),
                # Characteristic(
                #     '552957FB-CF1F-4A31-9535-E78847E1A714',
                #     Characteristic.Properties.READ | Characteristic.Properties.WRITE,
                #     Characteristic.READABLE | Characteristic.WRITEABLE,
                #     CharacteristicValue(
                #         read=my_custom_read_with_error, write=my_custom_write_with_error
                #     ),
                # ),
                # Characteristic(
                #     '486F64C6-4B5F-4B3B-8AFF-EDE134A8446A',
                #     Characteristic.Properties.READ | Characteristic.Properties.NOTIFY,
                #     Characteristic.READABLE,
                #     'hello',
                # ),
            ],
        )
        device.add_services([device_info_service, patientsync_service])

        print('\nservices:')
        for service in device.gatt_server.services:
            print('\t', service)
        print()

        # print("gatt server attributes:")
        # for attribute in device.gatt_server.attributes:
        #     if isinstance(attribute, Service):
        #         print(attribute, attribute.get_advertising_data()) 

        # print("gatt server advertising service data:")
        # print(device.gatt_server.get_advertising_service_data())

        # Debug print
        for attribute in device.gatt_server.attributes:
            print(attribute)

        # Get things going
        await device.power_on()

        # Connect to a peer
        if len(sys.argv) > 3:
            target_address = sys.argv[3]
            print(f'=== Connecting to {target_address}...')
            await device.connect(target_address)
        else:
            await device.start_advertising(auto_restart=True)
            # print('done advertising')

        print('waiting for HCI termination...')
        await hci_source.wait_for_termination()
        print('HCI terminated!')

async def main():
    if len(sys.argv) < 3:
        print(
            'Usage: run_gatt_server.py <device-config> <transport-spec> '
            '[<bluetooth-address>]'
        )
        print('example: run_gatt_server.py device1.json usb:0 E1:CA:72:48:C4:E8')
        return

    print('<<< connecting to HCI...')

    configs = []
    with open(sys.argv[1], 'r', encoding='utf-8') as file:
        parsed = json.load(file)
        for entry in parsed:
            config = DeviceConfiguration()
            config.load_from_dict(entry)
            # print(config.advertising_data, type(config.advertising_data))
            
            entry["advertising_data"] = generate_advertisement_data(config.name, [SERVICE_PATIENTSYNC_UUID])
            print(entry)
            config = DeviceConfiguration()
            config.load_from_dict(entry)
            configs.append(config)
    
    await asyncio.gather(*[run_device(i) for i in configs])


# -----------------------------------------------------------------------------
logging.basicConfig(level=os.environ.get('BUMBLE_LOGLEVEL', 'DEBUG').upper())
asyncio.run(main())
