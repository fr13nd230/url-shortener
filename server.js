import express from 'express'

// Starting the app
const app = express()

// Global Vars
const port = process.env.PORT || 2000

// Mouting veiws folder
app.use(express.static('views'))

// Mouting middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Handling Requests here
app.get('/', (req, res) => {
    res.render('./views/index.html')
})

const originalUrls = []
const shortUrls = []

app.post('/api/shorturl', (req, res) => {
    const { url } = req.body
    const foundIndex = originalUrls.indexOf(url)

    if(!url.includes('https://') && !url.includes('http://')) {
        res.status(400).json({
            error: "invalid url format"
        })
    }

    if(foundIndex < 0) {
        originalUrls.push(url)
        shortUrls.push(shortUrls.length)
        res.status(200).json({
            original_url: url,
            short_url: shortUrls.length - 1
        })
    }

    res.status(200).json({
        original_url: url,
        short_url: shortUrls[parseInt(foundIndex)]
    })

    res.redirect('/api/shorturl')
})

app.get('/api/shorturl/:short', (req, res) => {
    const { short } = req.params
    const foundIndex = shortUrls.indexOf(parseInt(short))

    if(foundIndex < 0)
    {
        res.status(400).json({
            error: "no short url for the given input!"
        })
    }

    res.redirect(originalUrls[foundIndex])
})

// Server starting
app.listen(port, () => console.log(`OK[port:${port}]`))