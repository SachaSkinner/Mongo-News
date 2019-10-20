const router = require('express').Router();
const db = require('../models');

const pageModel = {
    articles: [],
    addNote: false,
    article: {},
    notes: []
}


router.get("/", function (req, res) {

    db.Article.find({})
        .then(function(data){
            pageModel.articles = data;

            res.render("home", pageModel)
        })
});

router.get("/get-notes", function(req, res){
    db.Note.find({})
        .then(function(data){
            pageModel.notes = data;
            res.render("notes", pageModel);
        })
    
});

router.post("/addnoteform", function(req, res){
    pageModel.article._id = req.body._id;
    pageModel.addNote = true;

    res.redirect("/");
})

router.post("/addnote", function(req, res){
    db.Note.create(req.body)
        .then(function(data){
            db.Article.findByIdAndUpdate(req.body._id, {
                $push: { note: data._id}
            })
            .then(function(dbData){
                pageModel.addNote = false;
                res.redirect("/");
            }, error => {
                alert("You already have a note for this article")
                pageModel.addNote = false;
                res.redirect("/");
            })
        })
})

router.get("/delete/:id", function(req, res) {
    // Remove a note using the objectID
    // res.send("Delete: " + req.params.id)
    db.Note.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return handleError(err);
        console.log("delete one")
        res.redirect("/get-notes");

      });
      
  });


module.exports = router