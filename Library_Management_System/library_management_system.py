from dataclasses import dataclass
from enum import Enum
from typing import List
from datetime import date, datetime, timedelta

class BookStatus(Enum):
    reserved = "reserved"
    issued = "issued"
    available = "available"
    lost = "lost"

class BookType(Enum):
    paperback = "paperback"
    newspaper = "newspaper"
    journal = "journal"

class AccountStatus(Enum):
    active = "active"
    blocked = "blocked"
    closed = "closed"

@dataclass
class Address:
    pin: int
    street: str
    area: str
    city: str
    country: str

@dataclass
class Person:
    firstname: str
    lastname: str

@dataclass
class Author(Person):
    def publishedBooks(self, book):
        pass

@dataclass
class Book:
    bookId: int
    title: str
    authors: List[Author]
    bookType: BookType

@dataclass
class Rack:
    id: int
    location: str

@dataclass
class BookItem(Book):
    barcode: int
    publicationDate: date
    rackLocation: Rack
    bookStatus: BookStatus
    issuedOn: date

@dataclass
class Library:
    name: str
    address: Address
    bookItem: List[BookItem]

@dataclass
class Account:
    accountId: int
    username: str
    password: str
    accountStatus: AccountStatus

@dataclass
class SystemMember(Person):
    email: str
    phone: int
    account: Account

@dataclass
class Search:
    def getBookByTitle(self, bookList, title):
        return [book for book in bookList if book.title == title]

    def getBookByAuthor(self, bookList, authorName):
        return [book for book in bookList if any(author.firstname == authorName for author in book.authors)]

    def getBookByType(self, bookList, bookType):
        return [book for book in bookList if book.bookType == bookType]

    def getBookByPublicationDate(self, bookList, publishedDate):
        return [book for book in bookList if book.publicationDate == publishedDate]

@dataclass
class Fine:
    book: str
    user: str
    fineValue: float

@dataclass
class FineService:
    def calculateFine(self, book, user, days):
        finePerDay = 5
        return Fine(book, user, days * finePerDay)

@dataclass
class BookIssueService:
    fineService: FineService
    issuedBooks:dict = None

    def issueBook(self, book, user):
        if self.issuedBooks is None:
            self.issuedBooks = {}
        
        if book.bookStatus != BookStatus.available:
            print(f"'{book.title}' is not available for issue.")
            return
        
        today = datetime.today().date()
        dueDate = today + timedelta(days = 10)

        book.bookStatus = BookStatus.issued
        book.issuedOn = today
        self.issuedBooks[book.barcode] = {'user': user, 'dueDate': dueDate}

        print(f"{user.firstname} issued '{book.title}' on {today}. Due by {dueDate}.")

    def returnBook(self, book, user):
        if book.barcode not in self.issuedBooks:
            print(f"'{book.title}' was not issued.")
            return
        
        today = datetime.today().date()
        dueDate = self.issuedBooks[book.barcode]['dueDate']

        if today > dueDate:
            due_days = (today - dueDate).days
            fine = self.fineService.calculateFine(book, user, due_days)
            print(f"{user.firstname} returned '{book.title}' late by {due_days} days. Fine: ₹{fine.fineValue}")
            return fine
        else:
            print(f"{user.firstname} returned '{book.title}' on time. No fine.")

@dataclass
class Member(SystemMember):
    totalCheckOut: int
    search: Search 
    bookIssueService: BookIssueService 

@dataclass
class Librarian(SystemMember):
    search: Search
    bookIssueService: BookIssueService

    def addBook(self, book, library):
        library.bookItem.append(book)

    def removeBook(self, barcode, library):
        library.bookItem = [book for book in library.bookItem if book.barcode != barcode]

    def editBook(self, barcode, update, library):
        for book in library.bookItem:
            if book.barcode == barcode:
                for key, value in update.items():
                    setattr(book, key, value)

address = Address(500089, "Alkapur", "Manikonda", "hyderabad", "India")
library = Library("Vidyalayam", address, [])
author = Author('Alex', 'Johnson')
rack = Rack(123, "A1")

book = BookItem(
    12,
    "System Designs",
    [author],
    BookType.paperback,
    "BAR123",
    date(2020, 1, 1),
    rack,
    BookStatus.available,
    None
)
search = Search()
fineService = FineService()
bookIssueService = BookIssueService(fineService)

librarianAccount = Account(7, 'librarian', '1234567', AccountStatus.active)
librarian = Librarian("librarian", "libraran", "lib@gmail.com", 1234567890, librarianAccount, search, bookIssueService)
librarian.addBook(book, library)

memberAccount = Account(5, 'libmember', '12345', AccountStatus.active)
user = Member('manusha', 'pasula', 'manusha@gmail.com', 12345567890, memberAccount, 3, search, bookIssueService)

foundBook = user.search.getBookByTitle(library.bookItem, "System Designs")
for book in foundBook:
    print(book)

bookIssueService.issueBook(book, user)
book.issuedOn = datetime.today().date() - timedelta(days=15)
bookIssueService.issuedBooks[book.barcode]['dueDate'] = datetime.today().date() - timedelta(days=5)

fine = bookIssueService.returnBook(book, user)
if fine:
    print(f"Fine amount collected: ₹{fine.fineValue}")