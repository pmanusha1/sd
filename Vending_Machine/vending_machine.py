from dataclasses import dataclass
from typing import List

@dataclass
class VendingMachine:
    id: int
    location: "Address"
    items: List["Item"]
    
    def dispenseItem(self, selected_items):
        for item, qty in selected_items:
            item.qty -= qty
            print(f"✅ Dispensing {qty} {item.name}")

    def calculateCost(self, selected_items):
        return sum(item.price * qty for item, qty in selected_items)
    
    def getItems(self):
        return self.items
    
    def sendNotificationToAdmin(self, message):
        print(f"Sending notification to admin: {message}")

@dataclass
class Address:
    floor: int
    building: str
    office: str

@dataclass
class Item:
    id: int
    name: str
    price: int
    qty: int

@dataclass
class Person:
    id: int

@dataclass
class Admin(Person):
    name: str

    def addItem(self, machine, item):
        machine.items.append(item)
    
    def removeItem(self, machine, item):
        machine.items = [i for i in machine.items if i.id != item.id]
        return machine.items
    
    def updateItemPrice(self, machine, item, price):
        for ele in machine.items:
            if ele.id == item.id:
                ele.price = price
                return True
        return False

@dataclass
class User(Person):
    def selectItems(self, machine, selected_items):
        selected = []
        for item, qty in selected_items:
            if item:
                if item.qty >= qty:
                    selected.append((item, qty))
                else:
                    print(f"Not enough stock for {item.name}. Available: {item.qty}, Requested: {qty}")
                    machine.sendNotificationToAdmin(f"Low stock for {item.name}")
            else:
                print(f"Item ID {item.id} not found.")
                machine.sendNotificationToAdmin("Invalid item selected by user")
        return selected

    def getCostOfItems(self, selected_items):
        return sum(item.price * qty for item, qty in selected_items)

    def payment(self, amount):
        print(f"Payment of ₹{amount} successful.")
        return True


address = Address(2, 's8', 'wipro')

machine = VendingMachine(78, address, [])
items = machine.items

item1 = Item(66, 'coke', 30, 5)
item2 = Item(55, 'chips', 20, 5)

admin = Admin(234, 'admin')
admin.addItem(machine, item1)
admin.addItem(machine, item2)

admin.updateItemPrice(machine, item1, 35)

user = User(123)
selected = user.selectItems(machine, [(item1, 6), (item2, 2)])
cost = user.getCostOfItems(selected)
if user.payment(cost):
    machine.dispenseItem(selected)