const express = require('express');
const router = express.Router();
const Template = require('../../models/Template');
const app = express();
const methodOverride = require('method-override');


app.use(methodOverride('_method'));


// @route   GET api/templates
// @desc    Get all templates by user
router.get('/', async (req, res) => {
    try {
        // const templates = await Template.find({user: req.user.id});
        // res.render('index', {templates});
        Template.find(err, templates => {
            if(err) {
                console.log(err)
            } else {
                res.sent(templates);
            }
        }
            )

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/templates
// @desc  Create a template
router.post('/', async (req, res) => {
    if(req.session.user) {
        const { title, image } = req.body;
        try {
            const newTemplate = new Template({
                title,
                image,
                user: req.session.user._id
            });
            await newTemplate.save();
            return res.redirect('/index');
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    } else {
        return redirect('/login');
    }
});

// @route   GET api/templates/:id
// @desc    Get template by id
router.get('/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        // res.render('index', [{template}]);
        res.send(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/templates/:id
// @desc    Delete a template
router.delete('/:id',async (req, res) => {
    console.log("route hit")
    try {
        await Template.findByIdAndRemove(req.params.id);
        res.redirect('/index');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
);

module.exports = router;





