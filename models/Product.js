
const mongoose = require('mongoose');
// product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: 'NA'

    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    totalStockNumber: {
        type: Number,
        default: 0,
    },
    soldStockNumber: {
        type: Number,
        default: 0,
    },
    picture: {
        type: String,
        default: 'productDefaultImage.png'
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,

            },
            text: {
                type: String,
                required: true,
                maxlength: [50, 'Length of review greater be smaller than 50']

            }
        }
    ],

});

productSchema.set('toJSON', {
    transform: (document, returnedDocument) => {
        returnedDocument.id = document._id.toString();

        delete returnedDocument._id;
        delete returnedDocument.__v;
    }
});

const Product = new mongoose.model('Poduct', productSchema);

module.exports = Product;