class Library {
    constructor(name, address, bookItem = []) {
        this.name = name
        this.address = address
        this.bookItem = bookItem
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

class Book {
    constructor(bookId, title, authors = [], bookType) {
        this.bookId = bookId
        this.title = title
        this.authors = authors
        this.bookType = bookType
    }
}

class BookItem extends Book {
    constructor(bookId, title, authors, bookType, barcode, publicationDate, rackLocation, bookStatus, bookFormat, issuedAt) {
        super(bookId, title, authors, bookType)
        this.barcode = barcode
        this.publicationDate = publicationDate
        this.rackLocation = rackLocation
        this.bookStatus = bookStatus
        this.bookFormat = bookFormat
        this.issuedAt = issuedAt
    }
}

const BookType = Object.freeze({
    paperback: "paperback",
    newspaper: "newspaper",
    journal: "journal"
})

const BookStatus = Object.freeze({
    reserved: "reserved",
    issued: "issued",
    available: "available",
    lost: "lost"
})

const BookFormat = Object.freeze({
    fantasy: "fantasy",
    drama: "drama",
    romcom: "romcom"
})

class Rack {
    constructor(id, location) {
        this.id = id
        this.location = location
    }
}

class Person {
    constructor(firstname, lastname) {
        this.firstname = firstname
        this.lastname = lastname
    }
}

class Author extends Person {
    constructor(firstname, lastname, book) {
        super(firstname, lastname)
        this.book = book
    }
    publishedBooks() {

    }
}

class SystemMember extends Person {
    constructor(firstname, lastname, email, phone, account) {
        super(firstname, lastname)
        this.email = email
        this.phone = phone
        this.account = account
    }
}

class Member extends SystemMember {
    constructor(firstname, lastname,email, phone, account, totalCheckOutBooks, search, bookIssueService) {
        super(firstname, lastname, email, phone, account)
        this.totalCheckOutBooks = totalCheckOutBooks
        this.search = search
        this.bookIssueService = bookIssueService
    }
}

class Librarian extends SystemMember {
    constructor(email, phone, account, search, bookIssueService, book) {
        super(email, phone, account)
        this.search = search
        this.bookIssueService = bookIssueService
        this.book = book
    }

    addBook(bookItem, library) {
        library.bookItem.push(bookItem)
    }
    removeBook(barcode, library) {
        library.bookItem = library.bookItem.filter(book => book.barcode != barcode)
    }
    editBook(barcode, update, library) {
        const book = library.bookItem.find(book => book.barcode === barcode)
        if (book) {
            Object.assign(book, update)
        }
    }
}

class Account{
    constructor(accountId, username, password) {
        this.accountId = accountId
        this.username = username
        this.password = password
    }
}

class Search {
    constructor(bookList) {
        this.bookList = bookList
    }

    getBookByTitle(title) {
        return this.bookList.filter(book => book.title === title)
    }
    getBookByAuthor(author) {
        return this.bookList.filter(book => book.authors.includes(author))
    }
    getBookByPublishDate(publicationDate) {
        return this.bookList.filter(book => book.publicationDate === publicationDate)
    }
    getBookByType(bookType) {
        return this.bookList.filter(book => book.bookType === bookType)
    }
}

class BookIssueService {
    constructor(fineService) {
        this.fineService = fineService
        this.issuedBooks = new Map()
    }

    BookReserveDetails(book) {}
    UpdateBookReserveDetails(BookReserveDetails) {}
    ReverseBook(book, user) {}
    RenewBook(book, user) {}

    IssueBook(book, user) {
        if(book.bookStatus != BookStatus.available) {
            console.log("Book is not available for issue.");
            return null;
        }

        const today = new Date()
        const dueDate = new Date(today)
        dueDate.setDate(dueDate.getDate() - 10)

        book.bookStatus = BookStatus.issued
        book.issuedAt = today

        const issueDetails = new BookIssueDetails(book, today, user, dueDate)
        this.issuedBooks.set(book.barcode, issueDetails)

        console.log(`${user.firstname} issued "${book.title}". Due on: ${dueDate.toDateString()}`);
        return issueDetails;
    }
    ReturnBook(book, user) {
        const issueDetails = this.issuedBooks.get(book.barcode);

        if (!issueDetails) {
            console.log("This book was not issued.");
            return null;
        }

        const today = new Date()
        book.bookStatus = BookStatus.available
        book.issuedAt = null

        this.issuedBooks.delete(book.barcode)

        let dueDays = 0
        if(today > issueDetails.dueDate) {
            const diff = today - issueDetails.dueDate;
            dueDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }

        if (dueDays > 0) {
            const fine = this.fineService.calculateFine(book, user, dueDays)
            console.log(`${user.firstname} returned "${book.title}" late by ${dueDays} days. Fine: ₹${fine.fineValue}`);
            return fine;
        } else {
            console.log(`${user.firstname} returned "${book.title}" on time. No fine.`);
            return null;
        }
    }
}

class BookLending {
    constructor(book, startDate, user) {
        this.book = book
        this.startDate = startDate
        this.user = user
    }
}

class BookReserveDetails extends BookLending {
    constructor(book, startDate, user, bookReserveStatus) {
        super(book, startDate, user)
        this.bookReserveStatus = bookReserveStatus
    }
}

const bookReserveStatus = Object.freeze({
    reserved: "reserved",
    available: "available"
})

class BookIssueDetails extends BookLending {
    constructor(book, startDate, user, dueDate) {
        super(book, startDate, user)
        this.dueDate = dueDate
    }
}

class FineService {
    calculateFine(book, user, days) {
        const finePerDay = 5
        return new Fine(book, user, days * finePerDay)
    }
}

class Fine {
    constructor(book, user, fineValue){
        this.book = book
        this.user = user
        this.fineValue = fineValue
    }
}
const address = new Address("500089", "Alkapur", "Manikonda", "Hyderabad", "India")
const library = new Library("Vidyalayam", address, [])

const rackLocation = new Rack(123, "A1")
const book = new BookItem(
    12,
    "System Designs",
    ['Alex'],
    BookType.paperback,
    "BAR123",
    new Date("2020-01-01"),
    rackLocation,
    BookStatus.available,
    BookFormat.drama,
    null
)

const search = new Search(library.bookItem)
const fineService = new FineService()
const bookIssueService = new BookIssueService(fineService)

const librarianAccount = new Account(7, "librarian", "1234567")
const librarian = new Librarian("lib@gmail.com", "23465171", librarianAccount, search, bookIssueService, book)

const memberAccount = new Account(5, "libmember", "123456")
const user = new Member("manusha", "pasula", "manu@gmail.com", "1234567890", memberAccount, 3, search, bookIssueService)

librarian.addBook(book, library)

const foundBook = user.search.getBookByTitle("System Designs")
console.log(foundBook.map(book => book.title))

const issued = bookIssueService.IssueBook(book, user)

const fine = bookIssueService.ReturnBook(book, user)

if (fine) {
    console.log(fine.fineValue)
} else {
    console.log("No fine.")
}
