const express = require("express");

const app = express();

app.set('view engine', 'hbs');

app.use('/public', express.static(__dirname + '/public'));
 
app.use(express.urlencoded({ extended : false}));


const projek = []

app.get('/', function(req,res) {
    
    let myProjek = projek.map(function (data) {
        return {
            ...data,
        }
    })

    res.render('index', { project: myProjek })
});

app.get('/blog', function (req, res) {
    // console.log(blogs);

    // map = akses indeks array
    // spread opr = memanipulasi object setiap indeks

    // console.log(dataBlogs);
})

app.get('/contact-me', function(req,res) {
    res.render('contact-me')
});

app.post('/contact-me', function(req,res) {
    let name = req.body.name
    let email = req.body.email
    let phone = req.body.phone
    let subject = req.body.subject
    let message = req.body.message

    console.log(`
    name    : ${name}, 
    email   : ${email}, 
    phone   : ${phone}, 
    subject : ${subject}, 
    message : ${message}
    `)
});

app.get('/add-projek', function(req,res) {
    res.render('add-projek')
});


// function addDuration (req, res) {


//     if(days <= 7){
//         return days + 'days'
//     } else if(days <= 30) {
//         return week + 'week'
//     } else {
//         return  month + 'month'
//     }

// }

app.post('/add-projek', function(req,res) {
    let name = req.body.name
    let desc = req.body.desc
    let techicon = req.body.techicon
    let image = req.body.image
    let startDate = req.body.startdate
    let endDate = req.body.enddate

    const dateStart = new Date (startDate);
    const dateEnd = new Date (endDate);
    const time = Math.abs(dateEnd - dateStart);
    const days = Math.ceil(time / (1000 * 60 * 60 * 24));
    const week = Math.ceil(days / 7);
    const month = Math.ceil(week / 4); // Math.ceil(days / 30)

    // if(days <= 7) {
    //     Math.floor(days) + 'hari'
    // } else if(days <= 30){
    //     Math.ceil(days / 7) + 'minggu';
    // } else{
    //     Math.ceil(days / 4) + 'bulan'; // Math.ceil(days / 30)
    // }

    console.log(`
    title        : ${name}, 
    start        : ${startDate},
    end          : ${endDate}
    duration     : ${month} bulan,
    desc         : ${desc}, 
    technologies : ${techicon}, 
    image        : ${image}
    `)

    let project = {name, startDate, endDate, desc, techicon, image, month};


    projek.push(project);

    res.redirect('/')
});

app.get('/project/:id', function(req,res) {
    let id = req.params.id

    let myProjek = projek.map(function (data) {
        return {
            ...data,
            dataId : id
        }
    })

    res.render('project', {dataId: id, myProjek})
})

app.get('/delete-projek/:id', function (req, res) {
    let id = req.params.id

    projek.splice(id, 1)

    res.redirect('/')
});

app.get('/edit-projek/:id', function (req, res) {
    let id = req.params.id

    let myProjek = projek.map(function (data) {
        return {
            ...data,
            dataId : id
        }
    })

    res.render('edit-projek', { dataId: id, myProjek })

    let name = req.body.name
    let desc = req.body.desc
    let techicon = req.body.techicon
    let image = req.body.image
    let startDate = req.body.startdate
    let endDate = req.body.enddate

    let project = {id, name, startDate, endDate, desc, techicon, image, month};

    projek.push(project);

    res.redirect('/')
})

const port = 4000
app.listen(port, function(){
    console.log(`Server running on port : ${port}`)
});
