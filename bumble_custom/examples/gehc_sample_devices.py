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
import random
import string
import sys
import os
import logging
import json

from bumble.device import Device, Connection, DeviceConfiguration, AdvertisingParameters, AdvertisingEventProperties
from bumble.core import AdvertisingData
from bumble.transport import open_transport_or_link
from bumble.gatt import (
    Service,
    Characteristic,
    CharacteristicValue,
    Descriptor,
    GATT_CHARACTERISTIC_USER_DESCRIPTION_DESCRIPTOR,
    GATT_MANUFACTURER_NAME_STRING_CHARACTERISTIC,
    GATT_DEVICE_INFORMATION_SERVICE,
)

SERVICE_PATIENTSYNC_UUID = '50DB505C-8AC4-4738-8448-3B1D9CC09CC5'
CHAR_CUR_ROOM_UUID = 'EB6E7163-A3EA-424B-87B4-F63EB8CCB65A'
CHAR_CUR_PATIENT_UUID = '6DF4D135-1F8A-409E-BCA4-5265DA56DF4F'
CHAR_LAST_EDIT_TIME_UUID = '2727FACF-E0EC-4667-9799-BE56C80AB5B5'
CHAR_LAST_EDIT_USER_ID_UUID = '6A083CD6-A9D6-41A7-A9C5-B4C9C42D7FC8'
CUSTOM_DATA_ROOM_MAX_BYTES = 15

# -----------------------------------------------------------------------------

class SampleDevicePersistedData:
    DEVICE_PROPERTIES = ["device_name", "cur_room", "cur_patient_mrn", "last_edit_time", "last_edit_user_id"]
    DEVICE_WRITABLE_PROPERTIES = ["cur_room", "cur_patient_mrn", "last_edit_time", "last_edit_user_id"]
    DEVICE_UUID_MAPPINGS = {
        CHAR_CUR_ROOM_UUID: 'cur_room',
        CHAR_CUR_PATIENT_UUID: 'cur_patient_mrn',
        CHAR_LAST_EDIT_TIME_UUID: 'last_edit_time',
        CHAR_LAST_EDIT_USER_ID_UUID: 'last_edit_user_id'
    }

    def __init__(self, device_name: str):
        if not device_name or len(device_name) < 3:
            raise f'Must supply device name >= 3 chars long'

        self.save_path = None
        self.data = dict()
        self.data["device_name"] = device_name
        self.data["cur_room"] = "-1"
        self.data["cur_patient_mrn"] = "-1"
        self.data["last_edit_time"] = "-1"
        self.data["last_edit_user_id"] = "-1"

    ### Properties ###
    # https://docs.python.org/3/library/functions.html#property
 
    @property
    def device_name(self):
        return self.data["device_name"]

    @device_name.setter
    def device_name(self, value: bytes):
        self.data["device_name"] = str(value)
    
    @property
    def cur_room(self):
        return self.data["cur_room"]
    
    @cur_room.setter
    def cur_room(self, value):
        self.data["cur_room"] = str(value)
    
    @property
    def cur_patient_mrn(self):
        return self.data["cur_patient_mrn"]

    @cur_patient_mrn.setter
    def cur_patient_mrn(self, value):
        self.data["cur_patient_mrn"] = str(value)

    @property
    def last_edit_time(self):
        return self.data["last_edit_time"]

    @last_edit_time.setter
    def last_edit_time(self, value):
        self.data["last_edit_time"] = str(value)

    @property
    def last_edit_user_id(self):
        return self.data["last_edit_user_id"]

    @last_edit_user_id.setter
    def last_edit_user_id(self, value):
        self.data["last_edit_user_id"] = str(value)

    ### Methods

    def load_from_file(self, save_path: str, default_on_not_found: bool = True):
        if not os.path.exists(save_path):
            if not default_on_not_found:
                raise f'Invalid save path: \'{save_path}\' cannot be found or does not exist'
            else:
                print(f'File {save_path} not found, continuing with default properties')
                self.save_path = save_path
                self.save_to_disk()
        
        self.save_path = save_path
        with open(self.save_path, 'r', encoding='utf-8') as file:
            parsed = json.load(file)

            print(f'Loaded the following configuration for device \'{self.device_name}\':\n{parsed}')

            for prop in self.DEVICE_PROPERTIES:
                setattr(self, prop, parsed[prop] or "-1")

    def save_to_disk(self):
        # https://www.w3schools.com/python/python_file_write.asp
        with open(self.save_path, 'w', encoding='utf-8') as file:
            json.dump(self.data, file, sort_keys=True, indent=4)
            print(f'Wrote the following configuration to \'{self.save_path}\':\n{self.data}')

# -----------------------------------------------------------------------------

class Listener(Device.Listener, Connection.Listener):
    def __init__(self, device):
        self.device = device

    def on_connection(self, connection):
        print(f'=== Connected to {connection}')
        connection.listener = self

    def on_disconnection(self, reason):
        print(f'### Disconnected, reason={reason}')

# -----------------------------------------------------------------------------

async def update_device_advertising_data(dev: Device, data: SampleDevicePersistedData):
    if dev.extended_adv_set != None:
        extended_adv_data = create_extended_advertising_data(dev, data)
        advertising_data = bytes(extended_adv_data)
        await dev.extended_adv_set.set_advertising_data(advertising_data)
        print("Updated extended advertising data:", advertising_data)

    if dev.legacy_adv_set != None:
        legacy_adv_data = create_legacy_advertising_data(dev, data)
        advertising_data = bytes(legacy_adv_data)
        await dev.legacy_adv_set.set_advertising_data(advertising_data)
        print("Updated legacy advertising data:", advertising_data)

def construct_reader(data: SampleDevicePersistedData, prop: str):
    def tmp(connection: Connection):
            print(f'----- READ PROPERTY {prop} FROM', connection.peer_address or connection)
            return bytes(getattr(data, prop), 'ascii')
    return tmp

def construct_readers(data: SampleDevicePersistedData):
    readers = dict()
    for prop in SampleDevicePersistedData.DEVICE_PROPERTIES:
        readers[prop] = construct_reader(data, prop)
    return readers

def construct_writer(dev: Device, data: SampleDevicePersistedData, prop: str):
    async def tmp(connection: Connection, value: bytes):
        value = value.decode("utf-8")
        print(f'----- WRITE PROPERTY {prop} = {value} FROM', connection.peer_address or connection)
        setattr(data, prop, value)

        if prop == 'cur_room' or prop == 'cur_patient_mrn':
            await update_device_advertising_data(dev, data)
            
        data.save_to_disk()
    return tmp

def construct_writers(dev: Device, data: SampleDevicePersistedData):
    writers = dict()
    for prop in SampleDevicePersistedData.DEVICE_PROPERTIES:
        writers[prop] = construct_writer(dev, data, prop)
    return writers

# def read_patient(connection):
#     print('----- READ PATIENT from', connection)
#     return bytes(f'Sample patient {connection}', 'ascii')

# def write_patient(connection, value):
#     print(f'----- WRITE PATIENT FROM {connection}: {value}')
    
# def my_custom_read_with_error(connection):
#     print('----- READ from', connection, '[returning error]')
#     if connection.is_encrypted:
#         return bytes([123])

#     raise ATT_Error(ATT_INSUFFICIENT_ENCRYPTION_ERROR)

# def my_custom_write_with_error(connection, value):
#     print(f'----- WRITE from {connection}: {value}', '[returning error]')
#     if not connection.is_encrypted:
#         raise ATT_Error(ATT_INSUFFICIENT_ENCRYPTION_ERROR)

# -----------------------------------------------------------------------------

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

def construct_characteristics(device: Device, data: SampleDevicePersistedData, uuid_map: dict[str: str]) -> list[Characteristic]:
    characteristics = []
    readers = construct_readers(data)
    writers = construct_writers(device, data)
    for uuid in uuid_map:
        prop = uuid_map[uuid]
        char = Characteristic(
            uuid,
            Characteristic.Properties.READ | Characteristic.Properties.WRITE,
            Characteristic.READABLE | Characteristic.WRITEABLE,
            CharacteristicValue(read=readers[prop], write=writers[prop]),
        )
        characteristics.append(char)
    return characteristics

def create_extended_advertising_data(device: Device, data: SampleDevicePersistedData):
    flags = AdvertisingData.LE_GENERAL_DISCOVERABLE_MODE_FLAG | AdvertisingData.BR_EDR_NOT_SUPPORTED_FLAG

    # custom_data: variable length of bytes total, first byte is 1 if patient is connected (mrn is != -1), 0 otherwise; rest of bytes are encoded room string
    is_patient_associated = (0x0 if int(data.cur_patient_mrn) == -1 else 0x1).to_bytes()
    encoded_room_string = bytes(data.cur_room.encode("utf-8"))
    custom_data = is_patient_associated + encoded_room_string

    advertising_data = AdvertisingData(
        [
            (AdvertisingData.FLAGS, chr(flags).encode("utf-8")),
            (AdvertisingData.COMPLETE_LOCAL_NAME, device.config.name.encode("utf-8")),
            # TODO: Generic-ify this to depend on `SERVICE_PATIENTSYNC_UUID`
            (AdvertisingData.COMPLETE_LIST_OF_128_BIT_SERVICE_CLASS_UUIDS, bytes(reversed(b'\x50\xDB\x50\x5C\x8A\xC4\x47\x38\x84\x48\x3B\x1D\x9C\xC0\x9C\xC5'))),
            (AdvertisingData.MANUFACTURER_SPECIFIC_DATA, custom_data)
        ]
    )
    
    return advertising_data

def create_legacy_advertising_data(device: Device, data: SampleDevicePersistedData):
    flags = AdvertisingData.LE_GENERAL_DISCOVERABLE_MODE_FLAG | AdvertisingData.BR_EDR_NOT_SUPPORTED_FLAG

    # custom_data: variable length of bytes total, first byte is 1 if patient is connected (mrn is != -1), 0 otherwise; rest of bytes are encoded room string
    # TODO: Adapt this to limit name length, and include custom data
    is_patient_associated = (0x0 if int(data.cur_patient_mrn) == -1 else 0x1).to_bytes()
    encoded_room_string = bytes(data.cur_room.encode("utf-8"))
    custom_data = is_patient_associated + encoded_room_string

    advertising_data = AdvertisingData(
        [
            (AdvertisingData.FLAGS, chr(flags).encode("utf-8")),
            (AdvertisingData.COMPLETE_LOCAL_NAME, device.config.name.encode("utf-8")),
        ]
    )

    return advertising_data

async def run_device(config: DeviceConfiguration, persisted_data: SampleDevicePersistedData):
    # https://github.com/google/bumble/blob/c65188dcbfa995b4580375498c47b37a18e792e9/examples/run_extended_advertiser_2.py#L31
    async with await open_transport_or_link(sys.argv[2]) as (hci_source, hci_sink):
        print('<<< connected')

        device = Device.from_config_with_hci(config, hci_source, hci_sink)
        device.listener = Listener(device)

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

        device_info_service = Service(GATT_DEVICE_INFORMATION_SERVICE, [manufacturer_name_characteristic])
        other_characteristics = construct_characteristics(device, persisted_data, SampleDevicePersistedData.DEVICE_UUID_MAPPINGS)

        patientsync_service = Service(SERVICE_PATIENTSYNC_UUID, other_characteristics)
        device.add_services([device_info_service, patientsync_service])

        await device.power_on()

        extended_adv_data = create_extended_advertising_data(device, persisted_data)
        device.extended_adv_set = await device.create_advertising_set(
            advertising_parameters=AdvertisingParameters(
                advertising_event_properties=AdvertisingEventProperties(
                    is_connectable=True,
                )
            ),
            advertising_data=bytes(extended_adv_data),
            random_address=config.address,
            auto_start=True,
            auto_restart=True
        )
        device.legacy_adv_set = None

        enable_legacy_advertising_set = True

        if enable_legacy_advertising_set:
            legacy_adv_data = create_legacy_advertising_data(device, persisted_data)
            device.legacy_adv_set = await device.create_advertising_set(
                advertising_parameters=AdvertisingParameters(
                    advertising_event_properties=AdvertisingEventProperties(
                        is_connectable=True,
                        is_legacy=True,
                        is_scannable=True,
                    )
                ),
                advertising_data=bytes(legacy_adv_data),
                random_address=config.address,
                auto_start=True,
                auto_restart=True
            )

        print('Device started, waiting for HCI termination...')
        await hci_source.wait_for_termination()
        print('HCI terminated!')

async def main():
    if len(sys.argv) < 3:
        print(
            'Usage: run_gatt_server.py <device-config> <transport-spec> (device-data-dir)'
            '[<bluetooth-address>]'
        )
        print('example: run_gatt_server.py device1.json usb:0 E1:CA:72:48:C4:E8')
        return

    print('<<< connecting to HCI...')

    # Create device data dir if not exists
    device_data_dir = None
    if len(sys.argv) >= 4:
        device_data_dir = sys.argv[3]
        if not os.path.exists(device_data_dir):
            os.makedirs(device_data_dir)

    configs = []
    with open(sys.argv[1], 'r', encoding='utf-8') as file:
        parsed = json.load(file)
        for entry in parsed:
            config = DeviceConfiguration()
            config.load_from_dict(entry)

            if not config.name:
                # https://stackoverflow.com/questions/2257441/random-string-generation-with-upper-case-letters-and-digits
                generated = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(8))
                entry["name"] = f'Sample device {generated}'
                print(f'Device with address \'{config.address}\' has no name, using generated name: \'{config.name}\'')

            config = DeviceConfiguration()
            config.load_from_dict(entry)

            data = SampleDevicePersistedData(config.name)

            if device_data_dir:
                device_path = device_data_dir + os.sep + config.name.replace(" ", "_") + ".json"
                data.load_from_file(device_path)

                for prop in SampleDevicePersistedData.DEVICE_PROPERTIES:
                    if prop in entry:
                        setattr(data, prop, entry[prop])

                data.save_to_disk()

            configs.append((config, data))

            # DEBUG:
            break
            
    
    await asyncio.gather(*[run_device(i[0], i[1]) for i in configs])


# -----------------------------------------------------------------------------
logging.basicConfig(level=os.environ.get('BUMBLE_LOGLEVEL', 'DEBUG').upper())
asyncio.run(main())
