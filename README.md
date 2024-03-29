# Point system

A Javascript point system for websites

This point system stores points for individual users with which users are able to buy/unlock some items you provide. These items may be some parts of your website or just some decoration.  
**Please note** that the data is **not encrypted** and that this library **should not be used** for securing important parts of your website!  
For a live example take a look at [this page](https://dealcraft.github.io/point-system)

## Installation

To add the library to your project run the following command in your terminal

```bash
npm install point-system
```

and import the script via the script tag

```html
<script src="./node_modules/point-system/script.js"></script>
```

or use the import via unpkg

```html
<script src="https://unpkg.com/point-system/script.js"></script>
```

After importing the script, you have access to the `PTM` Class and you can intialize it like so. The constructor awaits a array of items as the first argument.

```javascript
const ptm = new PTM(items);
```

After initializing you can setup buttons for buying items like the following given that the name of the item you want to buy is 'javascript badge'

```javascript
btnElement.addEventlistener("click", () => {
	ptm.buyItem("javascript badge"); // will add the item to user's items and charge the user accordingly, only possible if user's balance is sufficient
});
```

You can check the items owned by the user via the hasItem method and pass it the item name which will return a boolean indicating whether the item is owned by the user.

```javascript
ptm.hasItem("javascript badge"); // true if the item is owned by the user
```

You can charge the user without buying an item by using the chargeUser method and pass the amount the should be added to the user's balance. For example, every ten minutes the user is on the website he earns 100 points.

```javascript
ptm.chargeUser(100); // positive amount -> adding to user's balance
```

For displaying the user's balance you can use the balance read-only property.

```javascript
ptm.balance; // returns the user's balance
```

## Available Methods And Properties

### Methods

| name       | parameter | return value | description                                                                                |
| ---------- | --------- | ------------ | ------------------------------------------------------------------------------------------ |
| hasItem    | itemName  | boolean      | Returns a boolean indicating whether user has the specified item                           |
| buyItem    | itemName  | this         | Adds the item (if existing) to the user's items if the user has enough balance             |
| getItem    | itemName  | Item         | Returns the data for a specified item from the item list                                   |
| chargeUser | amount    | this         | Charges the user with the given amount. Negative values will be subtracted, positive added |
| sellItem   | itemName  | this         | Removes the item from the user's items if the user previously bought the item              |

### Properties

| name      | readable | writeable | type                  | description                                        |
| --------- | -------- | --------- | --------------------- | -------------------------------------------------- |
| balance   | [ x ]    |           | number                | Current user's balance                             |
| userItems | [ x ]    |           | Items[]               | The items owned by the user                        |
| items     | [ x ]    | [ x ]     | Items[]               | All available items                                |
| user      | [ x ]    |           | User                  |                                                    |
| VERSION   | [ x ]    |           | VERSION               | The installed version                              |
| options   |          | [ x ]     | Options               | Updates the options                                |
| callback  |          | [ x ]     | function(user, items) | Updates the callback called when user gets updated |

## Customization

The PTM class provides a couple of options to customize the behavior. If you want to change the default options pass an object containing the changed options as the second parameter to the class constructor.

### Available options

| option key             | default      | type         | description                                                                                          |
| ---------------------- | ------------ | ------------ | ---------------------------------------------------------------------------------------------------- |
| startBalance           | 100          | number       | The start balance with which each new user starts                                                    |
| storage                | localStorage | Storage      | The storage where the user data gets saved persistently                                              |
| storagePrefix          | ptm-         | string       | The prefix for all data saved in the storage                                                         |
| logLevel               | 2            | LogLevel     | Indicating which types of events get logged                                                          |
| name                   | PTM          | string       | The name visible in the logs                                                                         |
| currencyName           | pt           | string       | The currency appended to the item price in the logs                                                  |
| removeUnavailableItems | false        | boolean      | Whether to remove items from the user if they are not present in the available items list            |
| removeInvalidItems     | true         | boolean      | Whether to remove items from the user if they are not longer valid caused by validFrom or validUntil |
| loggingTo              | console      | Logger       | The logger used to log events                                                                        |
| itemIdentifierField    | id           | string       | The field on the item object which is used to identify the item                                      |
| save                   | saveFunction | SaveFunction | The function used to save the user                                                                   |
| load                   | loadFunction | LoadFunction | The function used to load the user                                                                   |

## Refreshing the data

For the ease of refreshing data after a interaction with the PTM, you can pass a callback function as the third parameter to the constructor of the PTM Class, which will be called everytime the user changes.  
The callback will be called with the user information as the first parameter, all the available items as the second parameter and the PTM instance as the third parameter.

## Types

Type definitions for clarity about the types used in the documentation. The described fields are mandatory until stated otherwise, however any additional fields won't affect the PTM.

### Item

| field      | optional | type               | description                                                                     |
| ---------- | -------- | ------------------ | ------------------------------------------------------------------------------- |
| id         |          | any                | Item id used to identifiy the item if option.itemIdentifierField wasn't changed |
| name       |          | string             | Name of the item                                                                |
| price      |          | number             | Negative amount if user has to pay, positive if the user gets points            |
| validFrom  | [ x ]    | Date as ISO String | The date and time from which the item can be bought                             |
| validUntil | [ x ]    | Date as ISO String | The date and time until which the item can be purchased                         |

### Storage

Every storage object implementing the following methods can be used to store the data persistently (e.g. localStorage)

| field   | type                 | description                                                                                 |
| ------- | -------------------- | ------------------------------------------------------------------------------------------- |
| setItem | function(key, value) | A function taking a key and a value as parameters and saves the value referenced by the key |
| getItem | function(key)        | A function taking a key and returning the value saved with it                               |

### LogLevel

A number indicating which type of events get logged.

| level | events   |
| ----- | -------- |
| 0     | nothing  |
| >= 1  | errors   |
| >= 2  | warnings |
| >= 3  | infos    |
| >= 4  | logs     |

### User

| field      | type   | description                       |
| ---------- | ------ | --------------------------------- |
| balance    | number | The current balance of the user   |
| ownedItems | item[] | All the items which the user owns |

### Logger

Every logger implementing the following methods can be used to log the events

| field | type              | description                                                                                    |
| ----- | ----------------- | ---------------------------------------------------------------------------------------------- |
| log   | function(...args) | A function accepting a undefined number of arguments as input and logs them as a log entry     |
| info  | function(...args) | A function accepting a undefined number of arguments as input and logs them as a info entry    |
| warn  | function(...args) | A function accepting a undefined number of arguments as input and logs them as a warning entry |
| error | function(...args) | A function accepting a undefined number of arguments as input and logs them as a error entry   |

### SaveFunction

The save function's this value is binded to the ptm instance. The only parameter passed to the save function is the user that should be saved.

### LoadFunction

The load function's this value is binded to the ptm instance. The load function has to return the user object as defined in the User type and may **not** return a promise.
