const express = require("express");
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');

const db = require('./connection/db');

const app = express();

app.set('view engine', 'hbs');

app.use('/public', express.static(__dirname + '/public'));
 
app.use(express.urlencoded({ extended : false}));

app.use(flash());

app.use(
    session({
        cookie:{
            httpOnly: true,
            secure: false,
            maxAge: null
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

app.get('/', function(req,res) {
    let query = `SELECT * FROM tb_blogprojek`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()

            if (err) throw err

            let data = result.rows
            let icon = []

            data = data.map((projek) => {
                return {
                    ...projek,
                    techicon : projek.techicon.split(','),
                    isLogin : req.session.isLogin
                    
                }
            })

            // console.log(data);

            res.render('index', { 
                projek: data,
                isLogin : req.session.isLogin,
                user: req.session.user,
            })
        })
    })
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

app.get('/project/:id', function(req,res) {
    let id = req.params.id

    let query = `SELECT * FROM tb_blogprojek WHERE id = ${id}`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()

            if (err) throw err

            let data = result.rows

            data = data.map((projek) => {
                return {
                    ...projek,
                }
            })

            res.render('project', { projek: data })
        })
    })
})

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

    if(days <= 7) {
        Math.floor(days) + 'hari'
    } else if(days <= 30){
        Math.ceil(days / 7) + 'minggu';
    } else{
        Math.ceil(days / 4) + 'bulan'; // Math.ceil(days / 30)
    }

    console.log(`
    title        : ${name}, 
    start        : ${startDate},
    end          : ${endDate}
    duration     : ${month} bulan,
    desc         : ${desc}, 
    technologies : ${techicon}, 
    image        : ${image}
    `)

    let query = `INSERT INTO public.tb_blogprojek(
        name, startdate, enddate, duration, "desc", techicon, img)
        VALUES ( '${name}', '${startDate}', '${endDate}', '${month}', '${desc}', '${techicon}', '${image}');`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, rows) => {
            done()

            if(!err) {
                res.redirect('/')
            } else {
                console.log(err)
            }
        })
    })



});

app.get('/delete-projek/:id', function (req, res) {
    let id = req.params.id

    let query = `DELETE FROM public.tb_blogprojek WHERE id = ${id}`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, rows) => {
            done()

            if(!err) {
                res.redirect('/')
            } else {
                console.log(err)
            }
        })
    })
});

app.get('/edit-projek/:id', function (req, res) {
    let id = req.params.id

    let query = `SELECT * FROM tb_blogprojek WHERE id = ${id}`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, result) => {
            done()

            if (err) throw err

            let data = result.rows

            data = data.map((projek) => {
                return {
                    ...projek,
                }
            })

            res.render('edit-projek', { projek: data })
        })
    })
})

app.post('/edit-projek/:id', function(req,res) {
    let id = req.params.id
    let name = req.body.nameEdit
    let desc = req.body.descEdit
    let techicon = req.body.techiconEdit
    let image = req.body.imageEdit
    let startDate = req.body.startdateEdit
    let endDate = req.body.enddateEdit

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
    id           : ${id}
    title        : ${name}, 
    start        : ${startDate},
    end          : ${endDate}
    duration     : ${month} bulan,
    desc         : ${desc}, 
    technologies : ${techicon}, 
    image        : ${image}
    `);

    let query = `
    UPDATE tb_blogprojek
	SET	name='${name}', startdate='${startDate}', enddate='${endDate}', duration='${month}', "desc"='${desc}', techicon='${techicon}', img='${image}'
	WHERE id='${id}'`

    db.connect((err, client, done) => {
        if (err) throw err

        client.query(query, (err, rows) => {
            done()

            if(!err) {
                res.redirect('/')
            } else {
                console.log(err)
            }
        })
    })
});

app.get('/register', function(req,res) {
    res.render('register')
})

app.post('/register', function(req,res) {
    const {nama, email, password} = req.body

    const hash = bcrypt.hashSync(password, 10)

    db.connect((err, client, done) => {
        if(err) throw err
        
        let query = `INSERT INTO tb_user(nama, email, password) VALUES ('${nama}', '${email}', '${hash}')`

        client.query(query, (err, result) => {
            done()
            if(err) throw err
            
            res.render('login')
        })
    })
})

app.get('/login', function(req,res) {
    res.render('login')
})

app.post('/login', function(req,res) {
    const { email, password} = req.body

    db.connect((err, client, done) => {
        if(err) throw err

        let query = `SELECT * FROM tb_user WHERE email='${email}'`

        client.query(query, (err, result) => {
            done()
            if(err) throw err

            if(result.rowCount == 0){
                req.flash('danger', 'akun tidak ditemukan')
                return res.redirect('login')
            }

            let isMatch = bcrypt.compareSync(password, result.rows[0].password)

            if(isMatch) {
                req.session.isLogin = true
                req.session.user = {
                    id : result.rows[0].id,
                    email : result.rows[0].email,
                    nama : result.rows[0].nama,
                }
                req.flash('success', 'login sukses')
                res.redirect('/')
            } else {
                req.flash('danger', 'password tidak ditemukan')
                res.redirect('/login')
            }
        })
    })
})

app.get('/logout', function (req, res) {
    req.session.destroy()
    res.redirect('/home')
})

const port = 4000
app.listen(port, function(){
    console.log(`Server running on port : ${port}`)
});
