class Hotel {
    Integer id;
    String name;
    Location hotelLocation;
    List<Room> roomList;
}

class Location {
    int pin;
    String area;
    String city;
    String country;
}

class Room {
    int roomId;
    RoomType type;
    RoomStatus status;
    Double price;
    List<RoomKey> roomkeys;
    List<HouseKeepingLog> houseKeepingLogs;
}

public enum RoomType {
    STANDARD, DELUX, FAMILY
}

public enum RoomStatus {
    AVAILABLE, BOOKED, RESERVED, NOT_AVAILABLE
}

class RoomKey {
    int keyId;
    String barcode;
    Date issuedAt;
    boolean isActive;
    boolean isMaster;

    public void assignRoom(Room room);
}

class HouseKeepingLog {
    String description;
    Date startDate;
    int duration;
    HouseKeeper houseKeeper;

    public void updateLog(Room room)
}

abstract class Person {
    String name;
    Account accountDetails;
    String phone;
}

class Account {
    String username;
    String password;

    AccountStatus accountStatus;
}

public enum AccountStatus {
    ACTIVE, CLOSED, BLOCKED
}

class HouseKeeper extends Person {
    public List<Room> public getRoomServiced(Date date);
}

class Guest extends Person {
    Search searchObj;
    Booking bookingobj;

    public List<Room> getAllRooms();
}

class Receptionist extends Person {
    Search searchObj;
    Booking bookingobj;

    public void checkIn(Guest guest, RoomBooking bookingInfo);
    public void checkOut(Guest guest, RoomBooking bookingInfo)
}

class Admin extends Person {
    public void addRoom(Room roomdetail);
    public void removeRoom(Room roomdetail);
    public void editRoom(Room roomdetail);
}

class Search {
    public List<Room> search(RoomType roomType, Date startDate, int duration)
}

class Booking {
    public RoomBooking createBookin(Guest guestInfo);
    public RoomBooking cancelBooking(int bookingId);
}

class RoomBooking {
    String bookingId;
    Date startDate;
    int duration;
    BookingStatus bookingStatus;
    List<Guest> guestInfo;
    List<Room> roomInfo;
    BaseRoomCharge totalCharge;
}

public enum BookingStatus {
    BOOKED, PENDING, CANCELED
}

interface BaseRoomCharge {
    Double getCost()
}

class RoomCharge implements BaseRoomCharge {
    double cost;
    Double getCost() {
        return cost;
    }
    void setCost(double cost) {
        this.cost = cost
    }
}

class RoomServiceCharge implements BaseRoomCharge {
    double cost;
    BaseRoomCharge baseRoomCharge;
    Double getCost() {
        baseRoomCharge.setCost(baseRoomCharge.getCost() + cost)
        return baseRoomCharge.getCost();
    }
}

class InRoomPurchaseCharge implements BaseRoomCharge {
    double cost;
    BaseRoomCharge baseRoomCharge;
    Double getCost() {
        baseRoomCharge.setCost(baseRoomCharge.getCost() + cost);
        return baseRoomCharge.getCost()
    }
}
