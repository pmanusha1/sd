from dataclasses import dataclass
from typing import List
from enum import Enum

@dataclass
class Elevator:
    id: int
    location: "Address"
    currentFloor: int
    direction: "Direction"
    requests: List["Request"]
    blockedFloors: List["Floor"]
    floors: List["Floor"]
    
    def setDirection(self, direction):
        self.direction = direction
        print(f"Elevator direction set to {direction.value}")
    
    def getDirection(self):
        return self.direction
    
    def addRequest(self, request):
        if  not any(r.sourceFloor == request.sourceFloor for r in self.requests):
            self.requests.append(request)
            print(f"Request added for floor {request.sourceFloor}")

        elif request.sourceFloor in self.blockedFloors:
            print(f"Floor {request.sourceFloor} is blocked. Cannot add to requests.")
    
    def move(self):
        if not self.requests:
            print("No requests in queue. Elevator is idle.")
            self.direction = Direction.idle
            return
        
        request = self.requests.pop(0)
        print(f"Elevator moving from floor {self.currentFloor} to floor {request.sourceFloor}")

        self.currentFloor = request.sourceFloor
        print(f"Elevator arrived at floor {self.currentFloor}")

        if request.destinationFloor is not None:
            print(f"Destination floor {request.destinationFloor}")
            print(f"Elevator moving from {request.sourceFloor} to {request.destinationFloor}")
            self.currentFloor = request.destinationFloor
            print(f"Elevator arrived at {self.currentFloor}")

        self.direction = Direction.idle

    def blockFloor(self, floorNum):
        self.blockedFloors.append(floorNum)
        print(f"Floor {floorNum} has been blocked.")
    
    def unBlockFloor(self, floorNum):
        self.blockedFloors.remove(floorNum)
        print(f"Floor {floorNum} has been unblocked.")

    def addFloor(self, floor):
        self.floors.append(floor)
    
    def removeFloor(self, floor):
        self.floors = [f for f in self.floors if f.id != floor.id]

class Direction(Enum):
    up = 'up'
    down = 'down'
    idle = 'idle'

@dataclass
class Address:
    block: str
    building: str

@dataclass
class Floor:
    id: int
    blocked: bool = False

@dataclass
class Request:
    id: int
    sourceFloor: int
    direction: Direction
    destinationFloor: int = None

@dataclass
class User:
    
    def giveDirection(self, elevator, direction, curFloor):
        print(f"User at floor {curFloor} wants to go {direction.value}.")
        if elevator.direction == direction or elevator.direction == Direction.idle:
            request = Request(id = len(elevator.requests) + 1, sourceFloor=curFloor, direction=direction)
            elevator.addRequest(request)
            elevator.setDirection(direction)
            return request
        else:
            print("Elevator is going in the opposite direction. Waiting until it returns...")
    
    def selectDestination(self, elevator, destFloor):
        print(f"User selects destination floor {destFloor}.")
        if elevator.requests:
            elevator.requests[0].destinationFloor = destFloor
            elevator.move()
        else:
            print("No active requests")

@dataclass
class Admin(User):
    id: int
    name: str

    def addFloor(self, elevator, floor):
        elevator.addFloor(floor)
        print(f"Admin {self.name} added floor {floor.id}.")
    
    def removeFloor(self, elevator, floor):
        elevator.removeFloor(floor)
        print(f"Admin {self.name} removed floor {floor.id}.")
    
    def blockFloor(self, elevator, floorNum):
        elevator.blockFloor(floorNum)
    
    def unBlockFloor(self, elevator, floorNum):
        elevator.unBlockFloor(floorNum)


address = Address('s8', 'wipro')

curFloor = 0
direction = Direction.up

elevator = Elevator(999, address, curFloor, Direction.idle, [], [], [])

user = User()
admin = Admin(123, 'admin')

f1 = Floor(1)
f2 = Floor(2)
f3 = Floor(3)

admin.addFloor(elevator, f1)
admin.addFloor(elevator, f2)
admin.addFloor(elevator, f3)

admin.blockFloor(elevator, f2)

request = user.giveDirection(elevator, Direction.up, curFloor)

if request:
    user.selectDestination(elevator, 3)

admin.unBlockFloor(elevator, f2)

request2 = user.giveDirection(elevator, Direction.up, curFloor)

if request2:
    user.selectDestination(elevator, 2)

