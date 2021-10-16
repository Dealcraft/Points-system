class PTM {

    balance = 0
    PTMS = []
    items = []
    user = {
        'ownedItems': [

        ],
        'balance': 0
    }
    selector = '.ptm'
    options = {
        class: 'ptm',
        jsonDir: './',
        itemList: 'items.json',
        localStoragePrefix: 'ptm-',
        ownedText: 'Owned',
    }

    constructor(selector, options){
        this.selector = selector
        this.user = JSON.parse(localStorage.getItem(this.options.localStoragePrefix + 'user'))
        this.items = this.readJson(this.options.jsonDir + this.options.itemList)
        this.options = {...options, ...this.options}
        this.PTMS = document.querySelectorAll(this.selector)
        this.PTMS.forEach(_PTM => {
            // Clearout PTM-container
            _PTM.innerHTML = ''

            // Create PTM-balance element
            var el = document.createElement('div')
            el.classList.add(this.options.class + '-balance')
            el.innerHTML = this.user.balance
            _PTM.appendChild(el)

            // Create PTM-items-list
            var el = document.createElement('div')
            el.classList.add(this.options.class + '-items-list')
            
            // Create item for list
            this.items.forEach(item => {
                var itemEl = document.createElement('div')
                itemEl.classList.add(this.options.class + '-item')

                // Check if item is already owned
                if(this.user.ownedItems.includes(item.name)){
                    var owned = document.createElement('span')
                    owned.classList.add(this.options.class + '-owned')
                    owned.innerHTML = this.options.ownedText
                    itemEl.classList.add(this.options.class + '-item-owned')
                    itemEl.innerHTML = item.name
                    itemEl.appendChild(owned)
                } else {
                    var price = document.createElement('span')
                    price.classList.add(this.options.class + '-item-price')
                    price.innerHTML = item.price
                    itemEl.innerHTML = item.name
                    itemEl.addEventListener('click', (e) => {
                        console.log(item.name)
                        if(this.buy(item.name)){
                            this.refreshPTMs()
                        }
                    })
                    itemEl.appendChild(price)
                }

                el.appendChild(itemEl)
            })

            _PTM.appendChild(el)
            
        })
    }

    withdraw(points){
        if(this.user.balance - points >= 0){
            this.user.balance = this.user.balance - points
            this.safeUser()
            return true
        } else return false
    }

    deposit(points){
        this.user.balance = this.user.balance + points
        this.safeUser()
    }

    buy(itemName){
        var item = this.items.filter(item => item.name == itemName)[0]

        if(this.user.balance - item.price >= 0){
            this.user.balance = this.user.balance - item.price
        } else {
            return
        }

        this.user.ownedItems.push(item.name)
        this.safeUser()
        return true
    }

    getBalance(){
        return this.user.balance
    }

    setBalance(balance){
        this.user.balance = balance
        this.safeUser()
    }

    refreshPTMs(){
        this.PTMS.forEach(_PTM => {
            // Clearout PTM-container
            _PTM.innerHTML = ''

            // Create PTM-balance element
            var el = document.createElement('div')
            el.classList.add(this.options.class + '-balance')
            el.innerHTML = this.user.balance
            _PTM.appendChild(el)

            // Create PTM-items-list
            var el = document.createElement('div')
            el.classList.add(this.options.class + '-items-list')
            
            // Create item for list
            this.items.forEach(item => {
                var itemEl = document.createElement('div')
                itemEl.classList.add(this.options.class + '-item')

                // Check if item is already owned
                if(this.user.ownedItems.includes(item.name)){
                    var owned = document.createElement('span')
                    owned.classList.add(this.options.class + '-owned')
                    owned.innerHTML = this.options.ownedText
                    itemEl.classList.add(this.options.class + '-item-owned')
                    itemEl.innerHTML = item.name
                    itemEl.appendChild(owned)
                } else {
                    var price = document.createElement('span')
                    price.classList.add(this.options.class + '-item-price')
                    price.innerHTML = item.price
                    itemEl.innerHTML = item.name
                    itemEl.addEventListener('click', (e) => {
                        console.log(item.name)
                        if(this.buy(item.name)){
                            this.refreshPTMs()
                        }
                    })
                    itemEl.appendChild(price)
                }

                el.appendChild(itemEl)
            })

            _PTM.appendChild(el)
            
        })
    }

    userHas(item){
        if(this.user.ownedItems.includes(item)) return true
        else return false
    }

    safeUser(){
        localStorage.setItem(this.options.localStoragePrefix + 'user', JSON.stringify(this.user))
    }

    readJson(file){
        var request = new XMLHttpRequest()
        request.open("GET", file, false)
        request.overrideMimeType("application/json")
        request.send(null)
        return JSON.parse(request.responseText)
    }

}