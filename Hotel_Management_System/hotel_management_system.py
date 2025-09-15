from dataclasses import dataclass, field
from typing import List, Optional
from enum import Enum
from datetime import date

@dataclass
class Location:
    pin: int
    street: str
    area: str
    city: str
    country: str

class RoomType(Enum):
    STANDARD = "STANDARD"
    DELUXE = "DELUXE"
    FAMILY = "FAMILY"

class RoomStatus(Enum):
    BOOKED = "BOOKED"
    AVAILABLE = "AVAILABLE"
    RESERVED = "RESERVED"

@dataclass
class RoomKey:
    keyId: int
    isActive: bool
    isMaster: bool

    def assignRoom(self, room: 'Room'):
        pass

class AccountStatus(Enum):
    ACTIVE = "ACTIVE"
    BLOCKED = "BLOCKED"
    CLOSED = "CLOSED"

@dataclass
class Account:
    id: int
    username: str
    password: str
    accountStatus: AccountStatus

@dataclass
class Person:
    id: int
    name: str
    account: Account

@dataclass
class HouseKeeper(Person):
    def getRoomServiced(self, date: date):
        return []


@dataclass
class HouseKeepingLog:
    description: str
    startDate: date
    duration: int
    houseKeeper: HouseKeeper

    def updateLogs(self, room: 'Room'):
        room.houseKeepingLogs.append(self)

@dataclass
class Room:
    roomId: int
    roomType: RoomType
    roomStatus: RoomStatus
    price: float
    roomKeys: List[RoomKey]
    houseKeepingLogs: List[HouseKeepingLog]


@dataclass
class Search:
    def searchRooms(self, roomType: RoomType, startDate: date, duration: int) -> List[Room]:
        return []

@dataclass
class Book:
    def bookRoom(self, guestInfo: 'Guest'):
        pass
    
    def cancelRoom(self, geustInfo: 'Guest'):
        pass

@dataclass
class Guest(Person):
    search: Search
    book: Book

    def getAllRooms(self, room: 'Room'):
        pass

@dataclass
class Admin(Person):
    def addRoom(self, roomDetails: 'Room'):
        pass

    def removeRoom(self, roomDetails: 'Room'):
        pass

    def editRoom(self, roomDetails: 'Room'):
        pass

class BookingStatus(Enum):
    BOOKED = "BOOKED"
    RESERVED = "RESERVED"
    CANCELED = "CANCELED"

class BaseRoomCharge:
    def getCost(self) -> float:
        raise NotImplementedError

@dataclass
class RoomCharge(BaseRoomCharge):
    cost: float
    def getCost(self) -> float:
        return self.cost
    
    def setCost(self, cost: float):
        self.cost = cost

@dataclass
class RoomServiceCharge(BaseRoomCharge):
    cost: float
    base_room_charge: BaseRoomCharge

    def getCost(self) -> float:
        self.base_room_charge.setCost(self.base_room_charge.getCost() + self.cost)
        return self.base_room_charge.getCost()

@dataclass
class InRoomPurchase(BaseRoomCharge):
    cost: float
    base_room_charge: BaseRoomCharge

    def getCost(self) -> float:
        self.base_room_charge.setCost(self.base_room_charge.getCost() + self.cost)
        return self.base_room_charge.getCost()

@dataclass
class RoomBooking:
    bookingId: int
    startDate: date
    duration: int
    bookingStatus: BookingStatus
    guestInfo: List['Guest']
    roomInfo: List[Room]
    totalCharge: BaseRoomCharge

@dataclass
class Receptionist(Person):
    search: Search
    book: Book

    def checkIn(self, guestInfo: 'Guest', bookingInfo: RoomBooking):
        pass

    def checkOut(self, guestInfo: 'Guest', bookingInfo: RoomBooking):
        pass

@dataclass
class Hotel:
    id: int
    name: str
    location: Location
    roomList: List[Room] = field(default_factory=list)
