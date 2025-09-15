class ATM {
    constructor(atmId, address, screen, keypad, cardReader, cashDispenser, cashDeposit, chequeDeposit, bankService) {
        this.atmId = atmId
        this.address = address
        this.screen = screen
        this.keypad = keypad
        this.cardReader = cardReader
        this.cashDispenser = cashDispenser
        this.cashDeposit = cashDeposit
        this.chequeDeposit = chequeDeposit
        this.bankService = bankService
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

class CashDispenser {
    constructor() {
        this.cashAvailable = new Map()
    }

    dispenseCash(amount) {
        console.log(`Dispensing ₹${amount}`)
    }
}

const CashType = Object.freeze({
    hundred: "hundred",
    fivehundred: "fivehundred"
})

class Cash {
    constructor(cashType, serialNum) {
        this.cashType = cashType
        this.serialNum = serialNum
    }
}

class Screen {
    displayMessage(message) {
        console.log(message)
    }
}

class CardReader {
    fetchCardDetails(cardInfo) {
        return cardInfo
    }
}

class CardInfo {
    constructor(cardNum, cardType, bank, cvv, expiryDate, withDrawLimit) {
        this.cardNum = cardNum
        this.cardType = cardType
        this.bank = bank
        this.cvv = cvv
        this.expiryDate = expiryDate
        this.withDrawLimit = withDrawLimit
    }
}

const CardType = Object.freeze({
    credit: "credit",
    debit: "debit"
})

class KeyPad {
    getInput() {}
}

class Customer {
    constructor(name, cardInfo, account, serviceObj, customerStatus) {
        this.name = name
        this.cardInfo = cardInfo
        this.account = account
        this.serviceObj = serviceObj
        this.customerStatus = customerStatus
    }
}

class Account {
    constructor(accountNumber, availableBalance) {
        this.accountNumber = accountNumber
        this.availableBalance = availableBalance
    }

    deposit(amount) {
        this.availableBalance += amount
        console.log(`Available amount after deposit ${this.availableBalance}`)
    }
    withdraw(amount) {
        if(this.availableBalance >= amount) {
            this.availableBalance -= amount
            console.log(`Available amount after withdrawal ${this.availableBalance}`)
            return true
        } else {
            console.log(`Withdrawal failed. Insufficient balance.`);
            return false;
        }
    }
}

const CustomerStatus = Object.freeze({
    active: "active",
    blocked: "blocked",
    closed: "closed"
})

class Bank {
    constructor(name, address, atms = []) {
        this.name = name
        this.address = address
        this.atms = atms
    }
}

class BankService {
    isValidUser(cardInfo) {
        throw new Error("Method not implemented.")
    }
    getCustomerDetails(cardInfo) {
        throw new Error("Method not implemented.")
    }
    executeTransaction(transaction) {
        throw new Error("Method not implemented.")
    }
}

class BankA extends BankService {
    isValidUser(cardInfo) {
        return true
    }
    getCustomerDetails(cardInfo) {
        return new Customer("Manu", cardInfo, new Account(12345, 10000), this, CustomerStatus.active)
    }
    executeTransaction(transaction) {
        console.log("Executing transaction for BankA")
    }
}

class BankB extends BankService {
    isValidUser(cardInfo) {
        return true
    }
    getCustomerDetails(cardInfo) {
        return new Customer("Lavi", cardInfo, new Account(2345, 10000), this, CustomerStatus.active)
    }
    executeTransaction() {
        console.log("Executing transaction for BankA")
    }
}

class bankServiceFactory {
    getBankServiceObj(type) {
        switch (type) {
            case 'BankA':
                return new BankA()
                break;
            case 'BankB':
                return new BankB()
            default:
                throw new Error("Unsupported bank type")
        }
    }
}

class Transaction {
    constructor(id, sourceAmount, date) {
        this.id = id
        this.sourceAmount = sourceAmount
        this.date = date
    } 
}

class Transfer extends Transaction {
    constructor(id, sourceAmount, date, amount, destAccount) {
        super(id, sourceAmount, date) 
        this.amount = amount
        this.destAccount = destAccount
    } 
}

class WithDraw extends Transaction {
    constructor(id, sourceAmount, date, amount) {
        super(id, sourceAmount, date)
        this.amount = amount
    }
}

class Deposit extends Transaction {
    constructor(id, sourceAmount, date, amount) {
        super(id, sourceAmount, date)
        this.amount = amount
    }
}

class CashDeposit extends Deposit {
    constructor(id, sourceAmount, date, amount) {
        super(id, sourceAmount, date, amount)
    }
    getCash() {
        return this.sourceAmount + this.amount
    }
}

class ChequeDeposit extends Deposit {
    constructor(id, sourceAmount, date, amount) {
        super(id, sourceAmount, date, amount)
    }

    getCheque() {
        return this.sourceAmount + this.amount
    }
}

class TransactionDetails {
    constructor(id, date, sourceAccount, transactionStatus, transactionType) {
        this.id = id
        this.date = date
        this.sourceAccount = sourceAccount
        this.transactionStatus = transactionStatus
        this.transactionType = transactionType
    }
}

const TransactionStatus = Object.freeze({
    success: "success",
    failed: "failed",
    canceled: "canceled"
})

const TransactionType = Object.freeze({
    withdraw: "withdraw",
    deposit: "deposit",
    transfer: "transfer"
})

const address = new Address(500089, "Alkapur", "Manikonda", "Hyderabad", "India")

const screen = new Screen()

const keypad = new KeyPad()

const cardReader = new CardReader()

const cashDispenser = new CashDispenser()

const cardInfo = new CardInfo(5643, CardType.debit, 'BankA', 144, '12/26', 10000)

const customer = new Customer(cardInfo)

customer.account = new Account(75678, 10000)

const cashDeposit = new CashDeposit(67, customer.account.availableBalance, new Date(), 500)

const chequeDeposit = new ChequeDeposit(45, customer.account.availableBalance, new Date(), 700)

const factory = new bankServiceFactory()

const bankService = factory.getBankServiceObj("BankA")

const Atm = new ATM(12, address, screen, keypad, cardReader, cashDispenser, cashDeposit, chequeDeposit, bankService)

if(bankService.isValidUser(cardInfo)) {

    const withdrawAmount = 500
    const withDrawal = new WithDraw(78, customer.account.availableBalance, new Date(), withdrawAmount)

    const success = customer.account.withdraw(withdrawAmount)

    if (success) {
        Atm.cashDispenser.dispenseCash(withdrawAmount)
        const transactionDetails = new TransactionDetails(
            withDrawal.id,
            withDrawal.date,
            withDrawal.sourceAmount,
            TransactionStatus.success,
            TransactionType.withdraw
        )
        screen.displayMessage("Transaction successFul")
        console.log(transactionDetails)
    }
} else {
    screen.displayMessage("Card validation failed.");
}

