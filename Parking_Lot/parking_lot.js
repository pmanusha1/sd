class ParkingLot {
    constructor(name, address, floors = [], entryGates = [], exitGates = []) {
        this.name = name
        this.address = address
        this.floors = floors
        this.entryGates = entryGates
        this.exitGates = exitGates
    }

    isParkingSpotAvailableForVehicle(vechileId) {
        for (const floor of this.floors) {
            for (const spot of floor.parkingSpots) {
                if(spot.vehicle && spot.vehicle.id === vechileId) {
                    return true
                }
            }
        }
        return false
    }
    updateParkingAttendant(attendantId, gateId) {
        for(const gate of this.entryGates) {
            if(gate.id === gateId) {
                gate.attendant = new Attendant(234, `attendant-${attendantId}`, new Payment())
            }
        }

        for(const gate of this.exitGates) {
            if(gate.id === gateId) {
                gate.attendant = new Attendant(567, `attendant-${attendantId}`, new Payment())
            }
        }
    }
}

class Address {
    constructor(pin, street, area, city, country) {
        this.pin = pin
        this.street = street
        this.area = area
        this.city = city
        this.country = country
    }
}

class ParkingFloor {
    constructor(id, isFull, parkingSpots = [], displayBoard) {
        this.id = id
        this.isFull = isFull
        this.parkingSpots = parkingSpots
        this.displayBoard = displayBoard
    }
}

class ParkingSpot {
    constructor(id, isFree, spotType, price, vehicle) {
        this.id = id
        this.isFree = isFree
        this.spotType = spotType
        this.price = price
        this.vehicle = vehicle
    }
}

const SpotType = Object.freeze({
    twoWheeler: "twoWheeler",
    fourWheeler: "fourWheeler"
})

class Vehicle {
    constructor(id, vehicleType, parkingTicket, paymentInfo) {
        this.id = id
        this.vehicleType = vehicleType
        this.parkingTicket = parkingTicket
        this.paymentInfo = paymentInfo
    }
}

const vehicleType = Object.freeze({
    twoWheeler: "twoWheeler",
    fourWheeler: "fourWheeler"
})

class Ticket {
    constructor(id, floorId, spotId, vehicle, entryTime, exitTime, parkingSpotType, cost, parkingTicketStatus) {
        this.id = id
        this.floorId = floorId
        this.spotId = spotId
        this.vehicle = vehicle
        this.entryTime = entryTime
        this.exitTime = exitTime
        this.parkingSpotType = parkingSpotType
        this.cost = cost
        this.parkingTicketStatus = parkingTicketStatus
    }

    updateCost(newCost) {
        this.cost = newCost
    }
    updatevehicleExitTime(exitTime) {
        this.exitTime = exitTime
    }
}

const parkingTicketStatus = Object.freeze({
    active: "active",
    paid: "paid",
    lost: "lost",
    expired: "expired"
})

class DisplayBoard {
    constructor() {
        this.freeSpotsAvailable = new Map()
    }
    updateAvailableSpotInFloor(floorId, count) {
        this.freeSpotsAvailable.set(floorId, count)
    }

    getAvailableSpots(floorId) {
        return this.freeSpotsAvailable.get(floorId)
    }
}

class Gate {
    constructor(id, attendant) {
        this.id = id
        this.attendant = attendant
    }
}

class EntryGate extends Gate {
    constructor(id, attendant) {
        super(id, attendant)
    }

    getParkingTicket(vehicle, parkingLot) {
        return this.attendant.processVehicleEntry(parkingLot, vehicle)
    }
}

class ExitGate extends Gate {
    constructor(id, attendant) {
        super(id, attendant)
    }

    payment(ticket, amount) {
        return this.attendant.processPayment(ticket, amount)
    }
}

class Person {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}

class Admin extends Person {
    constructor(id, name) {
        super(id, name)
    }

    addParkingFloor(parkingLot, floor) {
        parkingLot.floors.push(floor)
    }
    addParkingSpot(parkingLot, floorId, spot) {
        const parkingFloor = parkingLot.floors.find(floor => floor.id === floorId)
        if (parkingFloor) {
            parkingFloor.parkingSpots.push(spot)
        }
    }
    addDisplayBoard(parkingLot, floorId, displayBoard) {
        const floor = parkingLot.floors.find(f => f.id === floorId)
        if(floor) {
            floor.displayBoard = displayBoard
        } else {
            throw new Error(`Floor with ID ${floorId} not found.`)
        }
    }
}

class Attendant extends Person {
    constructor(id, name, paymentService) {
        super(id, name)
        this.paymentService = paymentService
    }

    processVehicleEntry(parkingLot, vehicle) {
        for(const floor of parkingLot.floors) {
            const availableSpot = floor.parkingSpots.find(spot => spot.isFree && spot.spotType === vehicle.vehicleType)
            if(availableSpot) {
                availableSpot.isFree = false
                availableSpot.vehicle = vehicle

                const ticket = new Ticket(
                    Date.now(),
                    floor.id,
                    availableSpot.id,
                    vehicle,
                    new Date(),
                    null,
                    availableSpot.spotType,
                    availableSpot.processPayment,
                    parkingTicketStatus.active
                )

                vehicle.parkingTicket = ticket
                return ticket
            }
            throw new Error("No available parking spots for vehicle type.")
        }
    }
    processPayment(ticket) {
        const exitTime = new Date()

        ticket.updatevehicleExitTime(exitTime)

        const duration = exitTime - new Date(ticket.entryTime)

        const durationInHours = Math.ceil(duration /(1000 * 60 * 60))

        const spot = this.findParkingSpotByTicket(ticket)
        const amount = durationInHours * spot.price

        ticket.updateCost(amount)

        const paymentinfo = new PaymentInfo(
            Date.now(),
            amount,
            new Date(),
            ticket,
            PaymentStatus.success
        )

        ticket.parkingTicketStatus = parkingTicketStatus.paid
        ticket.vehicle.paymentInfo = paymentinfo

        spot.isFree = true
        spot.vehicle = null

        return paymentinfo
    }

    findParkingSpotByTicket(ticket) {
        for(const floor of parkingLot.floors) {
            if(floor.id === ticket.floorId) {
                return floor.parkingSpots.find(spot => spot.id === ticket.spotId)
            }
        }
        throw new Error("Spot not found for given ticket");
    }
}

class User extends Person {
    constructor(id, name, vehicle, vehicleType) {
        super(id, name)
        this.vehicle = vehicle
        this.vehicleType = vehicleType
    }

    parkVehicle(parkingLot) {
        for(const gate of parkingLot.entryGates) {
            const ticket = gate.attendant.processVehicleEntry(parkingLot, this.vehicle)
            return ticket
        }

        throw new Error("No entry gate or attendant available.")
    }
}

class Payment {
    makePayment() {}
}

class PaymentInfo {
    constructor(id, amount, date, parkingTicket, paymentStatus){
        this.id = id
        this.amount = amount
        this.date = date
        this.parkingTicket = parkingTicket
        this.paymentStatus = paymentStatus
    }
}

const PaymentStatus = Object.freeze({
    success: "success",
    failed: "failed",
    canceled: "canceled"
})

const address = new Address(500089, 'Alkapur', 'Manikonda', 'Hyderabad', 'India')

const parkingLot = new ParkingLot('Ganesh Parking Lot', address, [], [], [])

const admin = new Admin(55, 'Admin1')
const displayBoard = new DisplayBoard()

const floor = new ParkingFloor(6780, false, [], displayBoard)
admin.addParkingFloor(parkingLot, floor)

const spot = new ParkingSpot(904, true, SpotType.twoWheeler, 300, null)
admin.addParkingSpot(parkingLot, floor.id, spot)

const attendant = new Attendant(99, 'Attendant1', new Payment())
const entryGate = new EntryGate(66, attendant)
parkingLot.entryGates.push(entryGate)

const vehicle = new Vehicle(8109, vehicleType.twoWheeler, null, null)
const user = new User(100, 'manusha', vehicle, vehicleType.twoWheeler)

const ticket = user.parkVehicle(parkingLot)
console.log(ticket)

const payment = attendant.processPayment(ticket)

console.log(payment)