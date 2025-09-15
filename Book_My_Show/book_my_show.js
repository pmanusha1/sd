class BookMyShow {
    constructor() {
        this.cinemahalls = []
        this.movies = []
    }
    addCinemahall(cinemahall) {
        this.cinemahalls.push(cinemahall)
    }
    getCinemaHalls() {
        return this.cinemahalls
    }
    getMovies() {
        return this.movies
    }
}

class CinemaHall {
    constructor(id, name, address, audis = []) {
        this.id = id
        this.name = name
        this.address = address
        this.audis = audis
    }

    getMovies() {
        const movies = new Set()
        this.audis.forEach(audi => {
            audi.shows.forEach(show => {
                movies.add(show.movie)
            })
        })

        return Array.from(movies)
    }
    getShows() {
        return this.audis.flatMap(audi => audi.shows)
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

class Audi {
    constructor(id, name, seats = [], shows = []) {
        this.id = id
        this.name = name
        this.seats = seats
        this.shows = shows
    }

    getAvaibleSeats(show) {
        return show.getAvaibleSeats()
    }
}

class Show {
    constructor(id, movie, audi, startTime, endTime, seats = []) {
        this.id = id
        this.movie = movie
        this.audi = audi
        this.startTime = startTime
        this.endTime = endTime
        this.seats = seats
    }

    getAvaibleSeats() {
        return this.seats.filter(seat => seat.seatStatus === SeatStatus.available)
    }
    bookSeat(seat) {
        const foundSeat = this.seats.find(s => s.id === seat.id)
        if (foundSeat && foundSeat.seatStatus === SeatStatus.available){
            foundSeat.seatStatus = SeatStatus.booked
            return true
        }
        return false
    }
}

class Seat {
    constructor(id, seatType, seatStatus, price) {
        this.id = id
        this.seatType = seatType
        this.seatStatus = seatStatus
        this.price = price
    }
}

const SeatType = Object.freeze({
    deluxe: "deluxe",
    vip: "vip",
    standrad: "standard"
})

const SeatStatus = Object.freeze({
    available: "available",
    booked: "booked",
    reserved: "reserved",
    not_available: "not available"
})

class Movie {
    constructor(id, name, language, genre, duration) {
        this.id = id
        this.name = name
        this.language = language
        this.genre = genre
        this.duration = duration
    }
}

const Language = Object.freeze({
    telugu: "telugu",
    english: "english",
    hindi: "hindi",
})

const Genre = Object.freeze({
    drama: "drama",
    romcom: "romcom",
    fantasy: "fantasy",
})

class User {
    constructor(id, search){
        this.id = id
        this.search = search
    }
}

class SystemUser extends User {
    constructor(id, search, account, name, email){
        super(id, search)
        this.account = account
        this.name = name
        this.email = email
    }
}

class Member extends SystemUser {
    constructor(id, search, account, name, email) {
        super(id, search, account, name, email)
        this.bookings = []
    }

    bookMovie(show, seletedSeats) {
        let total = 0
        const bookedSeats = []

        for (const seat of seletedSeats) {
            const success = show.bookSeat(seat)
            if(success) {
                bookedSeats.push(seat)
                total += seat.price
            }
        }

        const payment = new PaymentObj(total, new Date(), PaymentStatus.completed)
        const booking = new Booking(Date.now(), this, show, bookedSeats, total, bookingStatus.confirmed, payment, new Date())

        this.bookings.push(booking)
        return booking
    }
    getBooking() {
        return this.bookings
    }
}

class Admin extends SystemUser {
    constructor(id, search, account, name, email) {
        super(id, search, account, name, email)
    }

    addMovie(movie, bookMyShow) {
        bookMyShow.movies.push(movie)
    }
    addShow(cinemahall, audiId, show) {
        const audi = cinemahall.audis.find(a => a.id === audiId)
        if(!audi) {
            console.log("Audi not found")
            return
        }

        show.seats = audi.seats.map(seat => new Seat(
            seat.id,
            seat.seatType,
            SeatStatus.available,
            seat.price
        ))

        audi.shows.push(show)
    }
    manageCinemaHall(bookMyShow, cinemahall) {
        bookMyShow.cinemahalls.push(cinemahall)
    }
}

class Account {
    constructor(id, username, password) {
        this.id = id
        this.username = username
        this.password = password
    }
}

class Search {
    getMovieByName() {}
    getMovieByLanguage() {}
    getMovieByGenre() {}
    getMovieByDate() {}
}

class Booking {
    constructor(id, user, show, seats = [], amount, bookingStatus, paymentObj, bookingTime){
        this.id = id
        this.user = user
        this.show = show
        this.seats = seats
        this.amount = amount
        this.bookingStatus = bookingStatus
        this.paymentObj = paymentObj
        this.bookingTime = bookingTime
    }

    makePayment() {}
}

const bookingStatus = Object.freeze({
    requested: "requested",
    pending: "pending",
    confirmed: "confirmed",
    canceled: "canceled"
})

class PaymentObj {
    constructor(amount, date, paymentStatus) {
        this.amount = amount
        this.date = date
        this.paymentStatus = paymentStatus
    }
}

const PaymentStatus = Object.freeze({
    unpaid: "unpaid",
    pending: "pending",
    completed: "completed",
    canceled: "canceled",
    refunded: "refunded",
})

const bookMyShow = new BookMyShow()

const address = new Address(500089, "Alkapur", "Manikonda", "Hyderbad", "India")

const seat = new Seat(45, SeatType.deluxe, SeatStatus.available, 320)

const movie = new Movie(78, "Maira", Language.telugu, Genre.drama, 2)

const audi = new Audi(167, "A1", [], [])

const show = new Show(67, movie, audi, new Date(), new Date(), [])

const search = new Search()

show.seats.push(seat)
audi.seats.push(seat)
audi.shows.push(show)

const cinemahall = new CinemaHall(156, 'Kinara', address, [])
cinemahall.audis.push(audi)

const adminAccount = new Account(24, 'admin', '1234')
const admin = new Admin(198, search, adminAccount, 'admin', 'admingmail.com')

admin.manageCinemaHall(bookMyShow, cinemahall)
admin.addMovie(movie, bookMyShow)
admin.addShow(cinemahall, audi.id, show)

console.log("Movies", bookMyShow.getMovies())

const memAccount = new Account(7689, 'manusha', '12345')
const user = new Member(67589, search, memAccount, 'manusha', 'manusha@gmail.com')

const booking = user.bookMovie(show, [seat])
console.log(booking)
