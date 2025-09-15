class Hotel {
    constructor(id, name, location, roomList = []) {
        this.id = id
        this.name = name
        this.location = location
        this.roomList = roomList
    }
}

class Location {
    constructor(pin, street, area, city, country){
        this.pin = pin
        this.street = street
        this.area = area
        this.city = city
        this.country = country
    }
}

class Room {
    constructor(roomId, roomType, roomStatus, price, roomKeys, houseKeepingLogs) {
        this.roomId = roomId
        this.roomType = roomType
        this.roomStatus = roomStatus
        this.price = price
        this.roomKeys = roomKeys
        this.houseKeepingLogs = houseKeepingLogs
    }
}

const RoomType = Object.freeze({
    standard: "standard",
    deluxe: "deluxe",
    family: "family"
})

const RoomStatus = Object.freeze({
    available: "available",
    booked: "booked",
    reserved: "reserved"
})

class RoomKey {
    constructor(keyId, barcode, issuedAt, isActive, isMaster) {
        this.keyId = keyId,
        this.barcode = barcode,
        this.issuedAt = issuedAt
        this.isActive = isActive,
        this.isMaster = isMaster
    }

    assignRoom() {

    }
}

class HouseKeepingLog {
    constructor(desc, startDate, duration, houseKeeper) {
        this.desc = desc
        this.startDate = startDate
        this.duration = duration
        this.houseKeeper = houseKeeper
    }

    updateLogs() {

    }
}

class Person {
    constructor(id, name, account){
        this.id = id
        this.name = name
        this.account = account
    }
}

class HouseKeeper extends Person {
    getRoomserviced(date) {

    }
}

class Account {
    constructor(accountId, username, password, accountStatus){
        this.accountId = accountId
        this.username = username
        this.password = password
        this.accountStatus = accountStatus
    }
}

const AccountStatus = Object.freeze({
    active: "active",
    blocked: "blocked",
    closed: "closed"
})

class Guest extends Person {
    constructor(id, name, account, search, booking) {
        super(id, name, account)
        this.search = search
        this.booking = booking
    }

    getAllRooms(room) {

    }
}

class Search {
    searchRoom(roomList, roomType, startDate, duration){
        return roomList.filter(room => {
            return room.roomType === roomType && 
                   room.roomStatus === RoomStatus.available
        });
    }
}

class Booking {
    bookRoom(guestInfo, room, startDate, duration) {
        if(room.roomStatus != RoomStatus.available) {
            console.log(`Room ${room.roomId} is not available.`);
            return null;
        }

        const bookingId = "B" + Math.floor(Math.random() * 10000);
        const booking = new RoomBooking(bookingId, startDate, duration, guestInfo, room, 0);
        room.roomStatus = RoomStatus.booked

        return booking
    }
    cancelRoom(room) {
        room.roomStatus = RoomStatus.available;
        console.log(`Room ${room.roomId} is now available again.`);
    }
}

class Admin extends Person {
    addRoom(roomDetails) {}
    removeRoom(roomDetails) {}
    editRoom(roomDetails) {}
}

class Receptionist extends Person {
    constructor(id, name, account, search, booking){
        super(id, name, account)
        this.search = search
        this.booking = booking
    }

    checkIn(guestInfo, bookingDetails) {}
    checkOut(guestInfo, bookingDetails) {}
}

class RoomBooking {
    constructor(bookingId, startDate, duration, guestInfo, roomInfo, totalCharge) {
        this.bookingId = bookingId
        this.startDate = startDate
        this.duration = duration
        this.guestInfo = guestInfo
        this.roomInfo = roomInfo
        this.totalCharge = totalCharge
    }

    printSummary() {
        console.log(`Booking ID: ${this.bookingId}`);
        console.log(`Guest: ${this.guestInfo.name}`);
        console.log(`Room: ${this.roomInfo.roomId}`);
        console.log(`Duration: ${this.duration} nights`);
        console.log(`Total Charge: ₹${this.totalCharge}`);
    }
}

class BaseRoomCharge {
    getCost() {

    }
}

class RoomCharge extends BaseRoomCharge {
    constructor(cost) {
        super()
        this.cost = cost
    }

    getCost() {
        return this.cost
    }

    setCost(cost) {
        this.cost = cost
    }
}

class RoomServiceCharge extends BaseRoomCharge {
    constructor(cost, baseroomcharge) {
        super();
        this.cost = cost;
        this.baseroomcharge = baseroomcharge;
    }

    getCost() {
        return this.baseroomcharge.getCost() + this.cost;
    }
}

class InRoomPurchase extends BaseRoomCharge {
    constructor(cost, baseroomcharge) {
        super();
        this.cost = cost;
        this.baseroomcharge = baseroomcharge;
    }

    getCost() {
        return this.baseroomcharge.getCost() + this.cost;
    }
}

const hotelLocation = new Location("560001", "MG Road", "Central", "Bangalore", "India");
const hotel = new Hotel(1, "The Grand Stay", hotelLocation);

const key1 = new RoomKey(1, "BAR123", new Date(), true, false);
const housekeepingLog = new HouseKeepingLog("Cleaned", new Date(), 30, null);

const room = new Room(
    "R101",
    RoomType.deluxe,
    RoomStatus.available,
    3000,
    [key1],
    [housekeepingLog]
);

hotel.roomList.push(room);

const guestAccount = new Account(1, "john_doe", "password123", AccountStatus.active);
const guest = new Guest(1, "John Doe", guestAccount, new Search(), new Booking());

const availableRooms = guest.search.searchRoom(hotel.roomList, RoomType.deluxe, new Date(), 3);

if (availableRooms.length === 0) {
    console.log("No rooms available.");
} else {
    const roomToBook = availableRooms[0];
    
    const booking = guest.booking.bookRoom(guest, roomToBook, new Date(), 3);

    if (booking) {
        const baseCharge = new RoomCharge(roomToBook.price * booking.duration);
        const withRoomService = new RoomServiceCharge(1000, baseCharge);
        const withInRoomPurchase = new InRoomPurchase(500, withRoomService);

        booking.totalCharge = withInRoomPurchase.getCost();

        console.log(`Hotel: ${hotel.name}`);
        console.log(`Guest: ${guest.name}`);
        console.log(`Room Booked: ${roomToBook.roomId}`);
        console.log(`Total Cost: ₹${booking.totalCharge}`);
        console.log(`Room Status: ${roomToBook.roomStatus}`);
    }
}
